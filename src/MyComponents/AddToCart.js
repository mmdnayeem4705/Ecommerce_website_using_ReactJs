import React from 'react';

const AddToCart = ({ onAdd, added }) => {
  return (
    <button
      onClick={onAdd}
      disabled={added}
      aria-pressed={added}
      style={{
        background: added ? '#198754' : '#0d6efd', // Bootstrap green/blue
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        padding: '0.5rem 1.2rem',
        fontSize: '1rem',
        fontWeight: 500,
        cursor: added ? 'not-allowed' : 'pointer',
        transition: 'background 0.2s'
      }}
    >
      {added ? 'Added to Cart' : 'Add to Cart'}
    </button>
  );
};

export default AddToCart;