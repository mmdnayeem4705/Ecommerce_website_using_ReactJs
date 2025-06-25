import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css'; // Make sure this import exists

const subheadings = [
  "Welcome to Nayeem's Grocery Store!",
  "Fresh deals every day!",
  "Your one-stop shop for quality groceries.",
  "Shop smart, live better.",
  "Best prices on essentials and more."
];

export default function Home() {
  const randomSubheading = subheadings[Math.floor(Math.random() * subheadings.length)];
  const navigate = useNavigate();

  return (
    <div className="container text-center my-5 home-fadein">
      <div className="home-hero-bg py-4 mb-4">
        <h1 className="mb-3" style={{ color: '#fff' }}>Nayeem's Store :) </h1>
        <h3 className="mb-3" style={{ color: '#fff' }}>Best prices on essentials and more.</h3>
        <p className="mb-0" style={{ color: '#fff', fontSize: '1.15rem' }}>
          Discover a wide range of products at unbeatable prices. From fresh produce to daily essentials, we have everything you need.
        </p>
      </div>
      <h3 className="text-secondary">{randomSubheading}</h3>
      <button
        className="btn btn-primary mt-4 home-cta-btn"
        onClick={() => navigate('/products')}
      >
        Go for Shopping
      </button>
      <div className="d-flex justify-content-center mt-3">
        <img
          src="https://thumbs.dreamstime.com/b/simple-hand-drawn-sticker-shopping-cart-text-let-s-go-vector-illustration-emblem-label-price-lets-tag-334324394.jpg"
          alt="Shopping Cart"
          style={{ maxWidth: 220, width: '100%', height: 'auto', borderRadius: 12 }}
        />
      </div>
    </div>
  );
}