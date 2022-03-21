import React, { useCallback, useContext, useEffect, useState } from "react";
import { SocketContext } from "../../context/socket";
import {
  disconnectSocket,
  initiateSocketConnection,
  subscribeToChat,
} from "../../socketio.service";

ChatComponent.propTypes = {};

function ChatComponent(props) {
  // const [dataState, setDataState] = useState([]);

  // useEffect(() => {
  //   initiateSocketConnection();

  //   // return () => {
  //   //   disconnectSocket();
  //   // };
  // }, []);

  // const emitData = () => {
  //   subscribeToChat((err, data) => {
  //     const newData = [...dataState];
  //     newData.push(data);
  //     setDataState(newData);
  //   });
  // };

  // return (
  //   <div>
  //     ChatComponent
  //     <button onClick={emitData}>Add</button>
  //     {dataState.length > 0 && (
  //       <div>
  //         {dataState.map((item) => {
  //           return <div>{item}</div>;
  //         })}
  //       </div>
  //     )}
  //   </div>
  // );

  const socket = useContext(SocketContext);

  const [message, setMessage] = useState([]);
  console.log("🚀 ~ file: ChatComponent.js ~ line 47 ~ ChatComponent ~ message", message)

  const handleInviteAccepted = useCallback((data) => {
    const newData = [...message];
    newData.push(data);
    console.log("🚀 ~ file: ChatComponent.js ~ line 52 ~ handleInviteAccepted ~ newData", newData)
    setMessage(newData);
  }, []);

  const handleJoinChat = () => {
    socket.emit("my-message", `hello`);
  };

  useEffect(() => {
    // as soon as the component is mounted, do the following tasks:

    // emit USER_ONLINE event
    // socket.emit("USER_ONLINE", "hello");

    // subscribe to socket events
    // socket.on("JOIN_REQUEST_ACCEPTED", handleInviteAccepted);
    socket.on("my broadcast", handleInviteAccepted);

    return () => {
      // before the component is destroyed
      // unbind all event handlers used in this component
      socket.off("JOIN_REQUEST_ACCEPTED", handleInviteAccepted);
    };
  }, [socket, handleInviteAccepted, message]);

  return (
    <div>
      {/* {joined ? (
        <p>Click the button to send a request to join chat!</p>
      ) : (
        <p>Congratulations! You are accepted to join chat!</p>
      )} */}
      <button onClick={handleJoinChat}>Join Chat</button>
    </div>
  );
}

export default ChatComponent;
