// pages/_app.js
import { useEffect } from "react";
import "../globals.css";
import packgeJSON from "../package.json";

export default function MyApp({ Component, pageProps }: any) {
  useEffect(() => {
    console.log("welcome to V" + packgeJSON.version);
  }, []);
  return <Component {...pageProps} />;
}
