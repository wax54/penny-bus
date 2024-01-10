import { useRouter } from "next/router";
import { useLocalStorageState } from "./useLocalStorageState";
import { useEffect } from "react";
export type FeatureFlags = "light-blue" | "dark-blue" | "orange" | "none";
export const useFeatureGate = () => {
  const router = useRouter();
  const feature = router.query["feature"] as FeatureFlags;
  const [featureFlag, setFeatureFlag] = useLocalStorageState(
    "featureFlag",
    feature
  );
  useEffect(() => {
    if (feature) {
      setFeatureFlag(feature);
    }
  }, [feature]);
  return featureFlag;
};
