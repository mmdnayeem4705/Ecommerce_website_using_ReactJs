import React, { useState, useRef, useEffect } from 'react';

const botReplies = (msg) => {
  const text = msg.toLowerCase();
  if (text.includes('hello') || text.includes('hi')) return "Hello! How can I help you today?";
  if (text.includes('order')) return "You can view your orders in the History page after confirming them in the Cart.";
  if (text.includes('delivery')) return "Orders above $100 are eligible for free delivery!";
  if (text.includes('product')) return "You can browse products on the Products page.";
  if (text.includes('bye')) return "Goodbye! Have a great day!";
  return "Sorry, I didn't understand that. Please ask about products, orders, or delivery.";
};

export default function About() {
  const [messages, setMessages] = useState([
    { from: 'bot', text: "Hi! I'm your store assistant. Ask me anything about this site." }
  ]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = { from: 'user', text: input };
    setMessages((msgs) => [...msgs, userMsg]);
    setTimeout(() => {
      setMessages((msgs) => [
        ...msgs,
        { from: 'bot', text: botReplies(input) }
      ]);
    }, 500);
    setInput('');
  };

  return (
    <div
      className="container my-4"
      style={{
        maxWidth: 650,
        background: "linear-gradient(135deg, #FFF7ED 60%, #F97316 100%)",
        borderRadius: 18,
        boxShadow: "0 4px 24px rgba(249,115,22,0.10)",
        padding: "2.5rem 1.5rem"
      }}
    >
      <h2 className="mb-3 text-center" style={{
        color: "#F97316",
        fontWeight: 800,
        letterSpacing: 1,
        background: "#FFD8B0",
        borderRadius: 10,
        padding: "10px 0"
      }}>
        About Us
      </h2>
      <p style={{
        color: "#1E293B",
        fontSize: "1.1rem",
        background: "#FFF7ED",
        borderRadius: 8,
        padding: "16px 18px",
        marginBottom: 18,
        boxShadow: "0 2px 8px rgba(249,115,22,0.04)"
      }}>
        At <strong>Nayeem Store</strong>, we are committed to providing you with the best online shopping experience.<br />
        <strong>Customer Support:</strong> Our team is always ready to help you with any issues related to your orders, payments, or product information.<br />
        <strong>How we help:</strong><br />
        <span style={{ color: "#F97316" }}>
          • Quick responses to your queries via our chat assistant or email.<br />
          • Guidance on using the website, tracking orders, and returns.<br />
          • Friendly support for any technical or account-related problems.<br />
        </span>
        <br />
        <strong>Contact us anytime at:</strong> <a href="mailto:mmdnayeem4705@gmail.com" style={{ color: "#F97316", fontWeight: 600 }}>mmdnayeem4705@gmail.com</a>
      </p>
      <p className="mb-2" style={{ color: "#F97316", fontWeight: 600 }}>Feel free to ask anything.</p>
      <div
        className="card p-3"
        style={{
          minHeight: 150,
          background: "#fff",
          borderRadius: 14,
          boxShadow: "0 2px 12px rgba(249,115,22,0.08)"
        }}
      >
        <h5 className="mb-3 text-center" style={{ color: "#F97316", fontWeight: 700 }}>Chat with our Assistant</h5>
        <div
          style={{
            maxHeight: 200,
            overflowY: 'auto',
            marginBottom: 10,
            background: "#FFF7ED",
            borderRadius: 8,
            padding: 10,
            border: "1px solid #FFD8B0"
          }}
        >
          {messages.map((msg, idx) => (
            <div key={idx} style={{ textAlign: msg.from === 'user' ? 'right' : 'left', margin: '6px 0' }}>
              <span
                style={{
                  display: 'inline-block',
                  background: msg.from === 'user' ? '#F97316' : '#FFD8B0',
                  color: msg.from === 'user' ? '#fff' : '#B45309',
                  borderRadius: 12,
                  padding: '6px 14px',
                  maxWidth: '80%',
                  wordBreak: 'break-word',
                  fontWeight: msg.from === 'user' ? 600 : 500
                }}
              >
                {msg.text}
              </span>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
        <form className="d-flex" onSubmit={handleSend}>
          <input
            className="form-control me-2"
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={e => setInput(e.target.value)}
            autoFocus
            style={{
              borderRadius: 8,
              border: "1px solid #FFD8B0",
              background: "#FFF7ED",
              color: "#B45309"
            }}
          />
          <button
            className="btn"
            type="submit"
            style={{
              background: "linear-gradient(90deg, #F97316 60%, #FFD93D 100%)",
              color: "#fff",
              fontWeight: 700,
              borderRadius: 8,
              padding: "0 28px",
              boxShadow: "0 2px 8px rgba(249,115,22,0.10)",
              border: "none",
              letterSpacing: 1,
              fontSize: "1.1rem",
              transition: "background 0.2s, box-shadow 0.2s"
            }}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
