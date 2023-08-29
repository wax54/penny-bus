import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import { nav } from "../../constants/nav";
import { useState } from "react";
import { LocationData, PARTITIONS } from "../../types";
import { Api } from "../../api";
import { NEW_LOCATION_SLUG } from "../../constants/config";
import { Layout } from "../../components/Layout";

const sortByLat = (a: LocationData, b: LocationData) =>
  a.pin.lat > b.pin.lat ? 1 : a.pin.lat === b.pin.lat ? 0 : -1;

const sortByName = (a: LocationData, b: LocationData) =>
  a.name > b.name ? 1 : a.name === b.name ? 0 : -1;

const sortOptions = [
  {
    label: "Name",
    value: "name",
    sortFunc: sortByName,
  },
  {
    label: "Latitude",
    value: "latitude",
    sortFunc: sortByLat,
  },
];

export default function Location({
  locations,
  admin,
}: InferGetStaticPropsType<typeof getServerSideProps> & { admin?: boolean }) {
  const [sort, setSort] = useState(sortOptions[0]);
  const progressSort = () => {
    setSort((sort) => {
      const curr = sortOptions.findIndex(
        (option) => option.value === sort.value
      );
      const next = curr + 1;
      return next < sortOptions.length ? sortOptions[next] : sortOptions[0];
    });
  };

  return (
    <Layout nav={nav} admin={admin}>
      <h2
        style={{
          color: "white",
          textAlign: "center",
          padding: 10,
          margin: 10,
          fontSize: "2rem",
        }}
      >
        Our LocationApi!
      </h2>
      {admin ? <a href={`./location/${NEW_LOCATION_SLUG}`}>New post</a> : null}

      <div className="flex justify-end">
        <button
          className="rounded bg-primary/50 px-4 py-2 mr-2 hover:bg-secondary/50 hover:text-textSecondary"
          onClick={progressSort}
        >
          Sort by: {sort.label}
        </button>
      </div>
      <ol style={{ margin: 20 }}>
        {locations
          ? locations
              .sort((a, b) => sort.sortFunc(a, b))
              .map((location) => (
                <li
                  key={location.slug}
                  style={{ margin: "auto" }}
                  className="flex"
                >
                  <a
                    href={`./location/${location.slug}`}
                    className="flex-1 rounded-xl decoration-none bg-primary text-text-primary border-b-[2px] border-transparent hover:border-white hover:bg-secondary   hover:text-textSecondary cursor-pointer flex justify-between"
                    style={{
                      textTransform: "capitalize",
                      padding: 10,
                      margin: 10,
                      fontSize: "2rem",
                    }}
                  >
                    <span style={{ flex: "0 0 auto" }}>{location.name}</span>
                    <span style={{ flex: "0 0 auto" }}>
                      {location.pin.lat}, {location.pin.lng}
                    </span>
                    <span style={{ flex: "0 0 auto" }}>
                      {location.formattedAddress}
                    </span>
                  </a>
                </li>
              ))
          : "NO LOCATIONS"}
      </ol>
    </Layout>
  );
}

export async function getServerSideProps({}: GetStaticPropsContext) {
  const response = await Api.getAll<LocationData>({
    type: PARTITIONS.LOCATION,
  });
  console.log("repsonse");
  return {
    props: {
      locations: response.body?.items ?? [],
      // locations: [] as LocationData[]
    },
  };
}
