import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp, doc as firestoreDoc, getDoc } from 'firebase/firestore';

const COUPONS = [
  { code: 'SAVE10', desc: 'Get 10% off', value: 0.10 },
  { code: 'OFF50', desc: 'Flat $50 off', value: 50, type: 'flat' },
  { code: 'OFF99', desc: 'Flat $99 off', value: 99, type: 'flat' },
  { code: 'BIG20', desc: '20% off', value: 0.20 }
];

export default function BillSummary({ cart, user, setCart }) {
  const navigate = useNavigate();
  const [coupon, setCoupon] = useState('');
  const [applied, setApplied] = useState(null);
  const [error, setError] = useState('');
  const [orderLoading, setOrderLoading] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);

  // Free delivery if subtotal > 300
  let shipping = subtotal > 0 ? 20 : 0;
  let freeDelivery = false;
  if (subtotal > 300) {
    shipping = 0;
    freeDelivery = true;
  }

  let discount = 0;
  let appliedCoupon = COUPONS.find(c => c.code === applied);
  if (appliedCoupon) {
    if (appliedCoupon.type === 'flat') {
      discount = appliedCoupon.value;
    } else {
      discount = subtotal * appliedCoupon.value;
    }
  }
  const total = Math.max(0, subtotal + shipping - discount);

  const handleApply = (code) => {
    const found = COUPONS.find(c => c.code === code);
    if (!found) {
      setError('Invalid coupon code');
      setApplied(null);
    } else {
      setApplied(code);
      setError('');
    }
  };

  const handleConfirmOrder = async () => {
    // Fix: check user correctly
    if (!user || !user.uid) {
      alert('Please sign in to confirm your order.');
      navigate('/signin');
      return;
    }
    if (!cart || cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    setOrderLoading(true);
    try {
      // Fetch user info from Firestore
      const userDoc = await getDoc(firestoreDoc(db, "users", user.uid));
      const userData = userDoc.exists() ? userDoc.data() : {};
      await addDoc(collection(db, 'orders'), {
        userId: user.uid,
        items: cart,
        createdAt: serverTimestamp(),
        userInfo: {
          fullName: userData.fullName || user.displayName || "",
          email: userData.email || user.email || "",
          phone: userData.phone || user.phoneNumber || "",
          address: userData.address || "",
        },
        bill: {
          subtotal,
          shipping,
          discount,
          coupon: applied,
          total
        }
      });
      setCart && setCart([]);
      alert('Order confirmed and saved!');
      navigate('/');
    } catch (error) {
      alert('Failed to confirm order. Please try again.\n' + error.message);
    }
    setOrderLoading(false);
  };

  return (
    <div className="container my-5">
      <div className="card shadow-sm p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="mb-0">Bill Summary</h3>
        </div>
        <hr />
        <div className="mb-3">
          <div className="d-flex justify-content-between">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="d-flex justify-content-between">
            <span>Shipping</span>
            <span>
              {shipping === 0 && subtotal > 0
                ? <span style={{ color: "#16a34a", fontWeight: 600 }}>Free</span>
                : `$${shipping.toFixed(2)}`}
            </span>
          </div>
          <div className="d-flex justify-content-between">
            <span>Discount</span>
            <span className="text-success">- ${discount.toFixed(2)}</span>
          </div>
          {freeDelivery && (
            <div className="d-flex justify-content-between">
              <span style={{ color: "#16a34a" }}>Free Delivery</span>
              <span style={{ color: "#16a34a" }}>On orders above $300</span>
            </div>
          )}
          <hr />
          <div className="d-flex justify-content-between fw-bold" style={{ fontSize: 18 }}>
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
        {/* Coupon section */}
        <div className="mb-4">
          <h5 className="mb-2">Apply Coupon</h5>
          <div className="mb-3 d-flex gap-2">
            <input
              type="text"
              className="form-control"
              placeholder="Enter coupon code"
              value={coupon}
              onChange={e => setCoupon(e.target.value.toUpperCase())}
              style={{ maxWidth: 200 }}
            />
            <button className="btn btn-primary" onClick={() => handleApply(coupon)}>
              Apply
            </button>
          </div>
          {error && <div className="alert alert-danger py-1">{error}</div>}
          {applied && (
            <div className="alert alert-success py-1">
              Coupon <b>{applied}</b> applied!
            </div>
          )}
        </div>
        {/* Coupon cards below the coupon input */}
        <div className="row mt-2">
          {COUPONS.map(c => (
            <div className="col-md-3 mb-3" key={c.code}>
              <div className="card h-100 shadow-sm p-3 text-center" style={{ border: applied === c.code ? '2px solid #F97316' : undefined }}>
                <div style={{ fontWeight: 700, fontSize: 18, color: "#F97316" }}>{c.code}</div>
                <div style={{ fontSize: 15, margin: "8px 0" }}>{c.desc}</div>
                <button
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => handleApply(c.code)}
                  disabled={applied === c.code}
                >
                  {applied === c.code ? "Applied" : "Apply"}
                </button>
              </div>
            </div>
          ))}
        </div>
        {/* Confirm Order Button */}
        <div className="text-center mt-4">
          <button
            className="btn btn-success px-5 py-2"
            onClick={handleConfirmOrder}
            disabled={orderLoading || !cart || cart.length === 0}
          >
            {orderLoading ? "Confirming..." : "Confirm Order"}
          </button>
        </div>
      </div>
      {/* Place Back button at the bottom */}
      <div className="d-flex justify-content-center mt-4">
        <button
          className="btn"
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
          &larr; Back
        </button>
      </div>
    </div>
  );
}
