// src/components/Account.jsx
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

export default function Account({ user }) {
  const [userData, setUserData] = useState({});
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !user.uid) {
      setUserData({});
      setOrders([]);
      setLoading(false);
      return;
    }
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch user document
        // If you see "Missing or insufficient permissions", your Firestore rules are too strict.
        // Make sure your Firestore rules look like this:
        // 
        // service cloud.firestore {
        //   match /databases/{database}/documents {
        //     match /users/{userId} {
        //       allow read, write: if request.auth != null && request.auth.uid == userId;
        //     }
        //     match /orders/{orderId} {
        //       allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
        //     }
        //   }
        // }
        //
        // After updating rules in the Firebase Console, try again.

        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserData(data);
          console.log("Fetched user data:", data);
        } else {
          setUserData({});
        }

        // Fetch orders
        const q = query(collection(db, 'orders'), where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const orderList = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          let createdAt = data.createdAt?.toDate?.() || null;
          orderList.push({ id: doc.id, ...data, createdAt });
        });

        orderList.sort((a, b) => {
          if (!a.createdAt) return 1;
          if (!b.createdAt) return -1;
          return b.createdAt - a.createdAt;
        });

        setOrders(orderList);
      } catch (err) {
        // If you see this error, check your Firestore rules as described above.
        console.error("Error fetching account data:", err);
        setOrders([]);
      }
      setLoading(false);
    };

    fetchData();
  }, [user]);

  if (!user) {
    return (
      <div className="container my-4">
        <h4>Please sign in to view your account.</h4>
      </div>
    );
  }

  return (
    <div className="container my-4">
      <h3
        className="text-center mb-4"
        style={{
          fontWeight: 700,
          letterSpacing: 1,
          color: "#343a40",
          background: " #adb5bd",
          borderRadius: 12,
          padding: "16px 0",
          marginBottom: "32px"
        }}
      >
        Account Details
      </h3>
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <>
          <div
            className="card p-4 mb-4 mx-auto"
            style={{
              maxWidth: 420,
              boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
              borderRadius: 16,
              background: "#f8f9fa"
            }}
          >
            <h5
              className="mb-3 text-center"
              style={{
                color: "#495057",
                background: "#adb5bd",
                borderRadius: 8,
                padding: "10px 0",
                marginBottom: "18px"
              }}
            >
              User Information
            </h5>
            <div className="mb-2"><strong>Full Name:</strong> {userData.fullName || "-"}</div>
            <div className="mb-2"><strong>Email:</strong> {userData.email || user.email || "-"}</div>
            <div className="mb-2"><strong>Phone:</strong> {userData.phone || "-"}</div>
            <div className="mb-2"><strong>Address:</strong> {userData.address || "-"}</div>
          </div>

          <h5
            className="mt-4 mb-3 text-center"
            style={{
              color: "#495057",
              fontWeight: 600,
              background: "#adb5bd",
              borderRadius: 8,
              padding: "10px 0",
              marginTop: "32px"
            }}
          >
            Order History
          </h5>
          {orders.length === 0 ? (
            <div className="text-center">No previous orders found.</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered table-striped align-middle" style={{ background: "#fff", borderRadius: 12 }}>
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Order Date</th>
                    <th>Items</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, idx) => (
                    <tr key={order.id}>
                      <td>{idx + 1}</td>
                      <td>{order.createdAt ? order.createdAt.toLocaleString() : 'N/A'}</td>
                      <td>
                        <ul className="mb-0 ps-3">
                          {order.items?.map((item, i) => (
                            <li key={i}>{item.title} - ${item.price}</li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
