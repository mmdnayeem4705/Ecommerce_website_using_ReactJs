// src/components/PlaceOrder.jsx
import React from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export default function PlaceOrder({ user, cartItems }) {
  const handlePlaceOrder = async () => {
    if (!user || cartItems.length === 0) {
      alert("Please login and add items to cart.");
      return;
    }

    try {
      await addDoc(collection(db, 'orders'), {
        userId: user.uid,
        items: cartItems,
        createdAt: serverTimestamp(),
      });
      alert("Order confirmed and saved!");
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Error placing order.");
    }
  };

  return (
    <div className="container my-4">
      <h4>Your Cart</h4>
      <ul>
        {cartItems.map((item, i) => (
          <li key={i}>{item.title} - ₹{item.price}</li>
        ))}
      </ul>
      <button onClick={handlePlaceOrder} className="btn btn-primary mt-3">
        Place Order
      </button>
    </div>
  );
}
