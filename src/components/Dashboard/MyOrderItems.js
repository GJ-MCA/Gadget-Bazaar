import React, { useEffect, useState } from 'react';
import { fetchOrderByReferenceCode } from '../../helpers/orderHelper';
import { useLoginMiddleware } from '../../helpers/userHelper';
import { Link, useParams } from 'react-router-dom';
import { pdpPagePreUrl } from '../../config/config';
const MyOrderItems = () => {
  const [order_items, setOrderItems] = useState([]);
  const { order_reference_code } = useParams();
  const loginMiddleware = useLoginMiddleware();
  useEffect(() => {
    loginMiddleware();
    const token = localStorage.getItem("auth-token");
    const fetchData = async () => {
      await fetchOrderByReferenceCode(token, order_reference_code).then(
        data => setOrderItems(data.order)
      );
   
    };
    fetchData();
    console.log("Orders:  ")
    console.log(order_items)
  }, []);

  function capitalizeFirstLetter(str) {
    if(str)
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  return (
    <div className='container my-orders-container'>
      <h2>My Order Items</h2>
     { <h5>Order Id: {order_reference_code}</h5>}
      <h5>Order Date & Time: {new Date(order_items.order_date).toLocaleString()}</h5>
      <h5>Total Amount: &#8377;{Number(order_items.total).toFixed(2)}</h5>
      <h5>Order Status: {capitalizeFirstLetter(order_items.order_status)}</h5>

      <section>
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-12">
              <div className="card card-stepper text-black" style={{borderRadius: "16px"}}>

                <div className="card-body p-5">
                <ul id="progressbar-2" className="d-flex justify-content-between mx-0 mt-0 mb-5 px-0 pt-0 pb-2">
                  <li className={`text-center ${order_items.order_status === "pending" || order_items.order_status === "shipped" || order_items.order_status === "outfordelivery" || order_items.order_status === "delivered" ? "active" : ""}`} id="step1"></li>
                  <li className={`text-center ${order_items.order_status === "shipped" || order_items.order_status === "outfordelivery" || order_items.order_status === "delivered" ? "active" : ""}`} id="step2"></li>
                  <li className={`text-center ${order_items.order_status === "outfordelivery" || order_items.order_status === "delivered" ? "active" : ""}`} id="step3"></li>
                  <li className={`text-center ${order_items.order_status === "delivered" ? "active" : ""}`} id="step4"></li>
                </ul>



                  <div className="d-flex justify-content-between">
                    <div className="d-lg-flex align-items-center">
                      <i className="fa fa-list-alt fa-3x me-lg-4 mb-3 mb-lg-0 mr-2"></i>
                      <div>
                        <p className="fw-bold mb-1">Order</p>
                        <p className="fw-bold mb-0">Processed</p>
                      </div>
                    </div>
                    <div className="d-lg-flex align-items-center">
                      <i className="fa fa-archive fa-3x me-lg-4 mb-3 mb-lg-0 mr-2"></i>
                      <div>
                        <p className="fw-bold mb-1">Order</p>
                        <p className="fw-bold mb-0">Shipped</p>
                      </div>
                    </div>
                    <div className="d-lg-flex align-items-center">
                      <i className="fa fa-truck fa-3x me-lg-4 mb-3 mb-lg-0 mr-2"></i>
                      <div>
                        <p className="fw-bold mb-1">Order</p>
                        <p className="fw-bold mb-0">Out For Delivery</p>
                      </div>
                    </div>
                    <div className="d-lg-flex align-items-center">
                      <i className="fa fa-home fa-3x me-lg-4 mb-3 mb-lg-0 mr-2"></i>
                      <div>
                        <p className="fw-bold mb-1">Order</p>
                        <p className="fw-bold mb-0">Delivered</p>
                      </div>
                    </div>
                  </div>


                </div>

              </div>
            </div>
          </div>
        </div>
      </section>
      {order_items && order_items.items && order_items.items.length > 0 ? (
        <div className='table-container mt-4'>
            <table>
            <thead>
              <tr>
                <th>Sr</th>
                <th>Product Name</th>
                <th>Unit Price</th>
                <th>Qty</th>
                <th>Total Price</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {order_items.items.map((order_item, index) => (
                <tr key={order_item._id}>
                  <td>{index + 1}</td>
                  <td><Link to={pdpPagePreUrl + order_item.product.sku}>{order_item.product.name}</Link></td>
                  <td>&#8377;{(order_item.price * order_item.quantity)}</td>
                  <td>{order_item.quantity}</td>
                  <td>&#8377;{order_item.price}</td>
                  <td>{capitalizeFirstLetter(order_item.order_details_status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No orders found.</p>
      )}
      <div className='container mt-4 text-center'>
      <Link to="/my-orders">Go to My Orders</Link>
      </div>
    </div>
  );
};

export default MyOrderItems;
