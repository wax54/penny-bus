import {
  ReactElement,
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";
import { FromConstObject } from "../types";
import { Notification } from "../components/Notification";

export const MESSAGE_TYPES = {
  ERROR: "error",
  INFO: "info",
} as const;
type MessageType = FromConstObject<typeof MESSAGE_TYPES>;

type Message = { message: string; type: MessageType };
export const messagesContext = createContext<{
  markRead: (message: string) => void;
  push: (message: Message) => void;
  currentMessage?: Message;
}>({
  markRead: () => {},
  push: () => {},
});
export const usePushMessage = () => {
  const { push } = useContext(messagesContext);
  return push;
};

export const MessageProvider = ({ children }: ReactElement["props"]) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const push = useCallback(
    (message: Message) => {
      setMessages((msgs) => [...msgs, message]);
    },
    [setMessages]
  );

  const markRead = useCallback(
    (message: string) => {
      setMessages((msgs) => msgs.filter((msg) => msg.message !== message));
    },
    [setMessages]
  );
  return (
    <messagesContext.Provider
      value={{
        push,
        markRead,
        currentMessage: messages[0],
      }}
    >
      <Notification />
      <>{children}</>
    </messagesContext.Provider>
  );
};