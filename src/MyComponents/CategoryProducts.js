import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './products.css';

const CATEGORY_DISPLAY = {
  food: "Food",
  makeup: "Makeup",
  clothes: "Clothes",
  electronics: "Electronics",
  watches: "Watches",
  vehicles: "Vehicles",
  sports: "Sports",
  kitchen: "Kitchen",
  glasses: "Glasses"
};

const GLASSES_ITEMS = [
  {
    id: 'glass-black-sun',
    title: 'Black Sun Glasses',
    price: 29.99,
    category: 'glasses',
    description: 'Classic black sun glasses for all occasions.',
    thumbnail: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&w=400&q=80'
  },
  
];

export default function CategoryProducts({ cart, setCart, user }) {
  const { cat } = useParams();
  const navigate = useNavigate();
  const displayCat = CATEGORY_DISPLAY[cat];

  const [products, setProducts] = useState([]);
  useEffect(() => {
    fetch('https://dummyjson.com/products?limit=300')
      .then(response => response.json())
      .then(data => {
        let allProducts = data.products || [];
        // Add glasses items if category is glasses
        if (cat === 'glasses') {
          allProducts = [...allProducts, ...GLASSES_ITEMS];
        }
        setProducts(allProducts);
      });
  }, [cat]);

  // Group products by category (reuse logic from product.js)
  function groupProducts(products) {
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

  // Get products for this category
  const grouped = groupProducts(products);
  const items = grouped[displayCat] || [];

  // Cart logic (same as in Product.js)
  const cartWithQty = cart.map(item => ({
    ...item,
    quantity: typeof item.quantity === 'number' && item.quantity > 0 ? item.quantity : 1
  }));

  const handleAddToCart = (item) => {
    const isAdded = cart.some(cartItem => cartItem.id === item.id);
    if (!user) {
      navigate('/signin', { state: { signup: true } });
      return;
    }
    if (isAdded) {
      setCart(cart.filter(cartItem => cartItem.id !== item.id));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const handleView = (id) => {
    navigate(`/products/${id}`);
  };

  return (
    <div style={{ background: "#FFF7ED", minHeight: "100vh" }}>
      <div className="container">
        <button
          className="btn btn-link mt-4 mb-2"
          onClick={() => navigate('/products')}
        >
          &larr; Back to Categories
        </button>
        <h2 className="mb-4 text-center" style={{ fontWeight: 800, color: "#F97316" }}>
          {displayCat} Products
        </h2>
        <div className="row">
          {items.length === 0 && (
            <div className="col-12 text-center text-muted py-5">
              No products found in this category.
            </div>
          )}
          {items.map((item) => {
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
                    <div className="add-to-cart-center mt-auto d-flex justify-content-center" style={{ gap: '48px' }}>
                      <button
                        className="btn product-card-btn-view"
                        onClick={() => handleView(item.id)}
                      >
                        View
                      </button>
                      <button
                        className={`btn product-card-btn-cart${isAdded ? " added" : ""}`}
                        onClick={() => handleAddToCart(item)}
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
        {/* Back button at the bottom */}
        <div className="d-flex justify-content-center mt-4 mb-4">
          <button
            className="btn"
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
  );
}
