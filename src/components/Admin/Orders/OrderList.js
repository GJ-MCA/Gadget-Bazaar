import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { adminMainAPIUrl, orderAPIUrl } from '../../../config/config';
import { adminFrontOrdersPostFix, addNeccessaryClasses } from '../../../helpers/adminHelper';

function OrderList() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`${adminMainAPIUrl}/orders/getall`);
      const data = await response.json();
      setOrders(data.orders);
    }
    fetchData();
    
    addNeccessaryClasses();
  }, []);

  const handleAddOrderClick = () => {
    navigate(adminFrontOrdersPostFix + '/add');
  };

  const handleEditOrderClick = (id) => {
    if (id) {
      navigate(adminFrontOrdersPostFix + '/edit/' + id);
    } else {
      alert('Something went wrong!');
    }
  };
  const formatDate = (datestr) =>{
    const dateTime = new Date(datestr);
    const options = {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: 'numeric', minute: 'numeric', second: 'numeric',
    hour12: true,
    };
    const formattedDateTime = dateTime.toLocaleString('en-IN', options);
    return formattedDateTime;
  }
  return (
    <div className='main-table-container content'>
      <h2>Order List</h2>
      <button onClick={handleAddOrderClick}>Add Order</button>
      {console.log(orders)}
        {orders && orders.length > 0 ? 
        <>
            <div className='table-container mt-4'>
                <table>
                    <thead>
                    <tr>
                        <th>Order Reference Code</th>
                        <th>User ID</th>
                        <th>Order Date</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {orders.map((order) => (
                        <tr key={order._id}>
                            <td>{order.order_reference_code}</td>
                            <td>{order.user_id}</td>
                            <td>{formatDate(order.order_date)}</td>
                            <td>
                                <Link to={adminFrontOrdersPostFix+"/"+order.order_reference_code}> View/Edit Order </Link>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </>
        : <>
          <p>No orders found.</p>
        </>}
    </div>
  );
}

export default OrderList;
