import React from 'react';

export default function AddItem({ cart }) {
  return (
    <div className="text-end mx-4 my-2">
      <h5>Cart Items are: {cart.length}</h5>
    </div>
  );
}
