import { useEffect } from "react";
import { useLocalStorageState } from "./useLocalStorageState";

export const useColorMode = () => {
  const [colorMode, setColorMode] = useLocalStorageState<"light" | "dark">(
    "colorMode",
    "light"
  );
  useEffect(() => {
    if (colorMode && global.window.document) {
      const root = global.window.document.children[0];
      if (colorMode === "light") {
        root.classList.remove("dark");
      } else {
        root.classList.add("dark");
      }
    }
  }, [colorMode]);
  return [colorMode, setColorMode] as const;
};
