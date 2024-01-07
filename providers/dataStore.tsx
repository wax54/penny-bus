import { createContext, useContext, useEffect, useState } from "react";
import { LocationData, PARTITIONS } from "../types";
import { Api } from "../api";

type Loadable<DataType> =
  | {
      data?: DataType | undefined;
      loading: true;
      error?: string;
    }
  | {
      data: DataType;
      loading: false;
      error?: string;
    }
  | {
      data?: DataType;
      loading: false;
      error: string;
    };

const dataStoreContext = createContext<{
  locations?: Loadable<LocationData[]>;
}>({});

export const DataStoreProvider = ({ children }: { children: JSX.Element }) => {
  const [locations, setLocations] = useState<Loadable<LocationData[]>>({
    loading: true,
  });

  useEffect(() => {
    const _getLocations = async () => {
      setLocations((state) => ({ ...state, loading: true }));
      const locations = await Api.getAll<LocationData>({
        type: PARTITIONS.LOCATION,
      });
      if (locations.success) {
        setLocations((state) => ({
          ...state,
          data: locations.body.items,
          loading: false,
        }));
      } else {
        setLocations((state) => ({
          ...state,
          error: locations.error,
          loading: false,
        }));
      }
    };
    _getLocations();
  }, []);
  return (
    <dataStoreContext.Provider
      value={{
        locations,
      }}
    >
      <>{children}</>
    </dataStoreContext.Provider>
  );
};
export const useLocations = () => {
  const data = useContext(dataStoreContext);
  return data.locations;
};
