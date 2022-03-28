import classNames from "classnames";
import PropTypes from "prop-types";
import React, { forwardRef, useImperativeHandle, useRef } from "react";
import "./styles/chatContentInputStyles.scss";

ChatContentInput.propTypes = {
  classNameExtra: PropTypes.string,
  dataPlaceholder: PropTypes.string,
  onChangeInput: PropTypes.func,
  handleOnFocus: PropTypes.func,
  handleOnBlur: PropTypes.func,
  handleOnEnter: PropTypes.func,
};

ChatContentInput.defaultProps = {
  classNameExtra: null,
  dataPlaceholder: null,
  onChangeInput: () => {},
  handleOnFocus: () => {},
  handleOnBlur: () => {},
  handleOnEnter: () => {},
};

function ChatContentInput(props, ref) {
  const {
    classNameExtra,
    dataPlaceholder,
    onChangeInput,
    handleOnFocus,
    handleOnBlur,
    handleOnEnter,
  } = props;
  const chatContentRef = useRef(null);

  useImperativeHandle(ref, () => ({
    setValueContent,
    setFocusInput,
  }));

  const handleOnInput = (e) => {
    onChangeInput && onChangeInput(e.currentTarget.innerHTML);
  };

  const setValueContent = (value) => {
    if (chatContentRef && chatContentRef.current) {
      chatContentRef.current.innerHTML = value;
    }
  };

  const setFocusInput = () => {
    if (chatContentRef && chatContentRef.current) {
      chatContentRef.current.focus();
    }
  };

  const handleOnKeyPress = (event) => {
    const isEnter = (event.which || event.keyCode) === 13 && !event.shiftKey;
    const textHasValue = !(event.currentTarget.innerHTML === "");
    const enterHasValue = isEnter && textHasValue;

    //case enter with empty value
    if (isEnter && !textHasValue) {
      event.preventDefault();
      return;
    }

    if (enterHasValue) {
      event.preventDefault();
      handleOnEnter && handleOnEnter();
    }
  };

  return (
    <div
      ref={chatContentRef}
      className={classNames("text-box chat-content-input__box", classNameExtra)}
      contentEditable
      data-placeholder={dataPlaceholder}
      onInput={handleOnInput}
      onFocus={handleOnFocus}
      onBlur={handleOnBlur}
      onKeyPress={handleOnKeyPress}
    />
  );
}

ChatContentInput = forwardRef(ChatContentInput);
export default ChatContentInput;
