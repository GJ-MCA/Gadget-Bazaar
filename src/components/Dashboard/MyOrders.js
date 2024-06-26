import React, { useEffect, useState } from 'react';
import { fetchAllOrdersForCurrentUser } from '../../helpers/orderHelper';
import { useLoginMiddleware } from '../../helpers/userHelper';
import { myOrdersPreUrl } from '../../config/config';
import { Link } from 'react-router-dom';
import { setPageTitle } from '../../helpers/titleHelper';
const MyOrders = () => {
  const [orders, setOrders] = useState([]);

  const loginMiddleware = useLoginMiddleware();

  useEffect(() => {
    loginMiddleware();
    const token = localStorage.getItem("auth-token");
    const fetchData = async () => {
      await fetchAllOrdersForCurrentUser(token).then(
        data => setOrders(data.orders)
      );
   
    };
    fetchData();
    console.log("Orders: ")
    console.log(orders)
  }, []);

  function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  return (
    <div className='container my-orders-container' style={{minHeight: "30vh", marginTop: "104px"}}>
      {setPageTitle("My Orders")}
      <h2>My Orders</h2>
      {orders.length > 0 ? (
        <div className='table-container'>
            <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Order Date & Time</th>
                <th>Total Amount</th>
                <th>Discounted Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td><Link to={myOrdersPreUrl + order.order_reference_code}>{order.order_reference_code}</Link></td>
                  <td>{new Date(order.order_date).toLocaleString()}</td>
                  <td>&#8377;{order.total}</td>
                  <td>{order.discounted_total ? '\u20B9' + order.discounted_total : 'N/A'}</td>
                  <td>{capitalizeFirstLetter(order.order_status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <>
          <p>No orders found.</p>
          <Link to="/products"> Shop Now </Link>
        </>
      )}
    </div>
  );
};

export default MyOrders;
