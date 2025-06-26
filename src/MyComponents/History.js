import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function History({ user }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setOrders([]);
      setLoading(false);
      return;
    }
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, 'orders'),
          where('userId', '==', user.uid)
        );
        const querySnapshot = await getDocs(q);
        const orderList = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          // Convert Firestore Timestamp to JS Date if present
          let createdAt = data.createdAt;
          if (createdAt && createdAt.toDate) {
            createdAt = createdAt.toDate();
          } else {
            createdAt = null;
          }
          orderList.push({ id: doc.id, ...data, createdAt });
        });
        // Sort orders by createdAt descending (most recent first)
        orderList.sort((a, b) => {
          if (!a.createdAt) return 1;
          if (!b.createdAt) return -1;
          return b.createdAt - a.createdAt;
        });
        setOrders(orderList);
      } catch (err) {
        setOrders([]);
      }
      setLoading(false);
    };
    fetchOrders();
  }, [user]);

  if (!user) {
    return (
      <div className="container my-4">
        <h4>Please sign in to view your order history.</h4>
      </div>
    );
  }

  return (
    <div className="container my-4">
      <h3 className="text-center mb-4" style={{ fontWeight: 700, letterSpacing: 1, color: "#343a40" }}>...</h3>
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : orders.length === 0 ? (
        <div className="text-center">No previous orders found.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-striped align-middle" style={{ background: "#fff", borderRadius: 12 }}>
            <thead className="table-light">
              <tr>
                <th>S.no</th>
                <th>Order Date</th>
                <th>Items</th>
                <th>User Info at Order</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, idx) => (
                <tr key={order.id}>
                  <td>{idx + 1}</td>
                  <td>
                    {order.createdAt
                      ? order.createdAt.toLocaleString()
                      : 'N/A'}
                  </td>
                  <td>
                    <ul className="mb-0 ps-3">
                      {order.items && order.items.map((item, i) => (
                        <li key={i}>
                          {item.title} - ${item.price}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>
                    <ul className="mb-0 ps-3">
                      <li><strong>Full Name:</strong> {order.userInfo?.fullName || "-"}</li>
                      <li><strong>Email:</strong> {order.userInfo?.email || "-"}</li>
                      <li><strong>Phone:</strong> {order.userInfo?.phone || "-"}</li>
                      <li><strong>Address:</strong> {order.userInfo?.address || "-"}</li>
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
