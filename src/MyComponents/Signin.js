import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function Signin({ navigate }) {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (isSignup && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      if (isSignup) {
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          await setDoc(doc(db, "users", userCredential.user.uid), {
            fullName,
            email,
            phone,
            address,
          });
          navigate('/account'); // redirect to Account after signup
        } catch (signupErr) {
          if (signupErr.code === "auth/email-already-in-use") {
            setError("Email already in use. Please sign in instead.");
          } else {
            setError(signupErr.message);
          }
        }
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        navigate('/account'); // redirect to Account after signin
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container my-5" style={{ maxWidth: 400 }}>
      <div className="card shadow-sm p-4">
        <h2 className="mb-4 text-center">{isSignup ? 'Sign Up' : 'Sign In'}</h2>
        <form onSubmit={handleSubmit}>
          {isSignup && (
            <>
              <div className="mb-3">
                <input type="text" className="form-control" placeholder="Full Name" required value={fullName} onChange={e => setFullName(e.target.value)} />
              </div>
              <div className="mb-3">
                <input type="text" className="form-control" placeholder="Phone Number" required value={phone} onChange={e => setPhone(e.target.value)} />
              </div>
              <div className="mb-3">
                <input type="text" className="form-control" placeholder="Address" required value={address} onChange={e => setAddress(e.target.value)} />
              </div>
            </>
          )}
          <div className="mb-3">
            <input type="email" className="form-control" placeholder="Email" required value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="mb-3">
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                placeholder="Password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                tabIndex={-1}
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          {isSignup && (
            <div className="mb-3">
              <div className="input-group">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="form-control"
                  placeholder="Confirm Password"
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  tabIndex={-1}
                  onClick={() => setShowConfirmPassword((v) => !v)}
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
          )}
          {error && <div className="alert alert-danger py-1">{error}</div>}
          <button type="submit" className="btn btn-primary w-100">
            {isSignup ? 'Sign Up' : 'Sign In'}
          </button>
        </form>
        <div className="text-center mt-3">
          <button
            className="btn btn-link"
            type="button"
            onClick={() => setIsSignup(!isSignup)}
          >
            {isSignup
              ? 'Already have an account? Sign In'
              : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
}