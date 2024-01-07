import { ReactElement } from "react";
export { MessageProvider, usePushMessage } from "./message";
import { MessageProvider } from "./message";
import { DataStoreProvider } from "./dataStore";
import { AuthProvider } from "./authProvider";

export const Providers = ({ children }: ReactElement["props"]) => {
  return (
    <MessageProvider>
      <DataStoreProvider>
        <AuthProvider>
          <>{children}</>
        </AuthProvider>
      </DataStoreProvider>
    </MessageProvider>
  );
};
