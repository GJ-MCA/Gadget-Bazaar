import React, { useEffect, useState } from 'react';
import { fetchAllOrdersForCurrentUser } from '../../helpers/orderHelper';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    fetchAllOrdersForCurrentUser(token).then(data => setOrders(data));
  }, []);
  

  return (
    <div className='container my-orders-container'>
      <h2>My Orders</h2>
      {orders.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Total Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order.order_reference_code}</td>
                <td>{new Date(order.createdAt).toLocaleString()}</td>
                <td>{order.total_price}</td>
                <td>{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
};

export default MyOrders;
