# Foody E-Commerce React App

This is a responsive e-commerce web application built with React, featuring:
- Product categories (Food, Makeup, Clothes, Electronics, Watches, Vehicles, Sports, Kitchen, Glasses)
- Category-wise and all-products display
- Product search
- Product detail pages
- Add to cart and cart management
- Order confirmation (with Firebase Firestore)
- User authentication (Sign in/Sign up)
- Mobile and desktop responsive UI
- Category and product navigation
- "Back" buttons for easy navigation

## Features

- **Responsive Design:** Works on both desktop and mobile devices.
- **Category Navigation:** Click a category to view all products in that category.
- **Product Details:** View detailed info and add to cart.
- **Cart:** Only visible when signed in.
- **Order Placement:** Confirm your order and save to Firestore.
- **Firebase Integration:** Uses Firestore for orders and user info.
- **Modern UI:** Styled with Bootstrap and custom CSS.

## How to Run

1. **Clone the repository:**
   ```sh
   git clone <your-repo-url>
   cd foody
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Set up Firebase:**
   - Create a Firebase project at [firebase.google.com](https://firebase.google.com/)
   - Enable Firestore and Authentication (Email/Password)
   - Copy your Firebase config to `src/firebase.js`

4. **Start the app:**
   ```sh
   npm start
   ```

5. **Build for production:**
   ```sh
   npm run build
   ```

## Project Structure

```
src/
  MyComponents/
    product.js
    CategoryProducts.js
    ProductDetail.js
    AddToCart.js
    AddItem.js
    Signin.js
    Header.js
  App.js
  firebase.js
  products.css
```

## Main Libraries Used

- React
- React Router DOM
- Bootstrap
- Firebase (Firestore, Auth)

## Customization

- To add more categories or products, update the arrays in `product.js`.
- To change styles, edit `products.css` or inline styles in components.

## Deployment

You can deploy this app to Vercel, Netlify, or Firebase Hosting.

---

**Enjoy your shopping experience with