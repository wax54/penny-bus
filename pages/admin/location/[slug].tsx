import {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  InferGetStaticPropsType,
} from "next";
import * as publicSingleLocationPage from "../../location/[slug]";
// import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { useCallback, useEffect, useRef, useState } from "react";
import { Api } from "../../../api";
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
  console.log("location", slug);
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
          state: "",
          zip: "",
          countryCode: "US",
          isHidden: true,
        } as Partial<LocationData>)
  );
  const [currLocation, setCurrLocation] = useState<LocationData>(
    locationRef.current as LocationData
  );
  const [loading, setLoading] = useState(false);
  const inSync = Object.entries(currLocation).every(
    ([key, val]) =>
      JSON.stringify(val) ===
      JSON.stringify(locationRef.current[key as keyof typeof currLocation])
  );
  console.log({ inSync });
  const updateLocation = useCallback(
    (updatedLocation: Partial<LocationData> & LocationKeyComponents) => {
      console.log({ updatedLocation });
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
        manipulation({ ...updatedLocation as LocationData })
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
            alert(e)
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
        console.log("DONE", res);
        setTimeout(() => router.push("/admin/location"), 200);
      })
      .catch((e) => setLoading(false));
  }, [slug, setLoading, router]);
  return (
    <div className="bg-offWhite flex flex-column sm:flex-row">
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

        <input
          name="slug"
          disabled={slug !== NEW_BLOG_SLUG || loading}
          className="my-4 p-4 w-full"
          placeholder="Slug"
          value={currLocation.slug}
          onChange={(evt) => {
            const { value, name } = evt.target;
            setCurrLocation((location) => ({
              ...location,
              [name]: value.replace(/\s/, "-").toLowerCase(),
            }));
          }}
        />

        <input
          name="name"
          className="my-4 p-4 w-full"
          disabled={loading}
          placeholder="Name"
          value={currLocation.name}
          onChange={(evt) => {
            const { value, name } = evt.target;
            setCurrLocation((location) => ({ ...location, [name]: value }));
          }}
        />

        <select
          name="locationType"
          className="my-4 p-4 w-full"
          placeholder="Location"
          disabled={loading}
          value={currLocation.locationType}
          onChange={(evt) => {
            const { value, name } = evt.target;
            setCurrLocation((location) => ({
              ...location,
              [name]: value,
            }));
          }}
        >
          <option value="">Select</option>
          <option value="dispersed">Dispersed</option>
          <option value="campsite">Campsite</option>
          <option value="relation">Relation</option>
        </select>

        <input
          name="fee"
          className="my-4 p-4 w-full"
          disabled={loading}
          placeholder="Fee"
          value={currLocation.fee}
          type="number"
          onChange={(evt) => {
            const { value, name } = evt.target;
            setCurrLocation((location) => ({ ...location, [name]: value }));
          }}
        />
        <select
          name="rate"
          className="my-4 p-4 w-full"
          placeholder="Rate"
          disabled={loading}
          value={currLocation.rate}
          onChange={(evt) => {
            const { value, name } = evt.target;
            setCurrLocation((location) => ({
              ...location,
              [name]: value,
            }));
          }}
        >
          <option value="nightly">Nightly</option>
        </select>

        <input
          name="pin"
          disabled={loading}
          className="my-4 p-4 w-full"
          placeholder="Pin"
          value={`${
            currLocation.pin?.lat !== undefined ? currLocation.pin.lat : ""
          },${currLocation.pin?.lng !== undefined ? currLocation.pin.lng : ""}`}
          onChange={(evt) => {
            const { value, name } = evt.target;
            const [lat = "", lng = ""] = value.replace(/\s/g, "").split(",");
            console.log({ lat, lng });
            setCurrLocation((location) => ({
              ...location,
              [name]: {
                lat: lat.replace(/[^0-9-\.]/, ""),
                lng: lng.replace(/[^0-9-\.]/, ""),
              },
            }));
          }}
        />

        <select
          name="state"
          className="my-4 p-4 w-full"
          placeholder="State"
          disabled={loading}
          value={currLocation.state}
          onChange={(evt) => {
            const { value, name } = evt.target;
            setCurrLocation((location) => ({
              ...location,
              [name]: value,
            }));
          }}
        >
          {states.map((state) => (
            <option key={state.code} value={state.code}>{state.name}</option>
          ))}
        </select>

        <input
          name="zip"
          className="my-4 p-4 w-full"
          disabled={loading}
          placeholder="Zip"
          value={currLocation.zip}
          onChange={(evt) => {
            const { value, name } = evt.target;
            setCurrLocation((location) => ({ ...location, [name]: value }));
          }}
        />

        <select
          name="countryCode"
          className="my-4 p-4 w-full"
          placeholder="Country"
          disabled={loading}
          value={currLocation.countryCode}
          onChange={(evt) => {
            const { value, name } = evt.target;
            setCurrLocation((location) => ({
              ...location,
              [name]: value,
            }));
          }}
        >
          {countries.map((country) => (
            <option key={country.code} value={country.code}>{country.name}</option>
          ))}
        </select>
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
              console.log({ checked });
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
