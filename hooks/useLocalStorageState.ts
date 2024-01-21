import { useEffect, useState } from "react";

const useLocalStorageState = <StateType>(
  storageName: string,
  init?: StateType
) => {
  function getState(): StateType | undefined {
    try {
      const storedState = global?.window?.localStorage?.[storageName];
      return storedState ? JSON.parse(storedState) : init;
    } catch (e) {
      console.error(e);
      return init;
    }
  }
  const [state, setState] = useState(getState());
  useEffect(() => {
    if (global?.window?.localStorage) {
      global.window.localStorage[storageName] = JSON.stringify(state);
    }
  }, [state, storageName]);

  return [state, setState] as const;
};

export { useLocalStorageState };
