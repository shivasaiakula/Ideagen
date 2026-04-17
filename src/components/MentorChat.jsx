import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, Sparkles } from 'lucide-react';

const MentorChat = ({ project, user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: `Hi ${user?.name || 'there'}! I'm your AI Project Mentor. I've analyzed the "${project?.title}" blueprint. How can I help you get started?` }
  ]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessages = [...messages, { role: 'user', text: input }];
    setMessages(newMessages);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      let response = "That's a great question! For this project, you should focus on properly setting up your environment first. Would you like me to explain the architectural layers?";
      if (input.toLowerCase().includes('database')) {
        response = `For the "${project?.title}", I recommend using a relational database like PostgreSQL if you need complex queries, or MongoDB for faster prototyping.`;
      }
      setMessages([...newMessages, { role: 'bot', text: response }]);
    }, 1000);
  };

  return (
    <div className="mentor-chat-wrapper">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="mentor-chat-panel card"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
          >
            <div className="mentor-chat-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div className="bot-avatar">
                  <Bot size={18} />
                </div>
                <div>
                  <h4>AI Project Mentor</h4>
                  <div className="status-badge"><span className="dot"></span> Online</div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="close-btn">
                <X size={18} />
              </button>
            </div>

            <div className="mentor-chat-messages">
              {messages.map((msg, index) => (
                <div key={index} className={`message-row ${msg.role}`}>
                  <div className="message-bubble">
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleSend} className="mentor-chat-input">
              <input 
                type="text" 
                placeholder="Ask me anything..." 
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button type="submit" className="send-btn">
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button 
        className={`mentor-fab ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? <Sparkles size={24} /> : <MessageSquare size={24} />}
        {!isOpen && <span className="notification-badge">1</span>}
      </motion.button>
    </div>
  );
};

export default MentorChat;
