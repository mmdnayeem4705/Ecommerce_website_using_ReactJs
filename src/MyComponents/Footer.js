import React from 'react';

export default function Footer() {
  return (
    <footer
      className="text-center py-3"
      style={{
        background: 'white', 
        position: 'fixed',
        left: 0,
        bottom: 0,
        width: '100%',
        zIndex: 100,
        borderTop: '1px solid #95b2ce'
      }}
    >
      <span style={{ color: '#F97316',fontSize: '1.2rem', fontWeight: 600 ,}}>
        &copy; {new Date().getFullYear()} This Store all rights are reserved by Nayeem
      </span>
    </footer>
  );
}
