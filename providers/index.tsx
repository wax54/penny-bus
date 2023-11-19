import {
  ReactElement,
} from "react";
export { MessageProvider, usePushMessage } from "./message";
import { MessageProvider } from "./message";

export const Providers = ({ children }: ReactElement["props"]) => {
  return (
    <MessageProvider
    >
      <>{children}</>
    </MessageProvider>
  );
};
