import React, { useEffect, useState } from 'react';
import { getOrderByReferenceCode, getOrderStatusValues, updateOrderEstimatedDeliveryDate, updateOrderStatusValue } from '../../../helpers/adminHelper';
import { Link, useParams } from 'react-router-dom';
import { pdpPagePreUrl } from '../../../config/config';
import { updateLoader } from '../../../helpers/generalHelper';
import { setPageTitle } from '../../../helpers/titleHelper';
const OrderItems = () => {
  const [order_items, setOrderItems] = useState([]);
  const [orderStatusValues, setOrderStatusValues] = useState([]);
  const [orderStatus, setOrderStatus] = useState("");
  const [estimatedDelivery, setEstimatedDelivery] = useState("");
  const { order_reference_code } = useParams();
  console.log(order_reference_code)
  const [isOrderFound, setIsOrderFound] = useState(false)
  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    const fetchData = async () => {
      updateLoader(true);
      await getOrderByReferenceCode(order_reference_code).then(
        (data) => {
          if(data){
            console.log(data)
            if(data.success === true){
              setOrderItems(data.order)
              setIsOrderFound(true);
              setOrderStatus(data.order.order_status)
              if(data.order.estimated_delivery_date){
                const dateObj = new Date(data.order.estimated_delivery_date)
                const formattedDate = `${dateObj.getFullYear()}-${(dateObj.getMonth() + 1).toString().padStart(2, '0')}-${dateObj.getDate().toString().padStart(2, '0')}`;
                setEstimatedDelivery(formattedDate);
              }
            }else{
              setIsOrderFound(false);
            }
          }
        });
   updateLoader(false);
    };
    const fetchOrderStatusOptions = async () =>{
      await getOrderStatusValues().then(
        (data)=>{
          if(data.success === true){
            setOrderStatusValues(data.orderStatusOptions)
          }
        }
      )
    }
    fetchData();
    fetchOrderStatusOptions();
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
  const showNotification = () =>{
    console.log("Show notification called")
    var x = document.getElementById("snackbar");

    // Add the "show" class to DIV
    x.className = "show";
  
    // After 3 seconds, remove the show class from DIV
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
  }
  const handleOrderStatus = async(event)=>{
    updateLoader(true);
    await updateOrderStatusValue(order_items._id, event.target.value).then(
      (data)=>{
        if(data.success === true){
          setOrderStatus(event.target.value)
        }
      }
    )
    await getOrderByReferenceCode(order_reference_code).then(
      (data) => {
        if(data){
          console.log(data)
          if(data.success === true){
            setOrderItems(data.order)
            setIsOrderFound(true);
            setOrderStatus(data.order.order_status)
          }else{
            setIsOrderFound(false);
          }
        }
      });
      updateLoader(false);
      showNotification();
  }
  
  const handleOrderEstimatedDeliveryDate = async(event)=>{
    updateLoader(true);
    await updateOrderEstimatedDeliveryDate(order_items._id, event.target.value).then(
      (data)=>{
        if(data.success === true){
          setEstimatedDelivery(event.target.value)
        }
      }
    )
    await getOrderByReferenceCode(order_reference_code).then(
      (data) => {
        if(data){
          console.log(data)
          if(data.success === true){
            setOrderItems(data.order)
            setIsOrderFound(true);
            setOrderStatus(data.order.order_status)
            setEstimatedDelivery(data.order.estimated_delivery_date);
          }else{
            setIsOrderFound(false);
          }
        }
      });
      updateLoader(false);
      showNotification();
  }
  
  return (
    <div className='container my-orders-container content' style={{marginTop: "104px"}}>
      {setPageTitle("Order Items")}
      <h2>Order Items</h2>
      {isOrderFound ? (
        <>
        { <h5>Order Id: {order_reference_code}</h5>}
        <h5>Order Date & Time: {new Date(order_items.order_date).toLocaleString()}</h5>
        <h5>Total Amount: &#8377;{Number(order_items.total).toFixed(2)}</h5>
        {order_items.coupon_code && (<h5>Coupon Code Used: {order_items.coupon_code.coupon_code}</h5>)}
        {order_items.discounted_total && (<h5>Discounted Amount: &#8377;{Number(order_items.total).toFixed(2)}</h5>)}
        <h5>Order Status: {capitalizeFirstLetter(order_items.order_status)}</h5>
        <h5>Estimated Delivery Date: {order_items.estimated_delivery_date ? formatEstimatedDate(order_items.estimated_delivery_date) : "Calculating, Please check again later."}</h5>
        <h5>Payment Status: {capitalizeFirstLetter(order_items.payment_status)}</h5>
        <div id="snackbar" className="alert alert-success">
            Order Status Updated!
        </div>
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
                    <div className='form-control mt-4'>
                      <label htmlFor='estimated_delivery' style={{fontSize: "1rem", color: "#000", marginBottom: "0"}}> Update Estimated Delivery Date:  </label>
                      <input type='date' className='ml-2' style={{textTransform: "capitalize"}} id="estimated_delivery" name='estimated_delivery' value={estimatedDelivery || ""}  onChange={(event) => handleOrderEstimatedDeliveryDate(event)}/>
                    </div>
                    <div className='dropdown-container form-control mt-4'>
                      <label htmlFor='order_status' style={{fontSize: "1rem", color: "#000", marginBottom: "0"}}> Update Order Status:  </label>
                      <select className='ml-2' style={{textTransform: "capitalize"}} id="order_status" name='order_status' value={orderStatus || ""}  onChange={(event) => handleOrderStatus(event)}>
                        {orderStatusValues.map(option => (
                          <option key={option} value={option}>{(option)==="outfordelivery"?"Out For Delivery":(option)}</option>
                        ))}
                      </select>
                      <span className='badge badge-info ml-2 order-status-update-info-text' style={{fontSize: "100%"}}>
                        <i className='fa fa-info-circle mr-2'></i>
                        Order Status Update Email Will be Sent to The Customer
                      </span>
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
    </div>
  );
};

export default OrderItems;
