import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Product.css';
import { addDoc, collection, serverTimestamp, doc as firestoreDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Adjust the import based on your project structure

export default function ProductDetail({ cart, setCart, user }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setLoading(true);
    fetch(`https://dummyjson.com/products/${id}`)
      .then(response => {
        if (!response.ok) throw new Error('Product not found');
        return response.json();
      })
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(() => {
        setProduct(null);
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = (item) => {
    if (!user) {
      navigate('/signin');
      return;
    }
    const isAdded = cart && cart.some(cartItem => String(cartItem.id) === String(item.id));
    if (!isAdded) {
      setCart([...cart, { ...item, quantity }]);
    }
  };

  const handleConfirmOrder = async () => {
    if (!user) {
      alert('Please sign in to confirm your order.');
      navigate('/signin');
      return;
    }
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }
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
        }
      });
      setCart([]);
      alert('Order confirmed and saved!');
    } catch (error) {
      alert('Failed to confirm order. Please try again.\n' + error.message);
    }
  };

  if (loading) return <div className="container my-4">Loading...</div>;
  if (!product) return <div className="container my-4">Product not found.</div>;

  const isAdded = cart && cart.some(cartItem => String(cartItem.id) === String(product.id));

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: 'calc(100vh - 140px)',
        paddingTop: '90px',
        paddingBottom: '50px',
        background: '#fafafa'
      }}
    >
      <div className="container" style={{ maxWidth: 700 }}>
        <div
          className="product-detail-card d-flex flex-row align-items-stretch bg-white"
          style={{ gap: 40, padding: '32px 32px' }}
        >
          <div
            className="product-detail-img-wrapper"
            style={{
              flex: '0 0 200px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 200
            }}
          >
            <img
              src={product.thumbnail || (product.images && product.images[0]) || 'https://via.placeholder.com/200?text=No+Image'}
              alt={product.title}
              className="product-detail-img"
              style={{ width: 200, height: 200, objectFit: 'contain', borderRadius: 14 }}
            />
          </div>
          <div
            className="product-detail-info"
            style={{ flex: 1, marginLeft: 40, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
          >
            <h2 className="product-detail-title" style={{ fontSize: '1.3rem' }}>{product.title}</h2>
            <p className="product-detail-desc">{product.description}</p>
            <div className="product-detail-price">${product.price}</div>
            <div className="d-flex align-items-center mb-3">
              <button
                className="btn btn-outline-secondary"
                style={{ minWidth: 36, fontWeight: 700 }}
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                disabled={quantity <= 1}
              >-</button>
              <span style={{ margin: "0 18px", fontWeight: 600, fontSize: "1.1rem" }}>{quantity}</span>
              <button
                className="btn btn-outline-secondary"
                style={{ minWidth: 36, fontWeight: 700 }}
                onClick={() => setQuantity(q => q + 1)}
              >+</button>
            </div>
            <button
              className="btn btn-primary btn-sm"
              style={{ background: isAdded ? '#198754' : '#0d6efd', border: 'none' }}
              onClick={() => handleAddToCart(product)}
              disabled={isAdded}
              aria-pressed={isAdded}
            >
              {isAdded ? 'Added to Cart' : 'Add to Cart'}
            </button>
            {/* Move Back Button below Add to Cart */}
            <button
              className="mt-4"
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
              onClick={() => navigate('/products')}
            >
              &larr; Back to Products
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}