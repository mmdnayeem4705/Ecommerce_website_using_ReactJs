import React, { useState, useEffect, useRef } from 'react';
import './products.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp, doc as firestoreDoc, getDoc } from 'firebase/firestore';

const categories = ['Food', 'Makeup', 'Clothes', 'Electronics', 'Watches', 'Vehicles', 'Sports', 'Kitchen', 'Glasses'];
const CATEGORY_GROUPS = {
  Food: ['groceries'],
  Makeup: ['skincare', 'fragrances'],
  Clothes: ['mens-shirts', 'mens-shoes', 'womens-dresses', 'womens-shoes', 'womens-bags', 'womens-jewellery', 'tops'],
  Electronics: [
    'smartphones', 'laptops', 'lighting', 'electronics',
    'airpods', 'airpods max', 'airpower', 'homepod', 'iphone charger', 'magsafe'
  ],
  Watches: ['mens-watches', 'womens-watches'],
  Vehicles: [
    'automotive', 'motorcycle', 'cars',
    // Add car models/keywords
    '300 touring', 'charger sxt rwd', 'dodge hornet gt plus', 'durango sxt rwd', 'pacifica touring'
  ],
  Sports: [
    'sports', 'american football', 'baseball', 'baseball ball', 'baseball glove', 'basketball', 'basketball rim',
    'cricket', 'cricket ball', 'cricket bat', 'cricket helmet', 'cricket wicket',
    'feather shuttlecock', 'football', 'golf', 'golf ball', 'iron golf', 'metal baseball bat',
    'tennis', 'tennis ball', 'tennis racket', 'volleyball'
  ],
  Kitchen: ['home-decoration', 'furniture', 'kitchen-accessories'],
  Glasses: ['glasses', 'sunglasses', 'party glasses', 'classic sun glasses', 'black sun glasses', 'green and black glasses'],
};

function groupProducts(products) {
  // Ensure all expected keys exist in grouped object
  const grouped = {
    Food: [],
    Makeup: [],
    Clothes: [],
    Electronics: [],
    Watches: [],
    Vehicles: [],
    Sports: [],
    Kitchen: [],
    Glasses: [],
    Other: []
  };
  products.forEach(product => {
    let found = false;
    for (const [group, cats] of Object.entries(CATEGORY_GROUPS)) {
      // Check category match or title/description match for electronics and sports
      if (
        cats.includes(product.category) ||
        (
          (group === 'Electronics' || group === 'Sports') &&
          (
            (product.title && cats.some(c =>
              product.title.toLowerCase().includes(c)
            )) ||
            (product.description && cats.some(c =>
              product.description.toLowerCase().includes(c)
            ))
          )
        )
      ) {
        grouped[group].push(product);
        found = true;
        break;
      }
    }
    if (!found) grouped.Other.push(product);
  });
  return grouped;
}

const VEHICLE_EXTRA_ITEMS = [
  {
    id: 'veh-300-touring',
    title: '300 Touring',
    price: 28999.99,
    category: 'cars',
    description: 'Chrysler 300 Touring luxury sedan',
    thumbnail: 'https://cdn.pixabay.com/photo/2012/05/29/00/43/car-49278_1280.jpg'
  },
  {
    id: 'veh-charger-sxt-rwd',
    title: 'Charger SXT RWD',
    price: 32999.99,
    category: 'cars',
    description: 'Dodge Charger SXT RWD sports sedan',
    thumbnail: 'https://cdn.pixabay.com/photo/2016/11/29/05/08/auto-1868726_1280.jpg'
  },
  {
    id: 'veh-dodge-hornet-gt-plus',
    title: 'Dodge Hornet GT Plus',
    price: 24999.99,
    category: 'cars',
    description: 'Dodge Hornet GT Plus compact SUV',
    thumbnail: 'https://cdn.pixabay.com/photo/2013/07/12/18/39/car-153610_1280.png'
  },
  
];

const GLASSES_ITEMS = [
  {
    id: 'glass-black-sun',
    title: 'Black Sun Glasses',
    price: 29.99,
    category: 'glasses',
    description: 'Classic black sun glasses for all occasions.',
    thumbnail: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&w=400&q=80'
  },
  {
    id: 'glass-classic-sun',
    title: 'Classic Sun Glasses',
    price: 24.99,
    category: 'glasses',
    description: 'Classic style sun glasses.',
    thumbnail: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=400&q=80'
  },
  {
    id: 'glass-green-black',
    title: 'Green and Black Glasses',
    price: 34.99,
    category: 'glasses',
    description: 'Trendy green and black glasses.',
    thumbnail: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=facearea&w=400&q=80'
  },
  {
    id: 'glass-party',
    title: 'Party Glasses',
    price: 19.99,
    category: 'party glasses',
    description: 'Fun party glasses for celebrations.',
    thumbnail: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=facearea&w=400&q=80'
  },
  {
    id: 'glass-sunglasses',
    title: 'Sunglasses',
    price: 22.99,
    category: 'sunglasses',
    description: 'Stylish sunglasses for sunny days.',
    thumbnail: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=facearea&w=400&q=80'
  }
];

function Product({ cart, setCart, user }) {
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
    fetch('https://dummyjson.com/products?limit=300')
      .then(response => response.json())
      .then(data => setProducts([...data.products, ...VEHICLE_EXTRA_ITEMS, ...GLASSES_ITEMS]));
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

  const handleAddToCart = (item, e) => {
    const isAdded = cart.some(cartItem => cartItem.id === item.id);
    if (!user) {
      navigate('/signin', { state: { signup: true } });
      return;
    }
    if (isAdded) {
      // Remove from cart if already added
      setCart(cart.filter(cartItem => cartItem.id !== item.id));
    } else {
      // Add to cart if not already added
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

  // Handler to go to category page
  const handleCategoryPage = (cat) => {
    navigate(`/products/category/${cat.toLowerCase()}`);
  };

  // Filter products based on search
  const filteredProducts = search
    ? products.filter(
        (p) =>
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          (p.description && p.description.toLowerCase().includes(search.toLowerCase()))
      )
    : products;

  const grouped = groupProducts(filteredProducts);

  // Get a sample image for each category from the first product in that group
  const categoryImages = {};
  for (const cat of categories) {
    const groupArr = grouped[cat];
    if (groupArr && groupArr.length > 0) {
      categoryImages[cat] = groupArr[0].thumbnail || (groupArr[0].images && groupArr[0].images[0]);
    } else {
      categoryImages[cat] = '/images/default.png'; // fallback image if none found
    }
  }

  return (
    <div style={{ background: "#FFF7ED", minHeight: "100vh" }}>
      <div className="container">
        <h1
          className="text-center my-4 product-marquee"
        >
          <marquee style={{color: 'white', display: 'flex', alignItems: 'center', gap: 12}}>
            <span style={{display: 'inline-flex', alignItems: 'center', marginRight: 10}}>
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="#fff" viewBox="0 0 16 16" style={{marginBottom: -4}}>
                <path d="M0 1a1 1 0 0 1 1-1h1.22a1 1 0 0 1 .98.804L3.89 4H14a1 1 0 0 1 .97 1.243l-1.5 6A1 1 0 0 1 12.5 12H4a1 1 0 0 1-1-.89L1.61 2H1a1 1 0 0 1-1-1zm3.14 3l1.25 5h7.22l1.25-5H3.14zM5.5 13a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm6 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/>
              </svg>
            </span>
            Shop Now...  Exciting offers are going on...!!!
          </marquee>
        </h1>
        {/* Search Bar */}
        <div className="mb-4 d-flex justify-content-center">
          <div className="product-search-bar">
            <input
              type="text"
              className="form-control product-search-input"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              onFocus={e => e.target.style.border = "2px solid #F97316"}
              onBlur={e => e.target.style.border = "2px solid #111"}
            />
            <span className="product-search-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="1.3em" height="1.3em" fill="currentColor" viewBox="0 0 16 16">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85zm-5.242 1.106a5 5 0 1 1 0-10 5 5 0 0 1 0 10z"/>
              </svg>
            </span>
          </div>
        </div>
        {/* Categories Heading and Bar */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <h3
            className="mb-3 all-products-heading"
            style={{
              marginBottom: 10,
              display: "inline-block",
              background: "#F97316",
              color: "#fff",
              borderRadius: 8,
              padding: "6px 32px",
              fontWeight: 800,
              letterSpacing: 2,
              fontSize: "2rem",
              boxShadow: "0 2px 8px rgba(0,0,0,0.07)"
            }}
          >
            Categories
          </h3>
        </div>
        {/* Custom Category Bar with Your Category Names */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div className="bg-white border-bottom py-3 px-2" style={{ overflowX: 'auto', whiteSpace: 'nowrap', display: "inline-block" }}>
            <div className="d-flex justify-content-center align-items-center gap-4 px-3" style={{ minWidth: 'max-content' }}>
              {[
                { name: "Grocery", image: "https://www.thesimplicityhabit.com/wp-content/uploads/2020/03/AdobeStock_287658133-1024x683.jpg", cat: "Food" },
                { name: "Makeup", image: "https://cdn.britannica.com/35/222035-050-C68AD682/makeup-cosmetics.jpg", cat: "Makeup" },
                { name: "Clothes", image: "https://rukminim2.flixcart.com/fk-p-flap/96/96/image/0d75b34f7d8fbcb3.png?q=100", cat: "Clothes" },
                { name: "Electronics", image: "https://rukminim2.flixcart.com/flap/96/96/image/69c6589653afdb9a.png?q=100", cat: "Electronics" },
                { name: "Watches", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5grhzxPiRrk4gEEbjj2xuZfN0LbEg4sa3_g&s", cat: "Watches" },
                { name: "Vehicles", image: "https://www.motorbeam.com/wp-content/uploads/2011_MotorBeam_Awards.jpg", cat: "Vehicles" },
                { name: "Sports", image: "https://upload.wikimedia.org/wikipedia/commons/0/0c/Sport_balls.svg", cat: "Sports" },
                { name: "Kitchen", image: "https://bergnerhome.in/cdn/shop/articles/Header-Banner-1.png?v=1718542473&width=2048", cat: "Kitchen" },
                { name: "Glasses", image: "https://rukminim2.flixcart.com/image/850/1000/xif0q/frame/k/l/7/52-2-00-reading-glasses-for-men-and-women-2-00-freddy-original-imah4htmfzggzpne.jpeg?q=90&crop=false", cat: "Glasses" },
              ].map((cat, idx) => (
                <button
                  key={idx}
                  className="d-flex flex-column align-items-center"
                  style={{
                    minWidth: 90,
                    border: "none",
                    background: "none",
                    outline: "none",
                    cursor: "pointer",
                    padding: "10px 0",
                    borderRadius: 14,
                    boxShadow: "0 2px 8px rgba(249,115,22,0.07)",
                    transition: "box-shadow 0.18s, background 0.18s",
                    position: "relative"
                  }}
                  onClick={() => handleCategoryPage(cat.cat)}
                  onMouseOver={e => e.currentTarget.style.background = "#FFF7ED"}
                  onMouseOut={e => e.currentTarget.style.background = "none"}
                >
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 12,
                      background: "#fff7ed",
                      boxShadow: "0 1px 6px rgba(249,115,22,0.08)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 6,
                      border: "2px solid #F97316"
                    }}
                  >
                    <img src={cat.image} alt={cat.name} style={{ width: 48, height: 48, objectFit: 'contain', borderRadius: 8 }} />
                  </div>
                  <span style={{
                    fontSize: 15,
                    fontWeight: 700,
                    marginTop: 4,
                    textAlign: 'center',
                    color: "#F97316",
                    letterSpacing: 0.5,
                    textShadow: "0 1px 4px rgba(249,115,22,0.07)"
                  }}>
                    {cat.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
        {/* Category-wise product sections */}
        <div className="mt-4">
          {categories.map((cat) => (
            grouped[cat] && grouped[cat].length > 0 && (
              <div key={cat} className="mb-5">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    width: "100%"
                  }}
                >
                  <h4
                    className="mb-3"
                    style={{
                      fontWeight: 700,
                      color: "#F97316",
                      letterSpacing: 1,
                      background: "#fff7ed",
                      borderRadius: 8,
                      padding: "10px 0 10px 18px",
                      borderLeft: "6px solid #F97316",
                      display: "inline-block",
                      minWidth: 120,
                      maxWidth: "100vw",
                      textAlign: "center",
                      fontSize: "1.3rem",
                      width: "100%",
                      boxSizing: "border-box"
                    }}
                  >
                    {cat}
                  </h4>
                </div>
                <div
                  className="row"
                  style={{
                    marginLeft: 0,
                    marginRight: 0,
                    rowGap: 18
                  }}
                >
                  {grouped[cat].map((item) => {
                    const isAdded = cart.some(cartItem => cartItem.id === item.id);
                    const cartItem = cartWithQty.find(ci => ci.id === item.id);
                    const quantity = cartItem ? cartItem.quantity : 1;
                    return (
                      <div
                        className="col-12 col-sm-6 col-md-4 mb-4"
                        key={item.id}
                        style={{
                          display: "flex",
                          justifyContent: "center"
                        }}
                      >
                        <div
                          className="card h-100 shadow-sm d-flex flex-column product-card-hover"
                          style={{
                            width: "100%",
                            maxWidth: 340,
                            minWidth: 0,
                            margin: "0 auto"
                          }}
                        >
                          <img
                            src={item.thumbnail || (item.images && item.images[0]) || 'https://via.placeholder.com/250?text=No+Image'}
                            alt={item.title}
                            className="card-img-top p-4 product-card-img"
                            style={{
                              width: "100%",
                              height: 180,
                              objectFit: "contain"
                            }}
                          />
                          <div className="card-body d-flex flex-column" style={{ padding: 16 }}>
                            <h5 className="card-title product-card-title" style={{ fontSize: "1.1rem" }}>{item.title}</h5>
                            <h6 className="card-subtitle mb-2 product-card-price" style={{ fontSize: "1rem" }}>${item.price}</h6>
                            <div>
                              {/* Example for showing total price */}
                              {/* <span>Total: ${(item.price * quantity).toFixed(2)}</span> */}
                            </div>
                            <div className="add-to-cart-center mt-auto d-flex justify-content-center flex-wrap" style={{ gap: '24px' }}>
                              <button
                                className="btn product-card-btn-view"
                                style={{ minWidth: 90, fontSize: "0.95rem" }}
                                onClick={() => handleView(item.id)}
                              >
                                View
                              </button>
                              <button
                                className={`btn product-card-btn-cart${isAdded ? " added" : ""}`}
                                style={{ minWidth: 110, fontSize: "0.95rem" }}
                                onClick={e => handleAddToCart(item, e)}
                                disabled={false}
                                title={isAdded ? "Double click to remove from cart" : "Add to Cart"}
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
        {/* All Products section */}
        <h3 className="mb-3 text-center all-products-heading">
          All Products
        </h3>
        <div className="row">
          {filteredProducts.map((item) => {
            const isAdded = cart.some(cartItem => cartItem.id === item.id);
            const cartItem = cartWithQty.find(ci => ci.id === item.id);
            const quantity = cartItem ? cartItem.quantity : 1;
            return (
              <div className="col-md-4 mb-4" key={item.id}>
                <div className="card h-100 shadow-sm d-flex flex-column product-card-hover">
                  <img
                    src={item.thumbnail || (item.images && item.images[0]) || 'https://via.placeholder.com/250?text=No+Image'}
                    alt={item.title}
                    className="card-img-top p-4 product-card-img"
                  />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title product-card-title">{item.title}</h5>
                    <h6 className="card-subtitle mb-2 product-card-price">${item.price}</h6>
                    <div>
                      {/* Example for showing total price */}
                      {/* <span>Total: ${(item.price * quantity).toFixed(2)}</span> */}
                    </div>
                    <div className="add-to-cart-center mt-auto d-flex justify-content-center" style={{ gap: '48px' }}>
                      <button
                        className="btn product-card-btn-view"
                        onClick={() => handleView(item.id)}
                      >
                        View
                      </button>
                      <button
                        className={`btn product-card-btn-cart${isAdded ? " added" : ""}`}
                        onClick={e => handleAddToCart(item, e)}
                        disabled={false}
                        title={isAdded ? "Double click to remove from cart" : "Add to Cart"}
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
    </div>
  );
};


/* Add this at the end of your file or in products.css for better mobile responsiveness */
<style>
{`
@media (max-width: 576px) {
  .product-card-img {
    padding: 1rem !important;
    height: 120px !important;
  }
  .product-card-title {
    font-size: 1rem !important;
  }
  .product-card-price {
    font-size: 0.95rem !important;
  }
  .add-to-cart-center button {
    min-width: 90px !important;
    font-size: 0.93rem !important;
    padding: 0.4rem 0.7rem !important;
  }
  .all-products-heading {
    font-size: 1.2rem !important;
    padding: 4px 12px !important;
  }
}
`}
</style>

export default Product;