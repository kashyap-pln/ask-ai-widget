import React, { useState, useRef, useEffect } from "react";
import { Button, Modal } from "antd";
import { Send } from "lucide-react";
import ChatBox from "./Chatbox/ChatBox";
import "./Widget.css";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;
const APP_UID = import.meta.env.VITE_APP_UID;
const Widget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const textAreaRef = useRef(null);
  const inputDivRef = useRef(null);
  const chatEndRef = useRef(null);
  const prevConversation = [];
  const model='standard';

  const showModal = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleInput = () => {
    const textarea = textAreaRef.current;
    const inputDiv = inputDivRef.current;

    textarea.style.height = "40px";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 300)}px`;
    inputDiv.style.height = `${textarea.scrollHeight + 20}px`;
  };

  // Inside Widget component...
  const handleSendMessage = async () => {
    const textarea = textAreaRef.current;
    const userMessage = textarea.value.trim();
    if (!userMessage) return;
  
    setMessages((prev) => [...prev, { text: userMessage, isUser: true }]);
    textarea.value = "";
    textarea.style.height = "40px";
    inputDivRef.current.style.height = "60px";
    setLoading(true);
  
    try {
      // Add placeholder loading message
      setMessages((prev) => [...prev, { text: "", isUser: false, isLoading: true }]);
  
      // Replace with your actual API endpoint
      const response = await axios.post("http://localhost:4000/proxy/chat", {
        message: userMessage,
        prevConversation,
        appUID:APP_UID,
        model
      });
  
      const botReply = response.data || "No response from server.";
      generateResponse(botReply);
      console.log(response);
    } catch (error) {
      console.error("API Error:", error);
      generateResponse("Sorry, there was an error processing your request.");
    }
  };
  
  const generateResponse = (response) => {
    const questionPattern = /<questions>(.*?)<\/questions>/s;
    const match = response.match(questionPattern);
  
    let questions = [];
    if (match) {
      questions = match[1]
        .split("?")
        .map((q) => q.trim())
        .filter((q) => q.length)
        .map((q) => q.replace(/^\W+|\W+$/g, "")); // clean punctuation
      response = response.replace(questionPattern, "").trim();
    }
  
    let words = response.split(" ");
    let currentText = "";
    setLoading(false);
  
    // Remove loading
    setMessages((prev) => [...prev.slice(0, -1)]);
  
    words.forEach((word, index) => {
      setTimeout(() => {
        currentText += word + " ";
        setMessages((prev) => [
          ...prev.slice(0, -1),
          { text: currentText, isUser: false, questions },
        ]);
      }, index * 100);
    });
  };
  

    // Scroll to bottom when messages change
    useEffect(() => {
      if (chatEndRef.current) {
        chatEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, [messages]);

    const handleQuestionClick = (question) => {
      // Treat button text like a user message
      if (textAreaRef.current) {
        textAreaRef.current.value = question;
      }
      handleSendMessage();
    };
    

  return (
    <>
      <button className="ask-ai-btn" onClick={showModal}>
        Ask AI
      </button>

      <Modal
        title="Ask AI"
        open={open}
        onCancel={handleClose}
        footer={null}
        centered
        width={"40vw"}
        className="ask-AI-modal"
      >
         <p>Hi!</p>

<p>I'm an AI assistant trained on documentation, help articles, and other content.</p>

<p>Ask me anything </p>
        <ChatBox messages={messages} scrollRef={chatEndRef} handleQuestionClick={handleQuestionClick}/>

        <div ref={inputDivRef} className="askAI-input-div">
          <textarea
            ref={textAreaRef}
            className="askAI-input"
            type="text"
            placeholder="How do I get started?"
            onInput={handleInput}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <button className="send-btn" onClick={handleSendMessage}>
            <Send />
          </button>
        </div>
      </Modal>
    </>
  );
};

export default Widget;
