import {
  ReactElement,
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";
import { FromConstObject } from "../types";

export const MESSAGE_TYPES = {
  ERROR: 'error',
  INFO: 'info',
} as const
type MessageType = FromConstObject<typeof MESSAGE_TYPES>

type Message = { message: string; type: MessageType };
const messagesContext = createContext<{
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
  console.log(messages)
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

const Notification = () => {
  const { currentMessage, markRead } = useContext(messagesContext);
  const bgClass =
    currentMessage?.type === "info"
      ? "bg-primary"
      : currentMessage?.type === "error"
      ? "bg-secondary"
      : "";
  return currentMessage ? (
    <div className={`absolute top-4 right-4 p-4 ${bgClass}`}>
      <button
        className="absolute top-2 right-2"
        onClick={() => markRead(currentMessage.message)}
      >
        X
      </button>
      <div className="p-4 m-2">{currentMessage.message}</div>
    </div>
  ) : null;
};
