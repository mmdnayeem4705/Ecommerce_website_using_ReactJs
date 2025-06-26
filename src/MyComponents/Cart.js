import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp, doc as firestoreDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
export default function Cart({ cart, setCart, user }) {
  const [orderLoading, setOrderLoading] = useState(false);

  // Ensure every cart item has a quantity property (default to 1)
  const cartWithQty = cart.map(item => ({
    ...item,
    quantity: typeof item.quantity === 'number' && item.quantity > 0 ? item.quantity : 1
  }));

  // Quantity handlers
  const handleDecrease = (id) => {
    setCart(cart =>
      cart.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, (item.quantity || 1) - 1) }
          : item
      )
    );
  };

  const handleIncrease = (id) => {
    setCart(cart =>
      cart.map(item =>
        item.id === id
          ? { ...item, quantity: (item.quantity || 1) + 1 }
          : item
      )
    );
  };

  const handleRemove = (id) => {
    setCart(cart => cart.filter(item => item.id !== id));
  };

  // Calculate total price, discount, and delivery using cartWithQty
  const total = cartWithQty.reduce(
    (sum, item) => sum + ((item.price || 0) * (typeof item.quantity === 'number' && item.quantity > 0 ? item.quantity : 1)),
    0
  );
  const discount = total >= 200 ? total * 0.10 : 0;
  const delivery = total >= 300 ? 0 : 30; // Free delivery for >= 300, else 30
  const finalTotal = total - discount + delivery;

  // Confirm order logic (reuse from products page)
  const handleConfirmOrder = async () => {
    if (!user) {
      alert('Please sign in to confirm your order.');
      return;
    }
    if (cartWithQty.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    setOrderLoading(true);
    try {
      // Fetch user info from Firestore for order snapshot
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
        }
      });
      setCart([]);
      alert('Order confirmed and saved!');
    } catch (error) {
      alert('Failed to confirm order. Please try again.\n' + error.message);
    }
    setOrderLoading(false);
  };

  return (
    <div className="container my-4">
      <h2
        style={{
          background: '#6c757d',
          color: '#fff',
          borderRadius: '8px',
          padding: '12px 0',
          textAlign: 'center',
          marginBottom: '28px'
        }}
      >
        Cart Items ({cart.length})
      </h2>
      {cart.length === 0 ? (
        <div className="text-center my-5">
          <p>Your cart is empty.</p>
          <img
            src="https://img.freepik.com/premium-vector/modern-design-concept-no-product-found-cart-design_637684-219.jpg?semt=ais_hybrid&w=740"
            alt="Empty Cart"
            style={{ maxWidth: 320, width: "100%", height: "auto", opacity: 0.8 }}
          />
        </div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table align-middle table-bordered">
              <thead className="table-light" style={{ background: '#6c757d', color: '#fff' }}>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Price ($)</th>
                  <th>Quantity</th>
                  <th>Total ($)</th>
                  <th>Remove</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item, idx) => (
                  <tr key={item.id + '-' + idx}>
                    <td style={{ width: 120 }}>
                      <img
                        src={
                          item.thumbnail ||
                          item.image ||
                          (item.images && item.images[0]) ||
                          'https://via.placeholder.com/120?text=No+Image'
                        }
                        alt={item.title}
                        style={{ height: 90, width: 90, objectFit: 'contain', borderRadius: 8 }}
                      />
                    </td>
                    <td>{item.title}</td>
                    <td><b>{item.price}</b></td>
                    <td>
                      <div className="d-flex align-items-center">
                        <button className="btn btn-secondary btn-sm me-2" onClick={() => handleDecrease(item.id)} disabled={item.quantity <= 1}>-</button>
                        <span>{item.quantity}</span>
                        <button className="btn btn-secondary btn-sm ms-2" onClick={() => handleIncrease(item.id)}>+</button>
                      </div>
                    </td>
                    <td><b>{(item.price * item.quantity).toFixed(2)}</b></td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleRemove(item.id)}
                        title="Remove from cart"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {delivery === 0 && (
            <div className="alert alert-success text-center mb-4" style={{ fontWeight: 600, fontSize: "1.1rem" }}>
              🎉 You are eligible for Free Delivery!
            </div>
          )}
          <div className="row justify-content-center">
            <div className="col-md-7 col-lg-6">
              <div
                className="card p-4"
                style={{
                  borderRadius: 14,
                  boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
                  background: "#fff",
                  marginTop: 24,
                  marginBottom: 24
                }}
              >
                <h4 className="mb-3 text-center" style={{ color: "#F97316", fontWeight: 700, letterSpacing: 1 }}>Bill Summary</h4>
                <div className="d-flex justify-content-between mb-2">
                  <span style={{ fontWeight: 500 }}>Total</span>
                  <span style={{ fontWeight: 600 }}>${total.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span style={{ fontWeight: 500 }}>Discount</span>
                  <span style={{ color: discount > 0 ? "#198754" : "#888", fontWeight: 600 }}>
                    {discount > 0 ? `- $${discount.toFixed(2)} (10% off)` : "-"}
                  </span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span style={{ fontWeight: 500 }}>Delivery</span>
                  <span style={{ color: delivery === 0 ? "#198754" : "#F97316", fontWeight: 600 }}>
                    {delivery === 0 ? "Free" : `$${delivery.toFixed(2)}`}
                  </span>
                </div>
                <hr />
                <div className="d-flex justify-content-between mb-4">
                  <span style={{ fontWeight: 700, fontSize: "1.1rem" }}>Payable</span>
                  <span style={{ fontWeight: 700, color: "#F97316", fontSize: "1.1rem" }}>${finalTotal.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-center">
                  <button
                    className="btn"
                    style={{
                      background: "#F97316",
                      color: "#fff",
                      fontWeight: 700,
                      borderRadius: 8,
                      padding: "10px 38px",
                      fontSize: "1.1rem",
                      boxShadow: "0 2px 8px rgba(249,115,22,0.10)",
                      border: "none",
                      letterSpacing: 1,
                      minWidth: 180
                    }}
                    onClick={handleConfirmOrder}
                    disabled={orderLoading || cartWithQty.length === 0}
                  >
                    {orderLoading ? 'Confirming...' : 'Confirm Order'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}