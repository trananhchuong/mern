import React, { useCallback, useContext, useEffect, useState } from "react";
import { SocketContext } from "../../context/socket";

ChatComponent.propTypes = {};

function ChatComponent(props) {
  const socket = useContext(SocketContext);

  const [message, setMessage] = useState([]);

  const handleInviteAccepted = useCallback(
    (data) => {
      const newData = [...message];
      newData.push(data);

      setMessage(newData);
    },
    [message]
  );

  const getFullDate = () => {
    const d = new Date();
    const dformat =
      [d.getDate(), d.getMonth() + 1, d.getFullYear()].join("/") +
      " " +
      [d.getHours(), d.getMinutes(), d.getSeconds()].join(":");

    return dformat;
  };

  const handleJoinChat = () => {
    socket.emit("my-message", `hello this time is ${getFullDate()}`);
  };

  useEffect(() => {
    socket.on("my-broadcast", handleInviteAccepted);

    return () => {
      // before the component is destroyed
      socket.off("my-broadcast", handleInviteAccepted);
    };
  }, [socket, handleInviteAccepted, message]);

  const renderMessage = () => {
    if (message.length > 0) {
      return message.map((item) => {
        return <div>{item}</div>;
      });
    }
  };

  return (
    <div>
      <button onClick={handleJoinChat}>Join Chat</button>
      {renderMessage()}
    </div>
  );
}

export default ChatComponent;
