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
    <div className="container my-4" style={{ maxWidth: 600 }}>
      <h2>...</h2>
      <p>Feel free to ask anything.</p>
      <div className="card p-3" style={{ minHeight: 350, background: "#f9f9f9" }}>
        <h5 className="mb-3">Chat with our Assistant</h5>
        <div style={{ maxHeight: 200, overflowY: 'auto', marginBottom: 10, background: "#fff", borderRadius: 8, padding: 10, border: "1px solid #eee" }}>
          {messages.map((msg, idx) => (
            <div key={idx} style={{ textAlign: msg.from === 'user' ? 'right' : 'left', margin: '6px 0' }}>
              <span
                style={{
                  display: 'inline-block',
                  background: msg.from === 'user' ? '#0d6efd' : '#eee',
                  color: msg.from === 'user' ? '#fff' : '#222',
                  borderRadius: 12,
                  padding: '6px 14px',
                  maxWidth: '80%',
                  wordBreak: 'break-word'
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
          />
          <button className="btn btn-primary" type="submit">Send</button>
        </form>
      </div>
    </div>
  );
}
