import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import * as publicSingleLocationPage from "../../location/[slug]";
// import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { Api, ImageApi } from "../../../api";
import {
  LocationData,
  LocationKeyComponents,
  PARTITIONS,
} from "../../../types";
import { NEW_BLOG_SLUG, NEW_LOCATION_SLUG } from "../../../constants/config";
import { useRouter } from "next/router";
import Link from "next/link";
import { states } from "../../../constants/states";
import { countries } from "../../../constants/countries";
import { Image } from "../../../types/image";
import { ImagePreview } from "../../../components/ImagePreview";
import { Input } from "../../../components/Input";

const isSameFile = (
  file: Pick<Image, "name" | "size">,
  compageFile: Pick<Image, "name" | "size">
) => file.name === compageFile.name && file.size === compageFile.size;

// export const getStaticPaths = publicSingleLocationPage.getStaticPaths;
export const getServerSideProps = (
  params: GetServerSidePropsContext<{ slug: string }>
) => {
  return publicSingleLocationPage.getStaticProps(params, true);
};

export const UpdateLocation = ({
  location,
  slug,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const locationRef = useRef(
    location
      ? location
      : ({
          type: PARTITIONS.LOCATION,
          slug: "",
          name: "",
          locationType: "",
          fee: 0,
          rate: "nightly",
          city: "",
          state: "",
          zip: "",
          countryCode: "US",
          isHidden: true,
          images: [],
        } as Partial<LocationData>)
  );
  const [currLocation, setCurrLocation] = useState<LocationData>(
    locationRef.current as LocationData
  );
  const [imagesLoading, setImagesLoading] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [imageErrors, setImageErrors] = useState<{ message: string }[]>([]);
  const uploadedImages = useRef<{ name: string; size: string }[]>([]);
  useEffect(() => {
    const _run = async () => {
      try {
        if (currLocation?.images && currLocation.images.length) {
          for (let i = 0; i < currLocation.images.length; i++) {
            const image = currLocation.images[i];
            if (
              image.path ||
              uploadedImages.current.find((i) => isSameFile(i, image))
            )
              continue;
            uploadedImages.current.push(image);
            setImagesLoading((names) => [...names, image.name]);
            try {
              const uploadResponse = await ImageApi.create(image);
              if (uploadResponse.status !== 200) {
                throw Error(uploadResponse.result);
              }
              setCurrLocation((currLocation) => ({
                ...currLocation,
                images: currLocation.images?.map((i) => {
                  return isSameFile(i, image)
                    ? { ...i, path: uploadResponse.storedName, data: undefined }
                    : { ...i };
                }),
              }));
            } catch (e: any) {
              setImageErrors((errors) => [...errors, e]);
            } finally {
              setImagesLoading((names) =>
                names.filter((name) => name !== image.name)
              );
            }
          }
        }
      } catch (e) {
        console.log(e);
      }
    };

    _run();
  }, [currLocation?.images]);

  const inSync = Object.entries(currLocation).every(
    ([key, val]) =>
      JSON.stringify(val) ===
      JSON.stringify(locationRef.current[key as keyof typeof currLocation])
  );
  const updateLocation = useCallback(
    (updatedLocation: Partial<LocationData> & LocationKeyComponents) => {
      if (!updatedLocation.type) {
        throw Error("missing type!");
      } else if (!updatedLocation.slug) {
        throw Error("missing slug!");
      } else if (updatedLocation.countryCode === undefined) {
        throw Error("missing countryCode!");
      } else {
        setLoading(true);
        const manipulation =
          slug === NEW_BLOG_SLUG
            ? Api.create<LocationData>
            : Api.update<LocationData>;
        manipulation({ ...(updatedLocation as LocationData) })
          .then(() => {
            setLoading(false);
            locationRef.current = {
              ...locationRef.current,
              ...updatedLocation,
            };
            if (slug === NEW_BLOG_SLUG) {
              router.push("./" + updatedLocation.slug);
            }
          })
          .catch((e) => {
            alert(e);
            setLoading(false);
          });
      }
    },
    [slug, setLoading, router]
  );

  const deleteLocation = useCallback(() => {
    setLoading(true);
    const manipulation = Api.delete;
    if (!currLocation.type || !currLocation.slug)
      throw Error("slug or type not defined for delete");
    manipulation({ type: currLocation.type, slug: currLocation.slug })
      .then((res) => {
        setLoading(false);
        setTimeout(() => router.push("/admin/location"), 200);
      })
      .catch((e) => setLoading(false));
  }, [slug, setLoading, router, currLocation.slug, currLocation.type]);

  const handleChange = (
    evt: ChangeEvent<HTMLInputElement & HTMLSelectElement>
  ) => {
    const { value, name } = evt.target;
    const parsedValue =
      name === "slug"
        ? value.replace(/\s/, "").toLowerCase()
        : name === "pin"
        ? {
            lat:
              value
                .replace(/\s/g, "")
                .split(",")[0]
                .replace(/[^0-9-\.]/, "") ?? "",
            lng:
              value
                .replace(/\s/g, "")
                .split(",")[1]
                .replace(/[^0-9-\.]/, "") ?? "",
          }
        : value;
    setCurrLocation((location) => ({
      ...location,
      [name]: parsedValue,
    }));
  };

  return (
    <div className="bg-white flex flex-column sm:flex-row">
      <Link href="/admin/location">Location list</Link>
      <div className="p-4 flex-1">
        <div className="h-[20px]">
          {loading ? (
            <div className="bg-secondary">Loading</div>
          ) : inSync && slug !== NEW_BLOG_SLUG ? (
            <div className="bg-accent">In sync</div>
          ) : (
            <button
              className="bg-primary "
              onClick={() =>
                currLocation.type &&
                currLocation.slug &&
                updateLocation(currLocation)
              }
            >
              {slug === NEW_BLOG_SLUG ? "Create" : "Sync now"}
            </button>
          )}
        </div>

        <Input
          name="slug"
          label="Slug"
          disabled={slug !== NEW_BLOG_SLUG || loading}
          className="my-4 p-4 w-full"
          placeholder="Slug"
          value={currLocation.slug}
          onChange={handleChange}
        />

        <Input
          name="name"
          label="Name"
          className="my-4 p-4 w-full"
          disabled={loading}
          placeholder="Name"
          value={currLocation.name}
          onChange={handleChange}
        />

        <Input
          name="locationType"
          label="Location Type"
          inputType="select"
          className="my-4 p-4 w-full"
          placeholder="Location"
          disabled={loading}
          value={currLocation.locationType}
          onChange={handleChange}
        >
          <option value="">Select</option>
          <option value="dispersed">Dispersed</option>
          <option value="campsite">Campsite</option>
          <option value="relation">Relation</option>
        </Input>

        <Input
          name="fee"
          label="Fee"
          className="my-4 p-4 w-full"
          disabled={loading}
          placeholder="Fee"
          value={currLocation.fee}
          type="number"
          onChange={handleChange}
        />
        <Input
          name="rate"
          label="Rate"
          inputType="select"
          className="my-4 p-4 w-full"
          placeholder="Rate"
          disabled={loading}
          value={currLocation.rate}
          onChange={handleChange}
        >
          <option value="nightly">Nightly</option>
        </Input>

        <Input
          name="pin"
          label="Pin"
          disabled={loading}
          className="my-4 p-4 w-full"
          placeholder="Pin"
          value={`${
            currLocation.pin?.lat !== undefined ? currLocation.pin.lat : ""
          },${currLocation.pin?.lng !== undefined ? currLocation.pin.lng : ""}`}
          onChange={handleChange}
        />

        <Input
          name="city"
          label="City"
          className="my-4 p-4 w-full"
          disabled={loading}
          placeholder="City"
          value={currLocation.city}
          onChange={handleChange}
        />
        <Input
          name="state"
          label="State"
          type="select"
          className="my-4 p-4 w-full"
          placeholder="State"
          disabled={loading}
          value={currLocation.state}
          onChange={handleChange}
          inputType="select"
        >
          {states.map((state) => (
            <option key={state.code} value={state.code}>
              {state.name}
            </option>
          ))}
        </Input>

        <Input
          name="zip"
          label="Zip"
          className="my-4 p-4 w-full"
          disabled={loading}
          placeholder="Zip"
          value={currLocation.zip}
          onChange={handleChange}
        />

        <Input
          name="countryCode"
          label="Country Code"
          inputType="select"
          className="my-4 p-4 w-full"
          placeholder="Country"
          disabled={loading}
          value={currLocation.countryCode}
          onChange={handleChange}
        >
          {countries.map((country) => (
            <option key={country.code} value={country.code}>
              {country.name}
            </option>
          ))}
        </Input>
        <div>
          <label htmlFor="img">Select image:</label>
          <input
            type="file"
            multiple
            id="images"
            name="images"
            accept="image/jpeg"
            className="my-4 p-4 w-full"
            disabled={loading}
            onChange={(evt) => {
              const { files, name } = evt.target;
              if (!files) {
                alert("No files in upload");
                return;
              } else {
                for (let i = 0; i < files.length; i++) {
                  const file = files[i];
                  const reader = new FileReader();
                  reader.onload = function (e) {
                    const data = e.target?.result;
                    if (data) {
                      uploadedImages.current = uploadedImages.current.filter(
                        (i) => !isSameFile(i, file)
                      );
                      setCurrLocation((location) => ({
                        ...location,
                        images: [
                          ...(location?.images?.filter(
                            (i) => !isSameFile(i, file)
                          ) ?? []),
                          {
                            name: file.name,
                            size: file.size,
                            length: file.length,
                            data,
                          },
                        ],
                      }));
                    }
                  };
                  reader.onerror = function (e) {
                    console.log("Error : " + e.type);
                  };
                  reader.readAsDataURL(file);
                }
              }
            }}
          />
          <div className="text-secondary">
            {imageErrors.map((e, i) =>
              e.message ? (
                <div key={e.message}>{e.message}</div>
              ) : (
                <div key={i}>Unkown Image Error</div>
              )
            )}
          </div>
          <div className="text-accent">
            {currLocation.images?.map((image) => (
              <div key={image.name}>
                {image.name}
                <Input
                  name={"ref" + image.name}
                  label="Image Ref"
                  className="my-4 p-4 w-full text-primary"
                  disabled={loading}
                  placeholder="Image ref"
                  value={image.ref ?? image.name}
                  onChange={(evt) => {
                    const { value } = evt.target;
                    setCurrLocation((location) => ({
                      ...location,
                      images: currLocation.images?.map((i) => {
                        return isSameFile(i, image)
                          ? { ...i, ref: value || image.name }
                          : { ...i };
                      }),
                    }));
                  }}
                />
                {image.path ? (
                  <ImagePreview image={image} />
                ) : (
                  <div>UPLOADING...</div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div>
          <input
            id="isHidden"
            type="checkbox"
            name="isHidden"
            className="my-4 p-4 w-full"
            disabled={loading}
            checked={currLocation.isHidden ? true : false}
            onChange={(evt) => {
              const { checked, name } = evt.target;
              setCurrLocation((location) => ({ ...location, [name]: checked }));
            }}
          />
          <label htmlFor="isHidden">Is hidden</label>
        </div>
        {slug === NEW_LOCATION_SLUG ? (
          <button
            className="bg-secondary hover:bg-primary p-2 rounded my-4"
            onClick={deleteLocation}
          >
            DELETE
          </button>
        ) : null}
      </div>

      <div className="flex-1">
        <publicSingleLocationPage.LocationPost location={currLocation} />
      </div>
    </div>
  );
};

export default UpdateLocation;
