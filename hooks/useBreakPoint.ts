import { useEffect, useState } from "react";
import { breakPoints } from "../breakPoints";
const breakPointOptions = ["2xl", "xl", "lg", "md"] as const;
export const getBreakPoint = () =>
  breakPointOptions.find((key) => {
    return global?.window?.innerWidth > (breakPoints as any)[key];
  }) ?? "sm";
export const useBreakPoint = () => {
  const [breakPoint, setBreakPoint] = useState(getBreakPoint);

  useEffect(() => {
    const onResize = () => {
      setBreakPoint(getBreakPoint());
    };

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, [setBreakPoint]);

  return breakPoint;
};
