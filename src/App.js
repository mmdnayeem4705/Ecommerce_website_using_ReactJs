import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './MyComponents/Header';
import Footer from './MyComponents/Footer';
import About from './MyComponents/About';
import ItemList from './MyComponents/ItemList';
import AddItem from './MyComponents/AddItem';
import 'bootstrap/dist/css/bootstrap.min.css';
import Product from './MyComponents/product';
import AddToCart from './MyComponents/AddToCart';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Cart from './MyComponents/Cart';
import ProductDetail from './MyComponents/ProductDetail';
import Home from './MyComponents/Home';
import Signin from './MyComponents/Signin';
import { auth } from './firebase'; // Make sure this is the correct path
import { onAuthStateChanged } from 'firebase/auth';
import History from './MyComponents/History';
import Account from './MyComponents/Account';
import Terms from './MyComponents/Terms';


function App() {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null); // <-- add thiss

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <div style={{paddingBottom: '60px', minHeight: '100vh'}}>
        <Header user={user} setUser={setUser} />
        <AddItem cart={cart} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/products" element={<Product cart={cart} setCart={setCart} user={user} />} />
          <Route path="/products/:id" element={<ProductDetail cart={cart} setCart={setCart} user={user} />} />
          <Route path="/cart" element={<Cart cart={cart} setCart={setCart} user={user} />} />
          <Route
            path="/signin"
            element={
              <SigninWrapper setUser={setUser} />
            }
          />   
          <Route path="/account" element={<Account user={user} />} />
          <Route path="/history" element={<History user={user} />} />
          <Route path="/terms" element={<Terms />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

// Wrapper to inject navigate into Signin
function SigninWrapper(props) {
  const navigate = useNavigate();
  const location = window.location;
  // Check for redirect to signup
  const signupState = (location && location.state && location.state.signup) || false;
  return <Signin {...props} navigate={navigate} isSignup={signupState} />;
}

export default App;

