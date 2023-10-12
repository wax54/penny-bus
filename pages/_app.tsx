// pages/_app.js
import { useEffect } from "react";
import "../globals.css";
import packgeJSON from "../package.json";
import Head from "next/head";

export default function MyApp({ Component, pageProps }: any) {
  useEffect(() => {
    console.log("welcome to V" + packgeJSON.version);
  }, []);
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1 minimum-scale=1" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
