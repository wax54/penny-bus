import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function NotFound() {
  const [value, setValue] = useState<string | string[]>("Not Found");
  const [redirect, setRedirect] = useState<string>("");
  const router = useRouter();
  useEffect(() => {
    router.isReady && router.query?.reason && setValue(router.query.reason);
    router.isReady &&
      router.query?.redirect &&
      setRedirect(router.query.redirect as string);
  }, [router.query?.reason, router.isReady, router.query?.redirect]);
  return (
    <div>
      <div>{value}</div>
      {redirect ? (
        <button onClick={() => router.isReady && router.replace(redirect)}>
          Try Again
        </button>
      ) : null}

      <button onClick={() => router.isReady && router.push("/home")}>
        Go Home
      </button>
    </div>
  );
}

export function getStaticProps() {
  return { props: {} };
}
