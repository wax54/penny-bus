import {
  GetStaticPathsContext,
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
  InferGetStaticPropsType,
} from "next";
import { Layout } from "../../components/Layout";
import { LocationData, PARTITIONS } from "../../types";
import { styles } from "../../constants/styles";
import { Api } from "../../api";
import { NEW_LOCATION_SLUG } from "../../constants/config";

export function LocationPost({ location }: { location: LocationData }) {
  console.log(location);
  if (!location) return <div>LOADING</div>;
  return (
    <>
      <div className="bg-accent/30 text-white mt-[20px] p-10 rounded-ss-[100px]">
        <h1>{location.name}</h1>
        <h2>
          {location.pin?.lat}, {location.pin?.lng}
        </h2>
        {location.fee}
        {location.locationType}
        {location.formattedAddress}
      </div>
    </>
  );
}

export default function Location({
  location,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  if (!location) {
    return <div>LOADING!</div>;
  }
  return (
    <Layout style={styles}>
      <LocationPost location={location} />
    </Layout>
  );
}
export async function getStaticPaths({}: GetStaticPathsContext): Promise<GetStaticPathsResult> {
  const blogs = await Api.getAll<LocationData>({ type: PARTITIONS.BLOG });
  const keys =
    blogs.body?.items.map((location) => ({
      params: { slug: location.slug },
    })) ?? [];
  return {
    paths: keys,
    fallback: "blocking",
  };
}
export async function getStaticProps(
  { params }: GetStaticPropsContext<{ slug: string }>,
  admin?: boolean
): Promise<
  GetStaticPropsResult<{
    location?: LocationData;
    slug: string;
    admin?: boolean;
  }>
> {
  if (!params)
    return {
      redirect: { destination: "/", permanent: false },
    };
  const slug = params.slug;
  if (admin && slug === NEW_LOCATION_SLUG) {
    return { props: { slug, admin } };
  }
  console.log(slug);
  const { success, body, error } = await Api.get<LocationData>({
    type: PARTITIONS.LOCATION,
    slug,
  });
  console.log({ body, error, success });

  if (!success) {
    const redirect = new URLSearchParams({
      reason: error ?? `${slug}+location+not+found`,
      redirect: `/location/${slug}`,
    });
    return {
      redirect: {
        destination: "/404?" + redirect,
        permanent: false,
      },
    };
  }
  return { props: { location: body ?? null, slug } };
}
