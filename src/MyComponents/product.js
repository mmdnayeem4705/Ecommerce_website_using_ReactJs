import React, { useState, useEffect, useRef } from 'react';
import './products.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp, doc as firestoreDoc, getDoc } from 'firebase/firestore';

// Map DummyJSON categories to your groups
const CATEGORY_GROUPS = {
  Food: ['groceries'],
  Makeup: ['skincare', 'fragrances'],
  Clothes: ['mens-shirts', 'mens-shoes', 'womens-dresses', 'womens-shoes', 'womens-bags', 'womens-jewellery', 'tops'],
  Electronics: ['smartphones', 'laptops', 'lighting'],
  Watches: ['mens-watches', 'womens-watches'],
  Vehicles: ['automotive', 'motorcycle', 'cars'],
  Sports: ['sports'],
  Kitchen: ['home-decoration', 'furniture', 'kitchen-accessories'],
};

function groupProducts(products) {
  const grouped = { Food: [], Makeup: [], Clothes: [], Electronics: [], Watches: [], Vehicles: [], Sports: [], Kitchen: [], Other: [] };
  products.forEach(product => {
    let found = false;
    for (const [group, cats] of Object.entries(CATEGORY_GROUPS)) {
      if (cats.includes(product.category)) {
        grouped[group].push(product);
        found = true;
        break;
      }
    }
    if (!found) grouped.Other.push(product);
  });
  return grouped;
}

const Product = ({ cart, setCart, user }) => {
  const [products, setProducts] = useState([]);
  const [orderLoading, setOrderLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const categoryRefs = {
    Food: useRef(null),
    Makeup: useRef(null),
    Clothes: useRef(null),
    Watches: useRef(null),
    Electronics: useRef(null),
    Other: useRef(null),
  };
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetch('https://dummyjson.com/products?limit=1000')
      .then(response => response.json())
      .then(data => setProducts(data.products));
  }, []);

  useEffect(() => {
    setAuthChecked(true);
  }, [user]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  const handleView = (id) => {
    navigate(`/products/${id}`);
  };

  const handleAddToCart = (item) => {
    if (!user) {
      navigate('/signin');
      return;
    }
    if (!cart.some(cartItem => cartItem.id === item.id)) {
      setCart([...cart, item]);
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
        }
      });
      setCart([]);
      alert('Order confirmed and saved!');
    } catch (error) {
      alert('Failed to confirm order. Please try again.\n' + error.message);
    }
    setOrderLoading(false);
  };

  const handleCategoryJump = (cat) => {
    setShowDropdown(false);
    categoryRefs[cat]?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const grouped = groupProducts(products);

  return (
    <div>
      <div className="container">
        <h1 className="text-center my-4" style={{ position: 'sticky', top: 0, background: '#fff', zIndex: 10 }}>Shop Now...!</h1>
        <div className="mb-4 d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Cart: {cart.length} item(s)</h5>
          {/* Custom Dropdown */}
          <div ref={dropdownRef} style={{ position: 'relative' }}>
            <button
              className="btn btn-outline-primary"
              type="button"
              onClick={() => setShowDropdown((v) => !v)}
            >
              Categories
            </button>
            {showDropdown && (
              <ul
                className="list-group"
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '110%',
                  minWidth: 160,
                  zIndex: 100,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                  background: '#fff',
                  borderRadius: 8,
                  padding: 0,
                  margin: 0,
                }}
              >
                {Object.keys(CATEGORY_GROUPS).concat('Other').map(cat => (
                  <li key={cat} style={{ listStyle: 'none' }}>
                    <button
                      className="list-group-item list-group-item-action"
                      type="button"
                      style={{ border: 'none', background: 'none', width: '100%', textAlign: 'left' }}
                      onClick={() => handleCategoryJump(cat)}
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="mb-3">
          <button
            className="btn btn-success"
            onClick={handleConfirmOrder}
            disabled={orderLoading || cart.length === 0}
          >
            {orderLoading ? 'Confirming...' : 'Confirm Order'}
          </button>
        </div>
        {/* Render each group */}
        {['Food', 'Makeup', 'Clothes', 'Watches', 'Electronics', 'Vehicles', 'Sports', 'Kitchen', 'Other'].map(group => (
          grouped[group].length > 0 && (
            <div key={group} ref={categoryRefs[group]} className="mb-5">
              <h3
                className="mb-3 text-center"
                style={{
                  background: '#6c757d',
                  color: '#fff',
                  borderRadius: '8px',
                  padding: '12px 0',
                  marginBottom: '28px'
                }}
              >
                {group}
              </h3>
              <div className="row">
                {grouped[group].map((item) => {
                  const isAdded = cart.some(cartItem => cartItem.id === item.id);
                  return (
                    <div className="col-md-4 mb-4" key={item.id}>
                      <div
                        className="card h-100 shadow-sm d-flex flex-column product-card-hover"
                        style={{ cursor: 'pointer' }}
                      >
                        <img
                          src={item.thumbnail || (item.images && item.images[0]) || 'https://via.placeholder.com/250?text=No+Image'}
                          alt={item.title}
                          className="card-img-top p-4"
                          style={{ height: '250px', objectFit: 'contain' }}
                        />
                        <div className="card-body d-flex flex-column">
                          <h5 className="card-title">{item.title}</h5>
                          <h6 className="card-subtitle mb-2 text-muted">${item.price}</h6>
                          <div className="add-to-cart-center mt-auto d-flex justify-content-center" style={{ gap: '48px' }}>
                            <button
                              className="btn btn-primary"
                              onClick={() => handleView(item.id)}
                            >
                              View
                            </button>
                            <button
                              className="btn btn-secondary"
                              onClick={() => handleAddToCart(item)}
                              disabled={isAdded}
                            >
                              {isAdded ? 'Added to Cart' : 'Add to Cart'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
};

export default Product;