import React, { useState, useRef, useEffect } from 'react';
import api from '../services/api';
import './AiBaristaChat.css';

const AIBaristaChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: "Hey there! ☕ Welcome to CafeVerse. What can I help you find today?",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (e) => {
    e.preventDefault();

    const text = message.trim();
    if (!text || loading) return;

    setMessages((prev) => [...prev, { role: 'user', text }]);
    setMessage('');
    setLoading(true);

    try {

        const startTime = performance.now();

  console.log("☕ Sending message to AI Barista...");
      const response = await api.post('/ai-barista/chat', {
        message: text,
      });

      const elapsed = ((performance.now() - startTime) / 1000).toFixed(2);

  console.log(`✅ AI response received in ${elapsed} seconds`);

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: response.data.reply || "Sorry, I couldn't generate a reply.",
        },
      ]);
    } catch (error) {
      console.error('AI Barista error:', error.response?.data || error.message);

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: "Oops! I couldn't connect right now. Please try again. ☕",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!isOpen && (
        <button
          className="barista-launcher"
          onClick={() => setIsOpen(true)}
          aria-label="Open AI Barista chat"
          title="Chat with AI Barista"
        >
          ☕
        </button>
      )}

      {isOpen && (
        <section className="barista-window">
          <header className="barista-header">
            <div className="barista-profile">
              <div className="barista-avatar">☕</div>
              <div>
                <h3>AI Barista</h3>
                <span>Your friendly CafeVerse assistant</span>
              </div>
            </div>

            <button
              className="barista-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              ×
            </button>
          </header>

          <div className="barista-messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`barista-message ${
                  msg.role === 'user' ? 'user-message' : 'ai-message'
                }`}
              >
                {msg.text}
              </div>
            ))}

            {loading && (
              <div className="barista-message ai-message">
                Brewing a reply... ☕
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="barista-suggestions">
            <button
              type="button"
              onClick={() => setMessage('Recommend a coffee for me')}
            >
              Recommend a coffee
            </button>

            <button
              type="button"
              onClick={() => setMessage('Show me iced drinks')}
            >
              Show iced drinks
            </button>
          </div>

          <form className="barista-input-area" onSubmit={handleSend}>
            <input
              type="text"
              placeholder="Ask your AI Barista..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={loading}
            />

            <button
              type="submit"
              disabled={loading || !message.trim()}
              aria-label="Send message"
            >
              ➤
            </button>
          </form>
        </section>
      )}
    </>
  );
};

export default AIBaristaChat;
