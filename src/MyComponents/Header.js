import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Header.css';
import { auth } from '../firebase';

export default function Header({ user, setUser }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);

  const handleSignOut = async () => {
    await auth.signOut();
    setUser(null);
    navigate('/signin');
  };

  // Close profile menu on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    }
    if (showProfileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showProfileMenu]);

  // Helper to check if link is active
  const isActive = (path) => {
    if (path === "/products") {
      return location.pathname.startsWith("/products");
    }
    return location.pathname === path;
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
              <Link className={`nav-link${isActive("/") ? " active" : ""}`} to="/">
                <span style={{marginRight: 6, verticalAlign: 'middle', display: 'inline-block'}}>
                  {/* Home icon as image */}
                  <img
                    src="https://e7.pngegg.com/pngimages/703/597/png-clipart-logo-house-home-house-angle-building.png"
                    alt="Home"
                    style={{ width: 22, height: 22, objectFit: 'contain', marginBottom: 2 ,background: 'none'}}
                  />
                </span>
                Home
              </Link>
            </li>
            <li className="nav-item mx-2">
              <Link className={`nav-link${isActive("/products") ? " active" : ""}`} to="/products">
                <span style={{marginRight: 6, verticalAlign: 'middle', display: 'inline-block'}}>
                  {/* Products icon as image */}
                  <img
                    src="data:image/png;base64,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"
                    alt="Products"
                    style={{ width: 22, height: 22, objectFit: 'contain', marginBottom: 2 }}
                  />
                </span>
                Products
              </Link>
            </li>
            {/* Show Cart only if user is signed in */}
            {user && (
              <li className="nav-item mx-2">
                <Link className={`nav-link${isActive("/cart") ? " active" : ""}`} to="/cart">
                  <span style={{marginRight: 6, verticalAlign: 'middle', display: 'inline-block'}}>
                    {/* Cart icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="1.18em" height="1.18em" fill="currentColor" viewBox="0 0 16 16" style={{marginBottom: 2}}>
                      <path d="M0 1a1 1 0 0 1 1-1h1.22a1 1 0 0 1 .98.804L3.89 4H14a1 1 0 0 1 .97 1.243l-1.5 6A1 1 0 0 1 12.5 12H4a1 1 0 0 1-1-.89L1.61 2H1a1 1 0 0 1-1-1zm3.14 3l1.25 5h7.22l1.25-5H3.14zM5.5 13a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm6 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/>
                    </svg>
                  </span>
                  Cart
                </Link>
              </li>
            )}
            <li className="nav-item mx-2">
              <Link className={`nav-link${isActive("/about") ? " active" : ""}`} to="/about">
                <span style={{marginRight: 6, verticalAlign: 'middle', display: 'inline-block'}}>
                  {/* Professional About/Info icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="1.18em" height="1.18em" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" style={{marginBottom: 2}}>
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-4m0-4h.01"/>
                  </svg>
                </span>
                About
              </Link>
            </li>
            
          </ul>
          <div className="d-flex align-items-center" style={{ position: "relative" }}>
            {user ? (
              <>
                <div
                  ref={profileMenuRef}
                  style={{ position: "relative" }}
                >
                  <button
                    className="btn btn-link p-0 ms-2"
                    style={{ border: "none", background: "none" }}
                    onClick={() => setShowProfileMenu(v => !v)}
                  >
                    <img
                      src={user.photoURL || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
                      alt="Profile"
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: "2px solid #F97316",
                        background: "#fff"
                      }}
                    />
                  </button>
                  {showProfileMenu && (
                    <div
                      style={{
                        position: "absolute",
                        right: 0,
                        top: "110%",
                        minWidth: 160,
                        background: "#fff",
                        borderRadius: 10,
                        boxShadow: "0 2px 12px rgba(0,0,0,0.13)",
                        zIndex: 2000,
                        padding: "0.5rem 0"
                      }}
                    >
                      <Link
                        to="/account"
                        className="dropdown-item"
                        style={{ padding: "10px 18px", color: "#111", fontWeight: 500, textDecoration: "none" }}
                        onClick={() => setShowProfileMenu(false)}
                      >
                        Account
                      </Link>
                      
                      <button
                        className="dropdown-item"
                        style={{ padding: "10px 18px", color: "#F97316", fontWeight: 600, border: "none", background: "none", width: "100%", textAlign: "left" }}
                        onClick={handleSignOut}
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
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

