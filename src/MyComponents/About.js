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
    <div className="container my-5" style={{ maxWidth: 700 }}>
      <div className="card shadow-sm p-4">
        <h2 className="mb-4 text-center" style={{ fontWeight: 800, letterSpacing: 1, color: "#F97316" }}>
          About Us
        </h2>
        <p style={{ fontSize: 17, color: "#222", marginBottom: 32 }}>
          Welcome to Nayeem's Store! We are committed to providing you with the best products and a seamless shopping experience. Our team is passionate about quality, customer satisfaction, and innovation. Thank you for choosing us as your trusted shopping destination.
        </p>
        <hr />
        <h3 className="mb-3" style={{ fontWeight: 700, color: "#22223b", letterSpacing: 1 }}>
          Contact Us
        </h3>
        <div style={{ fontSize: 16, color: "#333" }}>
          <div className="mb-2">
            <strong>Phone:</strong> <a href="tel:+1-555-123-4567" style={{ color: "#F97316", textDecoration: "none" }}>+1-555-123-4567</a>
          </div>
          <div className="mb-2">
            <strong>Email:</strong> <a href="mailto:support@nayeemsstore.com" style={{ color: "#F97316", textDecoration: "none" }}>support@nayeemsstore.com</a>
          </div>
          <div className="mb-2">
            <strong>Address:</strong> 1234 Market Street, Suite 500, New York, NY 10001, USA
          </div>
          <div className="mb-2">
            <strong>Customer Support:</strong> Our team is always ready to help you with any issues related to your orders, payments, or product information.
          </div>
          <div className="mb-2">
            <strong>How we help:</strong>
            <ul style={{ color: "#F97316", margin: 0, paddingLeft: 18 }}>
              <li>Quick responses to your queries via our chat assistant or email.</li>
              <li>Guidance on using the website, tracking orders, and returns.</li>
              <li>Friendly support for any technical or account-related problems.</li>
            </ul>
          </div>
          <div className="mb-2">
            <strong>Contact us anytime at:</strong> <a href="mailto:mmdnayeem4705@gmail.com" style={{ color: "#F97316", fontWeight: 600 }}>mmdnayeem4705@gmail.com</a>
          </div>
        </div>
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
    </div>
  );
}

