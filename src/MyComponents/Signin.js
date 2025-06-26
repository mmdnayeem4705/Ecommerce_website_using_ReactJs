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
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (isSignup && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (isSignup && !acceptTerms) {
      setError("You must accept the Terms and Conditions to sign up.");
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
          navigate('/'); // redirect to Home after signup
        } catch (signupErr) {
          if (signupErr.code === "auth/email-already-in-use") {
            setError("Email already in use. Please sign in instead.");
          } else {
            setError(signupErr.message);
          }
        }
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        navigate('/'); // redirect to Home after signin
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
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                {showPassword ? (
                  // Eye-off icon
                  <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M13.359 11.238l1.397 1.398a.75.75 0 1 1-1.06 1.06l-1.398-1.397A7.03 7.03 0 0 1 8 13.5c-3.07 0-5.64-1.97-7.406-4.5a.75.75 0 0 1 0-.832A13.133 13.133 0 0 1 3.07 5.06L1.646 3.646a.75.75 0 1 1 1.06-1.06l12 12a.75.75 0 1 1-1.06 1.06l-1.397-1.398zm-2.12-2.12l-1.06-1.06A2 2 0 0 0 8 6a2 2 0 0 0-2 2c0 .265.052.518.146.75l-1.06-1.06A3.98 3.98 0 0 1 8 5c1.657 0 3 1.343 3 3 0 .265-.052.518-.146.75z"/>
                    <path d="M8 3.5c3.07 0 5.64 1.97 7.406 4.5a.75.75 0 0 1 0 .832A13.133 13.133 0 0 1 12.93 10.94l-1.06-1.06A3.98 3.98 0 0 0 8 5c-1.657 0-3 1.343-3 3 0 .265.052.518.146.75l-1.06-1.06A7.03 7.03 0 0 1 8 3.5z"/>
                  </svg>
                ) : (
                  // Eye icon
                  <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zm-8 4a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-1.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"/>
                  </svg>
                )}
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
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  {showConfirmPassword ? (
                    // Eye-off icon
                    <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M13.359 11.238l1.397 1.398a.75.75 0 1 1-1.06 1.06l-1.398-1.397A7.03 7.03 0 0 1 8 13.5c-3.07 0-5.64-1.97-7.406-4.5a.75.75 0 0 1 0-.832A13.133 13.133 0 0 1 3.07 5.06L1.646 3.646a.75.75 0 1 1 1.06-1.06l12 12a.75.75 0 1 1-1.06 1.06l-1.397-1.398zm-2.12-2.12l-1.06-1.06A2 2 0 0 0 8 6a2 2 0 0 0-2 2c0 .265.052.518.146.75l-1.06-1.06A3.98 3.98 0 0 1 8 5c1.657 0 3 1.343 3 3 0 .265-.052.518-.146.75z"/>
                      <path d="M8 3.5c3.07 0 5.64 1.97 7.406 4.5a.75.75 0 0 1 0 .832A13.133 13.133 0 0 1 12.93 10.94l-1.06-1.06A3.98 3.98 0 0 0 8 5c-1.657 0-3 1.343-3 3 0 .265.052.518.146.75l-1.06-1.06A7.03 7.03 0 0 1 8 3.5z"/>
                    </svg>
                  ) : (
                    // Eye icon
                    <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zm-8 4a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-1.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>
          )}
          {isSignup && (
            <div className="form-check mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                id="acceptTerms"
                checked={acceptTerms}
                onChange={e => setAcceptTerms(e.target.checked)}
                required
              />
              <label className="form-check-label" htmlFor="acceptTerms">
                I accept the{' '}
                <a
                  href="#"
                  style={{ color: "#F97316", textDecoration: "underline", cursor: "pointer" }}
                  onClick={e => {
                    e.preventDefault();
                    navigate('/terms');
                  }}
                >
                  Terms and Conditions
                </a>
              </label>
            </div>
          )}
          {error && <div className="alert alert-danger py-1">{error}</div>}
          <button type="submit" className="btn btn-primary w-100" disabled={isSignup && !acceptTerms}>
            {isSignup ? 'Sign Up' : 'Sign In'}
          </button>
        </form>
        <div className="text-center mt-3">
          <button
            className="btn btn-link"
            type="button"
            onClick={() => setIsSignup(!isSignup)}
            autoFocus={false}
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