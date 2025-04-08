import React from "react";
import { Copy } from "lucide-react";
import { Button } from "antd";
import "./ChatBox.css";

const ChatBox = ({ messages, scrollRef, handleQuestionClick }) => {
  const extractTextAndCode = (message) => {
    const regex = /```([\s\S]*?)```/g;
    let parts = [];
    let lastIndex = 0;
    let match;

    // Remove trailing '/end' if present
    const cleanedMessage = message.trim().endsWith("/end")
      ? message.trim().slice(0, -4).trim()
      : message;

    while ((match = regex.exec(cleanedMessage)) !== null) {
      if (match.index > lastIndex) {
        parts.push({ type: "text", content: cleanedMessage.substring(lastIndex, match.index) });
      }
      parts.push({ type: "code", content: match[1] });
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < cleanedMessage.length) {
      parts.push({ type: "text", content: cleanedMessage.substring(lastIndex) });
    }

    return parts;
  };

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    alert("Copied to clipboard!");
  };

  return (
    <div className="chat-box">
      {messages.map((msg, index) => {
        const parts = extractTextAndCode(msg.text);

        const isFinalBotMessage =
          !msg.isUser &&
          index === messages.length - 1 &&
          (!msg.isLoading || msg.text?.length > 0);

        return (
          <div key={index} className={`message ${msg.isUser ? "user-message" : "bot-message"}`}>
            {parts.map((part, i) =>
              part.type === "text" ? (
                <p key={i} className="bot-text">{part.content}</p>
              ) : (
                <div key={i} className="code-block">
                  <button className="copy-btn" onClick={() => handleCopy(part.content)}>
                    <Copy size={18} />
                  </button>
                  <pre>
                    <code>{part.content}</code>
                  </pre>
                </div>
              )
            )}

            {/* Render question buttons ONLY after full text has rendered and only for bot */}
            {isFinalBotMessage && msg.questions && msg.questions.length > 0 && (
              <div className="question-buttons">
                {msg.questions.map((question, i) => (
                  <Button
                    key={i}
                    type="default"
                    size="small"
                    style={{ margin: "4px" }}
                    onClick={() => handleQuestionClick(question)}
                  >
                    {question}
                  </Button>
                ))}
              </div>
            )}
          </div>
        );
      })}
      <div ref={scrollRef} />
    </div>
  );
};

export default ChatBox;
