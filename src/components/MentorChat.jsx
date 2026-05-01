import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, Sparkles, Loader } from 'lucide-react';
import { fetchMentorMessages, saveMentorMessage } from '../lib/db';

const QUICK_REPLIES = ['How do I start?', 'Best tech to use?', 'Explain the roadmap', 'How to deploy?'];

const getBotResponse = (userQuery, project) => {
  const q = userQuery.toLowerCase();
  if (q.includes('start') || q.includes('begin') || q.includes('roadmap'))
    return `Great question! Start with **Phase 1: ${project?.roadmap?.[0]?.title}**. Break it into daily tasks — aim for 2–3 hours of focused coding per day. Consistency beats intensity! 🎯`;
  if (q.includes('database') || q.includes('sql') || q.includes('data'))
    return `For the data layer, I recommend **${project?.technologies?.find(t => t.toLowerCase().includes('sql') || t.toLowerCase().includes('base') || t.toLowerCase().includes('mongo')) || 'PostgreSQL'}**. Normalize your schemas early — it saves major refactoring later.`;
  if (q.includes('architecture') || q.includes('system') || q.includes('design'))
    return `For a **${project?.difficultyLevel}** project, decouple your frontend from the backend. Use ${project?.technologies?.[0] || 'React'} on the client and keep your API RESTful or GraphQL-based. This makes testing and scaling much easier. 🏗️`;
  if (q.includes('error') || q.includes('bug') || q.includes('stuck'))
    return `Don't panic — 90% of dev is debugging! Check your browser console and terminal logs carefully. Since you're using **${project?.technologies?.slice(0, 2).join(' & ') || 'this stack'}**, double-check dependency versions and env variables. 🔍`;
  if (q.includes('deploy') || q.includes('host') || q.includes('publish'))
    return `Ready to ship? For **${project?.technologies?.join(', ')}**, I'd recommend **Vercel** for frontend and **Render** for backend — both free for students. Set up CI/CD from day one for a pro workflow! 🚀`;
  if (q.includes('tech') || q.includes('stack') || q.includes('language'))
    return `Your blueprint uses **${project?.techStack?.join(', ')}**. These are industry-standard choices. Master one technology at a time — start with ${project?.techStack?.[0]} before moving on. 💡`;
  return `That's a great point! For **"${project?.title}"**, the key is to focus phase by phase. Want me to break down any specific phase in more detail? 🧠`;
};

const MentorChat = ({ project, user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const chatEndRef = useRef(null);
  const prevProjectIdRef = useRef(null);

  // ─── Load chat history from Supabase when project or open state changes ────
  useEffect(() => {
    if (!user?.id || !project?.id) return;

    // Reset when project changes
    if (prevProjectIdRef.current !== project.id) {
      setMessages([]);
      setHistoryLoaded(false);
      prevProjectIdRef.current = project.id;
    }

    if (!isOpen || historyLoaded) return;

    let cancelled = false;
    const load = async () => {
      try {
        const history = await fetchMentorMessages(user.id, project.id);
        if (cancelled) return;
        if (history.length > 0) {
          setMessages(history);
        } else {
          // First-time greeting
          setMessages([{
            role: 'bot',
            text: `Hi ${user?.name || 'there'}! 👋 I'm your AI Project Mentor. I've analyzed the **"${project?.title}"** blueprint. Ask me anything!`,
          }]);
        }
        setHistoryLoaded(true);
      } catch (err) {
        console.error('Failed to load mentor messages:', err);
        setMessages([{
          role: 'bot',
          text: `Hi ${user?.name || 'there'}! 👋 Ready to help with **"${project?.title}"**. Ask me anything!`,
        }]);
        setHistoryLoaded(true);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [isOpen, user?.id, project?.id, historyLoaded]);

  // ─── Reset history flag when project changes ───────────────────────────────
  useEffect(() => {
    if (project?.id !== prevProjectIdRef.current) {
      setHistoryLoaded(false);
    }
  }, [project?.id]);

  // ─── Auto-scroll ───────────────────────────────────────────────────────────
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // ─── Send message ─────────────────────────────────────────────────────────
  const handleSend = async (e, quickText) => {
    if (e) e.preventDefault();
    const text = (quickText || input).trim();
    if (!text || isTyping || isSaving) return;

    const userMsg = { role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Persist user message
    if (user?.id && project?.id) {
      saveMentorMessage(user.id, project.id, 'user', text).catch(console.error);
    }

    // Simulate AI thinking
    const delay = 1200 + Math.random() * 600;
    setTimeout(async () => {
      const botText = getBotResponse(text, project);
      const botMsg = { role: 'bot', text: botText };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);

      // Persist bot message
      if (user?.id && project?.id) {
        saveMentorMessage(user.id, project.id, 'bot', botText).catch(console.error);
      }
    }, delay);
  };

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="mentor-chat-wrapper">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="mentor-chat-panel"
            initial={{ opacity: 0, y: 24, scale: 0.93 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.93 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Header */}
            <div className="mentor-chat-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div className="bot-avatar"><Bot size={18} /></div>
                <div>
                  <h4>AI Project Mentor</h4>
                  <div className="status-badge">
                    <span className="dot" /> Online · Analyzing {project?.title}
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="close-btn">
                <X size={17} />
              </button>
            </div>

            {/* Messages */}
            <div className="mentor-chat-messages">
              {!historyLoaded ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, gap: '10px', color: '#94a3b8', fontSize: '13px' }}>
                  <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> Loading history…
                </div>
              ) : (
                messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    className={`message-row ${msg.role}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="message-bubble" style={{ whiteSpace: 'pre-line' }}>
                      {msg.text.replace(/\*\*(.*?)\*\*/g, '$1')}
                    </div>
                  </motion.div>
                ))
              )}

              {/* Typing indicator */}
              <AnimatePresence>
                {isTyping && (
                  <motion.div className="message-row bot"
                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  >
                    <div className="message-bubble" style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '12px 16px' }}>
                      {[0, 1, 2].map(i => (
                        <motion.span key={i}
                          style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#94a3b8', display: 'block' }}
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15 }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={chatEndRef} />
            </div>

            {/* Quick Replies — only show when fresh */}
            {historyLoaded && messages.length <= 2 && (
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', padding: '10px 14px', background: '#fafbfc', borderTop: '1px solid #f1f5f9' }}>
                {QUICK_REPLIES.map(q => (
                  <motion.button key={q}
                    onClick={() => handleSend(null, q)}
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    style={{
                      padding: '5px 11px', fontSize: '11px', fontWeight: 600,
                      borderRadius: '100px', border: '1px solid #e2e8f0',
                      background: 'white', color: '#475569', cursor: 'pointer',
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    {q}
                  </motion.button>
                ))}
              </div>
            )}

            {/* Input */}
            <form onSubmit={handleSend} className="mentor-chat-input">
              <input
                type="text"
                placeholder="Ask me anything about your project…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isTyping || !historyLoaded}
              />
              <motion.button
                type="submit"
                className="send-btn"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                disabled={isTyping || !input.trim() || !historyLoaded}
              >
                <Send size={17} />
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB */}
      <motion.button
        className={`mentor-fab ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
        animate={!isOpen ? { scale: [1, 1.05, 1] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <Sparkles size={22} />
            </motion.span>
          ) : (
            <motion.span key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <MessageSquare size={22} />
            </motion.span>
          )}
        </AnimatePresence>
        {!isOpen && <span className="notification-badge">AI</span>}
      </motion.button>
    </div>
  );
};

export default MentorChat;
