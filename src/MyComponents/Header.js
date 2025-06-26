import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Header.css';
import { auth } from '../firebase'; // Add this import

export default function Header({ user, setUser }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await auth.signOut();
    setUser(null);
    navigate('/signin');
  };

  return (
    <nav className="navbar navbar-expand-lg" role="navigation" style={{position: 'sticky', top: 0, zIndex: 1020}}>
      <div className="container d-flex justify-content-between align-items-center">
        <Link className="navbar-brand d-flex align-items-center" to="/" style={{gap: '10px'}}>
          <img
            src="https://thumbs.dreamstime.com/b/eagle-head-simple-logo-design-template-359138889.jpg"
            alt="Logo"
            style={{ height: '38px', width: '38px', objectFit: 'cover', borderRadius: '50%', marginRight: '8px' }}
          />
          Nayeems Store
        </Link>
        <div className="d-flex align-items-center">
          <ul className="navbar-nav flex-row align-items-center me-3">
            <li className="nav-item mx-2">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item mx-2">
              <Link className="nav-link" to="/about">About</Link>
            </li>
            <li className="nav-item mx-2">
              <Link className="nav-link" to="/products">Products</Link>
            </li>
            <li className="nav-item mx-2">
              <Link className="nav-link" to="/cart">Cart</Link>
            </li>
            {user && (
              <>
                <li className="nav-item mx-2">
                  <Link className="nav-link" to="/account">Account</Link>
                </li>
                <li className="nav-item mx-2">
                  <Link className="nav-link" to="/history">History</Link>
                </li>
              </>
            )}
          </ul>
          <div className="d-flex">
            {user ? (
              <button className="btn btn-outline-danger ms-2" onClick={handleSignOut}>
                Sign Out
              </button>
            ) : (
              <Link className="btn btn-outline-primary ms-2" to="/signin">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

