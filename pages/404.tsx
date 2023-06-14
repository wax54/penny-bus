import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function NotFound() {
  const [value, setValue] = useState<string | string[]>("Not Found");
  const router = useRouter();
  useEffect(() => {
    router.isReady && router.query?.reason && setValue(router.query.reason);
  }, [router.query?.reason]);
  return <div>{value}</div>;
}

export function getStatProps() {
  return { props: {} };
}
