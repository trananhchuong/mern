import React, { useRef, useContext, useEffect, useState } from "react";
import { SocketContext } from "../../context/socket";
import "./styles/chatRoomStyles.scss";
import { useForm } from "react-hook-form";
import ChatContentInput from "./ChatContentInput";
import useDebounce from "../../hook/useDebounce";

ChatRoomComponent.propTypes = {};

function ChatRoomComponent(props) {
  const socket = useContext(SocketContext);
  const [showChatForm, setIsShowChatForm] = useState(false);
  const chatContentRef = useRef(null);

  const { register, handleSubmit, setValue, getValues } = useForm();

  const [listUserChat, setListUserChat] = useState([]);
  const [userName, setUserName] = useState({});
  const [listMessage, setListMessage] = useState([]);

  useEffect(() => {
    socket.on("server-send-client-register-fail", handleRegisterFail);
    socket.on("server-send-client-register-success", handleRegisterSuccess);
    socket.on("server-send-list-user", handleRefreshListUser);
    socket.on("server-send-list-message", handleRefreshListMessage);

    return () => {
      // before the component is destroyed
      socket.off("server-send-client-register-fail", handleRegisterFail);
      socket.off("server-send-client-register-success", handleRegisterSuccess);
      socket.off("server-send-list-user", handleRefreshListUser);
      socket.off("server-send-list-message", handleRefreshListMessage);
    };
  }, [showChatForm]);

  const handleRefreshListMessage = (listMessageFromServer) => {
    setListMessage(listMessageFromServer);
  };

  const handleRefreshListUser = (listUser) => {
    setListUserChat(listUser);
  };

  const handleRegisterFail = () => {
    alert("Đã tồn tại user name này rồi, vui lòng nhập lại!!");
  };

  const handleRegisterSuccess = (data) => {
    setIsShowChatForm(true);
    setUserName(data);
  };

  const renderListUserChat = () => {
    if (listUserChat.length > 0) {
      return (
        <div className="list-user">
          {listUserChat.map((item) => {
            const { userName, id } = item;
            return (
              <div className="user-item" key={id}>
                {userName}
              </div>
            );
          })}
        </div>
      );
    }
  };

  const renderListChatContent = () => {
    return (
      <div className="chat-content__box">
        {listMessage.map((item) => {
          const { id, userName, message } = item;
          return (
            <div className="chat-item__box" key={id}>
              <div className="user-name">{userName}</div>
              <div className="chat-content">{message}</div>
            </div>
          );
        })}
      </div>
    );
  };

  const handleSendChat = (event) => {
    event.preventDefault();

    const { chatContent } = getValues();

    handleSendMessage(chatContent);
  };

  const handleOnchangeContentDebounced = useDebounce((value) => {
    handleChangeContent(value);
  }, 100);

  const handleChangeContent = (valueChange) => {
    // handleDisabledBtnSend(valueChange);
    setValue("chatContent", valueChange);

    // if (valueChange.trim().length === 0) {
    //   sendChannelMessage(STATUS_CONSTANTS.END_TYPING);
    // } else {
    //   sendChannelMessage(STATUS_CONSTANTS.USER_TYPING);
    // }
  };

  const submitMessage = (event) => {
    event && event.preventDefault();
    const { chatContent } = getValues();
    if (!chatContent) return;

    if (chatContent.trim().length === 0) return;
    // sendChannelMessage(chatContent);
    setValue("chatContent", "");
    chatContentRef.current.setValueContent("");

    handleSendMessage(chatContent);

    // listMessagesRef.current.scrollToElement();
    // handleDisabledBtnSend(null);
  };

  const handleSendMessage = (message) => {
    const valuePost = {
      userName,
      message,
    };

    socket.emit("client-send-message", valuePost);
  };

  const renderButtonChat = () => {
    return (
      <form onSubmit={handleSendChat} className="form-chat-input">
        <ChatContentInput
          ref={chatContentRef}
          dataPlaceholder="Aa"
          onChangeInput={handleOnchangeContentDebounced}
          handleOnEnter={submitMessage}
        />
        <textarea name="chat" rows="4" cols="50" onKeyUp={handleSendChat} />
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
