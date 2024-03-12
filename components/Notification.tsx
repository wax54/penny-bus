import { useContext } from "react";
import { messagesContext } from "../providers/message";

export const Notification = () => {
  const { currentMessage, markRead } = useContext(messagesContext);
  const bgClass =
    currentMessage?.type === "info"
      ? " bg-primary text-textPrimary "
      : currentMessage?.type === "error"
      ? " bg-warning text-textWarning "
      : "";
  return currentMessage ? (
    <div className={`absolute top-4 left-4 p-4 rounded-xl ${bgClass}`}>
      <button
        className="absolute top-2 left-4 hover:opacity-75"
        onClick={() => markRead(currentMessage.message)}
      >
        X
      </button>
      <div className="p-4 m-2 capitalize">{currentMessage.message}</div>
    </div>
  ) : null;
};
