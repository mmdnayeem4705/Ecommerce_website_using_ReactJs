import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp, doc as firestoreDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
export default function Cart({ cart, user, setCart }) {
  const [orderLoading, setOrderLoading] = useState(false);

  // Add quantity property if not present
  const cartWithQty = cart.map(item => ({
    ...item,
    quantity: item.quantity ? item.quantity : 1
  }));

  // Handle increase quantity
  const handleIncrease = (id) => {
    const updatedCart = cartWithQty.map(item =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCart(updatedCart);
  };

  // Optionally, handle decrease quantity
  const handleDecrease = (id) => {
    const updatedCart = cartWithQty.map(item =>
      item.id === id && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    setCart(updatedCart);
  };

  // Remove item from cart
  const handleRemove = (id) => {
    const updatedCart = cartWithQty.filter(item => item.id !== id);
    setCart(updatedCart);
  };

  const handleConfirmOrder = async () => {
    if (!user) {
      alert('Please sign in to confirm your order.');
      return;
    }
    if (cart.length === 0) {
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

  // Calculate total price
  const total = cart.reduce(
    (sum, item) => sum + (item.price * (item.quantity || 1)),
    0
  );

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
          <div className="mt-3">
            <strong>Total: ${total.toFixed(2)}</strong>
          </div>
          {total > 100 && (
            <div className="alert alert-success mt-2">
              🎉 You are eligible for <strong>Free Delivery!</strong>
            </div>
          )}
          {cart.length > 0 && (
            <button
              className="btn btn-success mt-3"
              onClick={handleConfirmOrder}
              disabled={orderLoading}
            >
              {orderLoading ? "Confirming..." : "Confirm Order"}
            </button>
          )}
        </>
      )}
    </div>
  );
}