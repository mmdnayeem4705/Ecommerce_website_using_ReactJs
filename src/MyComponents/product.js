import React, { useState, useEffect, useRef } from 'react';
import './products.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp, doc as firestoreDoc, getDoc } from 'firebase/firestore';

const categories = ['Food', 'Makeup', 'Clothes', 'Electronics', 'Watches', 'Vehicles', 'Sports', 'Kitchen'];
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
  const [search, setSearch] = useState('');
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
    fetch('https://dummyjson.com/products?limit=100000')
      .then(response => response.json())
      .then(data => setProducts(data.products));
  }, []);

  useEffect(() => {
    setAuthChecked(true);
  }, [user]);

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

  // Ensure every cart item has a quantity property (default to 1)
  const cartWithQty = cart.map(item => ({
    ...item,
    quantity: typeof item.quantity === 'number' && item.quantity > 0 ? item.quantity : 1
  }));

  const handleAddToCart = (item) => {
    if (!user) {
      navigate('/signin', { state: { signup: true } });
      return;
    }
    if (!cart.some(cartItem => cartItem.id === item.id)) {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const handleConfirmOrder = async () => {
    if (!user) {
      alert('Please sign in to confirm your order.');
      navigate('/signin', { state: { signup: true } });
      return;
    }
    // Use cartWithQty to ensure at least one item is selected and has quantity > 0
    if (cartWithQty.length === 0) {
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
        items: cartWithQty,
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

  const filteredProducts = search
    ? products.filter(
        (p) =>
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.description.toLowerCase().includes(search.toLowerCase())
      )
    : products;

  const grouped = groupProducts(filteredProducts);

  return (
    <div style={{ background: "#FFF7ED", minHeight: "100vh" }}>
      <div className="container">
        <h1
          className="text-center my-4"
          style={{
            position: '',
            top: 30,
            background: 'lightgrey',
            color: 'black',
            zIndex: 15,
            borderRadius: 12,
            fontWeight: 800,
            letterSpacing: 2,
            padding: "18px 0",
            marginBottom: 32,
            boxShadow: "0 2px 12px rgba(0,0,0,0.10)"
          }}
        >
          Shop Now...!
        </h1>
        <div className="mb-4 d-flex justify-content-between align-items-center">
          <h5 className="mb-0" style={{ color: "#F97316", fontWeight: 700 }}>
            Cart: {cart.length} item(s)
          </h5>
          {/* Removed total, discount, delivery, and payable summary from here */}
        </div>
        <div className="mb-3 d-flex flex-column flex-md-row align-items-center justify-content-between">
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
              marginBottom: "1rem"
            }}
            onClick={handleConfirmOrder}
            disabled={orderLoading || cart.length === 0}
          >
            {orderLoading ? 'Confirming...' : 'Confirm Order'}
          </button>
          <div ref={dropdownRef} style={{ position: 'relative', width: '100%', maxWidth: 220 }}>
            <button
              className="btn"
              type="button"
              style={{
                background: "#111",
                color: "#fff",
                fontWeight: 700,
                borderRadius: 8,
                padding: "10px 0",
                width: "100%",
                fontSize: "1.05rem",
                border: "none",
                letterSpacing: 1,
                boxShadow: "0 2px 8px rgba(0,0,0,0.10)"
              }}
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
                  background: '#FFF7ED',
                  borderRadius: 8,
                  padding: 0,
                  margin: 0,
                  border: "1px solid #111"
                }}
              >
                {Object.keys(CATEGORY_GROUPS).concat('Other').map(cat => (
                  <li key={cat} style={{ listStyle: 'none' }}>
                    <button
                      className="list-group-item list-group-item-action"
                      type="button"
                      style={{
                        border: 'none',
                        background: 'none',
                        width: '100%',
                        textAlign: 'left',
                        color: "#111",
                        fontWeight: 600,
                        fontSize: "1rem"
                      }}
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
        {/* Search Bar */}
        <div className="mb-4 d-flex justify-content-center">
          <div style={{ position: "relative", width: 400, maxWidth: "100%" }}>
            <input
              type="text"
              className="form-control"
              style={{
                maxWidth: 400,
                borderRadius: 8,
                border: "2px solid #111",
                background: "#fff",
                color: "#111",
                fontWeight: 500,
                fontSize: "1.1rem",
                padding: "12px 42px 12px 18px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
                outline: "none",
                transition: "border 0.2s, box-shadow 0.2s"
              }}
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              onFocus={e => e.target.style.border = "2px solid #F97316"}
              onBlur={e => e.target.style.border = "2px solid #111"}
            />
            <span
              style={{
                position: "absolute",
                right: 14,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#F97316",
                fontSize: 22,
                pointerEvents: "none"
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="1.3em" height="1.3em" fill="currentColor" viewBox="0 0 16 16">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85zm-5.242 1.106a5 5 0 1 1 0-10 5 5 0 0 1 0 10z"/>
              </svg>
            </span>
          </div>
        </div>
        {/* Render each group */}
        {['Food', 'Makeup', 'Clothes', 'Watches', 'Electronics', 'Vehicles', 'Sports', 'Kitchen', 'Other'].map(group => (
          grouped[group].length > 0 && (
            <div key={group} ref={categoryRefs[group]} className="mb-5">
              <h3
                className="mb-3 text-center"
                style={{
                  background: '#111',
                  color: '#fff',
                  borderRadius: '8px',
                  padding: '14px 0',
                  marginBottom: '28px',
                  fontWeight: 700,
                  letterSpacing: 1,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                }}
              >
                {group}
              </h3>
              <div className="row">
                {grouped[group].map((item) => {
                  const isAdded = cart.some(cartItem => cartItem.id === item.id);
                  const cartItem = cartWithQty.find(ci => ci.id === item.id);
                  const quantity = cartItem ? cartItem.quantity : 1;
                  return (
                    <div className="col-md-4 mb-4" key={item.id}>
                      <div
                        className="card h-100 shadow-sm d-flex flex-column product-card-hover"
                        style={{
                          cursor: 'pointer',
                          border: "1px solid #111",
                          borderRadius: 14,
                          boxShadow: "0 2px 12px rgba(0,0,0,0.06)"
                        }}
                      >
                        <img
                          src={item.thumbnail || (item.images && item.images[0]) || 'https://via.placeholder.com/250?text=No+Image'}
                          alt={item.title}
                          className="card-img-top p-4"
                          style={{
                            height: '250px',
                            objectFit: 'contain',
                            borderRadius: 12,
                            background: "#FFF7ED"
                          }}
                        />
                        <div className="card-body d-flex flex-column">
                          <h5 className="card-title" style={{ color: "#111", fontWeight: 700 }}>{item.title}</h5>
                          <h6 className="card-subtitle mb-2" style={{ color: "#F97316" }}>${item.price}</h6>
                          <div>
                            {/* Example for showing total price */}
                            {/* <span>Total: ${(item.price * quantity).toFixed(2)}</span> */}
                          </div>
                          <div className="add-to-cart-center mt-auto d-flex justify-content-center" style={{ gap: '48px' }}>
                            <button
                              className="btn"
                              style={{
                                background: "#111",
                                color: "#fff",
                                fontWeight: 700,
                                borderRadius: 8,
                                padding: "8px 22px",
                                fontSize: "1rem",
                                border: "none",
                                letterSpacing: 1
                              }}
                              onClick={() => handleView(item.id)}
                            >
                              View
                            </button>
                            <button
                              className="btn"
                              style={{
                                background: isAdded ? "#F97316" : "#fff",
                                color: isAdded ? "#fff" : "#111",
                                fontWeight: 700,
                                borderRadius: 8,
                                padding: "8px 22px",
                                fontSize: "1rem",
                                border: "1px solid #F97316",
                                letterSpacing: 1
                              }}
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