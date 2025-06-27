import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp, doc as firestoreDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useNavigate } from 'react-router-dom';

export default function Cart({ cart, setCart, user }) {
  const [orderLoading, setOrderLoading] = useState(false);
  const navigate = useNavigate();

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
      <h2 className="mb-4" style={{ display: 'flex', justifyContent: 'center' , backgroundColor: 'rgb(249, 115, 22)', padding: '7px', color: 'white'}}>Your Cart</h2>
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
          {/* Centered Bill Summary button */}
          <div className="d-flex justify-content-center mt-4">
            <button
              className="btn btn-warning"
              onClick={() => navigate('/bill-summary')}
            >
              Go to Bill Summary
            </button>
          </div>
        </>
      )}
    </div>
  );
}