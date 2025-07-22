# Nayeem Store – Ecommerce Website using ReactJS & Firebase

Nayeem Store is a modern e-commerce web application built with ReactJS and Firebase. It features user authentication, product browsing, cart management, order confirmation, and order history. The UI is responsive and user-friendly, making online shopping seamless.

## Features

- User Sign Up & Sign In (with email, password, phone, address, and full name)
- Product listing by category (Food, Makeup, Clothes, Electronics, Watches, Vehicles, Sports, Kitchen, and more)
- Add to Cart, Remove from Cart, and Quantity management
- Confirm Order and save order history (with user info snapshot)
- View Account details and previous orders
- View Order History page
- Responsive design with Bootstrap
- Firebase Firestore for backend data and authentication

## Technologies Used

- ReactJS (with functional components and hooks)
- Firebase Authentication & Firestore
- Bootstrap 5
- DummyJSON API for product data

## Getting Started

### Prerequisites

- Node.js and npm installed
- Firebase project (for authentication and Firestore)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/mmdnayeem4705/Ecommerce_website_using_ReactJs.git
   cd Ecommerce_website_using_ReactJs
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up Firebase:
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password)
   - Create Firestore database
   - Copy your Firebase config to `src/firebase.js`

4. Set Firestore Rules (for development):
   ```
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
       match /orders/{orderId} {
         allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
       }
     }
   }
   ```

### Running Locally

Demo work
https://ecommerce-website-using-react-js-q972-i8ys3zseh.vercel.app/
login with this credentials 
email = king@gmail.com
password = king123
password = king123
=======
>>>>>>> 5c6b304 (Update project with latest changes)
