import { ReactElement } from "react";
export { MessageProvider, usePushMessage } from "./message";
import { MessageProvider } from "./message";
import { DataStoreProvider } from "./dataStore";

export const Providers = ({ children }: ReactElement["props"]) => {
  return (
    <MessageProvider>
      <DataStoreProvider>
        <>{children}</>
      </DataStoreProvider>
    </MessageProvider>
  );
};
