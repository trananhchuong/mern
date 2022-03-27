import React, { useCallback, useContext, useEffect, useState } from "react";
import { SocketContext } from "../../context/socket";
import "./styles/chatRoomStyles.scss";
import { useForm } from "react-hook-form";

ChatRoomComponent.propTypes = {};

function ChatRoomComponent(props) {
  const socket = useContext(SocketContext);
  const [showChatForm, setIsShowChatForm] = useState(false);

  const { register, handleSubmit } = useForm();

  const [useListUserChat, setListUserChat] = useState(() => {
    return [
      {
        id: 1,
        userName: "Chuong Tran",
      },
      {
        id: 2,
        userName: "Diem Phuc",
      },
      {
        id: 3,
        userName: "Diem Hau",
      },
      {
        id: 4,
        userName: "Trang",
      },
      {
        id: 5,
        userName: "Tri",
      },
    ];
  });

  useEffect(() => {
    socket.on("server-send-client-register-fail", handleRegisterFail);
    socket.on("server-send-client-register-success", handleRegisterSuccess);

    return () => {
      // before the component is destroyed
      socket.off("server-send-client-register-fail", handleRegisterFail);
    };
  }, [showChatForm]);

  const handleRegisterFail = () => {
    alert("Đã tồn tại user name này rồi, vui lòng nhập lại!!");
  };

  const handleRegisterSuccess = (data) => {
    setIsShowChatForm(true);
  };

  const renderListUserChat = () => {
    if (useListUserChat.length > 0) {
      return (
        <div className="list-user">
          {useListUserChat.map((item) => {
            return <div className="user-item">{item.userName}</div>;
          })}
        </div>
      );
    }
  };

  const renderListChatContent = () => {
    return (
      <div className="chat-content__box">
        <div className="chat-item__box">
          <div className="user-name">Anh Chuong</div>
          <div className="chat-content">hello moi nguoi</div>
        </div>
        <div className="chat-item__box">
          <div className="user-name">Phuc</div>
          <div className="chat-content">em ne</div>
        </div>
      </div>
    );
  };

  const handleSendChat = (event) => {
    event.preventDefault();
    console.log(
      "🚀 ~ file: ChatRoomComponent.js ~ line 63 ~ handleSendChat ~ event",
      event
    );
  };

  const renderButtonChat = () => {
    return (
      <form onSubmit={handleSendChat} className="form-chat-input">
        <textarea name="chat" rows="4" cols="50"></textarea>
        <input type="submit" />
      </form>
    );
  };

  const onSubmitFormRegis = (formValues) => {
    socket.emit("client-regis-username", formValues?.userName);
  };

  if (showChatForm) {
    return (
      <div className="chat-room__box">
        <div className="title__box">
          <div className="room">Room Active</div>
        </div>
        <div className="content__box">
          <div className="content__left">
            <div className="title">List Room Chat</div>
            {renderListUserChat()}
          </div>
          <div className="content__right">
            {renderListChatContent()}
            {renderButtonChat()}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="form-register">
      <form onSubmit={handleSubmit(onSubmitFormRegis)} cl>
        <input {...register("userName")} />

        <button type="submit">Regis</button>
      </form>
    </div>
  );
}

export default ChatRoomComponent;
