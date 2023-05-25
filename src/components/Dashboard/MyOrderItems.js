import React, { useEffect, useState } from 'react';
import { fetchOrderByReferenceCode } from '../../helpers/orderHelper';
import { useLoginMiddleware } from '../../helpers/userHelper';
import { Link, useParams } from 'react-router-dom';
import { pdpPagePreUrl } from '../../config/config';
const MyOrderItems = () => {
  const [order_items, setOrderItems] = useState([]);
  const { order_reference_code } = useParams();
  const loginMiddleware = useLoginMiddleware();
  const [isOrderFound, setIsOrderFound] = useState(false)
  useEffect(() => {
    loginMiddleware();
    const token = localStorage.getItem("auth-token");
    const fetchData = async () => {
      await fetchOrderByReferenceCode(token, order_reference_code).then(
        (data) => {
          if(data){
            console.log(data)
            if(data.success === true){
              setOrderItems(data.order)
              setIsOrderFound(true);
            }else{
              setIsOrderFound(false);
            }
          }
        });
   
    };
    fetchData();
    console.log("Orders:  ")
    console.log(order_items)
  }, []);

  function capitalizeFirstLetter(str) {
    if(str)
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  function formatEstimatedDate(date_string) {
    const date = new Date(date_string);
    const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', options);
    const formattedDateArray = formattedDate.split(", ");
    const formattedDayArray = formattedDateArray[1].split(" ");
    const formattedDateString = formattedDayArray[1] + "-" + formattedDayArray[0].substring(0, 3) + "-" + formattedDateArray[2] + " " + formattedDateArray[0];
    return formattedDateString;
  }
  

  
  return (
    <div className='container my-orders-container' style={{marginTop: "104px"}}>
      <h2>My Order Items</h2>
      {isOrderFound ? (
        <>
        { <h5>Order Id: {order_reference_code}</h5>}
        <h5>Order Date & Time: {new Date(order_items.order_date).toLocaleString()}</h5>
        <h5>Total Amount: &#8377;{Number(order_items.total).toFixed(2)}</h5>
        {order_items.coupon_code && (<h5>Coupon Code Used: {order_items.coupon_code.coupon_code}</h5>)}
        {order_items.discounted_total && (<h5>Discounted Amount: &#8377;{Number(order_items.total).toFixed(2)}</h5>)}
        <h5>Order Status: {capitalizeFirstLetter(order_items.order_status)}</h5>
        <h5>Estimated Delivery Date: {order_items.estimated_delivery_date ? formatEstimatedDate(order_items.estimated_delivery_date) : "Calculating, Please check again later."}</h5>

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
                    <td>&#8377;{parseFloat(order_item.price).toFixed(2)}</td>
                    <td>{order_item.quantity}</td>
                    <td>&#8377;{(parseFloat(order_item.price) * order_item.quantity).toFixed(2)}</td>
                    <td>{capitalizeFirstLetter(order_item.order_items_status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No orders found.</p>
        )}
        </>
      ):(
        <>
          <h5 className='text-center'> Order Not Found With Order Id: {order_reference_code} </h5>
          <p className='text-center'> Please Go to My Orders Page Using Below Link and Check Your Orders </p>
        </>
      )}
      <div className='container mt-4 text-center'>
      <Link to="/my-orders">Go to My Orders</Link>
      </div>
    </div>
  );
};

export default MyOrderItems;
