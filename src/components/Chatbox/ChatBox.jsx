import React, { useState, useEffect } from "react";
import { Copy } from "lucide-react";
import './ChatBox.css';
import { message } from "antd";

const ChatBox = ({ messages, scrollRef, handleSendMessage, textAreaRef, loading }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [copiedCode, setCopiedCode] = useState(null);

  useEffect(() => {
    if (copiedCode !== null) {
      messageApi.open({
        type: 'success',
        content: 'Copied to clipboard!',
      });
      setCopiedCode(null);
    }
  }, [copiedCode, messageApi]);

  const extractTextAndCode = (message) => {
    const regex = /```([\s\S]*?)```/g;
    let parts = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(message)) !== null) {
      if (match.index > lastIndex) {
        parts.push({ type: "text", content: message.substring(lastIndex, match.index) });
      }
      parts.push({ type: "code", content: match[1] });
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < message.length) {
      parts.push({ type: "text", content: message.substring(lastIndex) });
    }

    return parts;
  };

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code); // triggers useEffect
  };

  return (
    <div className="chat-box">
      {contextHolder}
      {messages.map((msg, index) => (
        <div key={index} className={`message ${msg.isUser ? "user-message" : "bot-message"}`}>
          {extractTextAndCode(msg.text).map((part, i) =>
            part.type === "text" ? (
              <p key={i} className="bot-text">{part.content}</p>
            ) : (
              <div key={i} className="code-block">
                <button className="copy-btn" onClick={() => handleCopy(part.content)}>
                  <Copy size={18} />
                </button>
                <pre><code>{part.content}</code></pre>
              </div>
            )
          )}

          {msg.questions?.length > 0 && (
            <div className="question-buttons">
              {msg.questions.map((q, idx) => (
                <button
                  key={idx}
                  className="ant-btn ant-btn-outlined"
                  onClick={() => {
                    const syntheticEvent = { key: "Enter", shiftKey: false, preventDefault: () => {} };
                    textAreaRef.current.value = q;
                    handleSendMessage(syntheticEvent, q);
                  }}
                  style={{ marginRight: "8px", marginBottom: "8px" }}
                >
                  {q}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}

      {loading && (
        <div className="bot-message">
          <div className="loader"></div>
        </div>
      )}

      <div ref={scrollRef} />
    </div>
  );
};

export default ChatBox;
