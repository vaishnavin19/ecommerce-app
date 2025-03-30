import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import '../ChatInterface.css';

const ChatInterface = ({ onSearch, onClose, chatHistory, setChatHistory }) => {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    const userMessage = { sender: 'user', text: message };
    setChatHistory(prev => [...prev, userMessage]);
    setMessage('');
    
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/products/search?query=${encodeURIComponent(message)}`
      );
      
      const botText = response.data.length > 0 
        ? `Found ${response.data.length} matching products`
        : 'No products found matching your search';
        
      setChatHistory(prev => [...prev, { sender: 'bot', text: botText }]);
      onSearch(message);
    } catch (error) {
      setChatHistory(prev => [...prev, { 
        sender: 'bot', 
        text: 'Sorry, I encountered an error' 
      }]);
    }
  };

  return (
    <div className="chat-interface">
      <div className="chat-header">
        <h3>Product Assistant</h3>
        <button onClick={onClose} className="close-button">✕</button>
      </div>
      
      <div className="chat-messages">
        {chatHistory.map((msg, i) => (
          <div key={i} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSubmit} className="chat-input">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask about products..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatInterface;