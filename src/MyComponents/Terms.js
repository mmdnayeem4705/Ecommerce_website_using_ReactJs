import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Terms() {
  const navigate = useNavigate();
  return (
    <div className="container my-5" style={{ maxWidth: 700, background: "#fff", borderRadius: 14, boxShadow: "0 2px 12px rgba(0,0,0,0.07)", padding: "2rem" }}>
      <button
        className="mb-4"
        style={{
          background: "#F97316",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          padding: "8px 22px",
          fontWeight: 600,
          fontSize: "1.05rem",
          letterSpacing: 1,
          boxShadow: "0 2px 8px rgba(249,115,22,0.10)",
          transition: "background 0.2s, box-shadow 0.2s",
          cursor: "pointer"
        }}
        onClick={() => navigate(-1)}
      >
        &larr; Back to Signup
      </button>
      <h2 className="mb-4 text-center" style={{ color: "#F97316", fontWeight: 800 }}>Terms & Conditions</h2>
      <p>
        <strong>Welcome to Nayeem Store!</strong> <br />
        By using our website, you agree to the following terms and conditions. Please read them carefully.
      </p>
      <h5 className="mt-4" style={{ color: "#111" }}>1. User Account & Security</h5>
      <ul>
        <li>You must provide accurate and complete information during signup.</li>
        <li>Keep your password confidential and do not share your account with others.</li>
        <li>Notify us immediately if you suspect unauthorized use of your account.</li>
      </ul>
      <h5 className="mt-4" style={{ color: "#111" }}>2. Orders & Payments</h5>
      <ul>
        <li>All orders are subject to acceptance and availability.</li>
        <li>Prices and product availability may change without notice.</li>
        <li>Payments must be made through the available payment methods.</li>
      </ul>
      <h5 className="mt-4" style={{ color: "#111" }}>3. Shipping & Delivery</h5>
      <ul>
        <li>We strive to deliver your orders promptly. Delivery times may vary based on location and product availability.</li>
        <li>Orders above $100 are eligible for free delivery.</li>
      </ul>
      <h5 className="mt-4" style={{ color: "#111" }}>4. Returns & Refunds</h5>
      <ul>
        <li>Returns are accepted within 7 days of delivery for eligible products.</li>
        <li>Refunds will be processed after the returned item is received and inspected.</li>
      </ul>
      <h5 className="mt-4" style={{ color: "#111" }}>5. Privacy Policy</h5>
      <ul>
        <li>Your personal information is kept secure and is not shared with third parties except as required by law.</li>
        <li>We use your data to process orders and improve your shopping experience.</li>
      </ul>
      <h5 className="mt-4" style={{ color: "#111" }}>6. Prohibited Activities</h5>
      <ul>
        <li>No fraudulent, abusive, or illegal activities are allowed on this website.</li>
        <li>Do not attempt to hack, disrupt, or misuse the website or its services.</li>
      </ul>
      <h5 className="mt-4" style={{ color: "#111" }}>7. Changes to Terms</h5>
      <ul>
        <li>We may update these terms at any time. Please review them regularly.</li>
      </ul>
      <p className="mt-4">
        By using Nayeem Store, you agree to these terms and our privacy policy. For any questions, contact us at <a href="mailto:mmdnayeem4705@gmail.com" style={{ color: "#F97316" }}>mmdnayeem4705@gmail.com</a>.
      </p>
    </div>
  );
}
