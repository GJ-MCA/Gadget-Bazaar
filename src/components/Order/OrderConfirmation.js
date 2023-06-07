import React, {useState, useEffect, useContext} from 'react'
import { useNavigate } from 'react-router-dom';
import { getAddressById } from '../../helpers/addressHelper';
import fetchOrderById from '../../helpers/orderHelper';
import {GadgetBazaarContext} from '../../context/GadgetBazaarContext';
import fetchCartItems, { fetchCouponFromId, getShippingMethodById } from '../../helpers/cartHelper';
import Stripe from 'stripe';
import { updateLoader } from '../../helpers/generalHelper';
import { setPageTitle } from '../../helpers/titleHelper';

export const OrderConfirmation = () => {
    const {cartItems, setCartItems, cartFinalTotal, setCartFinalTotal, couponCode, setCouponCode, isCouponCodeApplied, setIsCouponCodeApplied, couponDiscountPercentages, setCouponDiscountPercentages, couponDiscount, setCouponDiscount, discountedPrice, setDiscountedPrice, discountAmount, setDiscountAmount, cartFinalWithoutShipping, setCartFinalWithoutShipping, discountedPriceWithoutShipping, setDiscountedPriceWithoutShipping } = useContext(GadgetBazaarContext);

    const [billingAddress, setBillingAddress] = useState(null);
    const [shippingAddress, setShippingAddress] = useState(null);
    const [shippingMethod, setShippingMethod] = useState(null);
    const [dataBillingAddressId, setDataBillingAddressId] = useState(null);
    const [dataShippingAddressId, setDataShippingAddressId] = useState(null);
    const [shipping_method_id, setShippingMethodId] = useState(null);
    const payment_config = require("../../config/payment");
    const navigate = useNavigate();
    const stripe = Stripe(payment_config.stripe_secret_key);
    const config = require("../../config/config");
    useEffect(() => {
        const fetchData = async () => {
          try {
            const userOrder = JSON.parse(localStorage.getItem('user_order'));
            if (userOrder) {
              const orderId = userOrder.orderId;
              const token = localStorage.getItem('auth-token');
              if (token) {
                const orderDetailsResponse = await fetchOrderById(token, userOrder.secret_order_id);
                if (orderDetailsResponse.success) {
                  setDataBillingAddressId(orderDetailsResponse.order_details[0].billing_address);
                  setDataShippingAddressId(orderDetailsResponse.order_details[0].shipping_address);
                  setShippingMethodId(orderDetailsResponse.order_details[0].shipping_method);
                }
                if (dataBillingAddressId) {
                  const billingAddressResponse = await getAddressById(dataBillingAddressId, token);
                  setBillingAddress(billingAddressResponse);
                }
                if (dataShippingAddressId) {
                  const shippingAddressResponse = await getAddressById(dataShippingAddressId, token);
                  setShippingAddress(shippingAddressResponse);
                }
                if (shipping_method_id) {
                  const shippingMethodResponse = await getShippingMethodById(shipping_method_id, token);
                  setShippingMethod(shippingMethodResponse);
                }
                const cartItemsResponse = await fetchCartItems(token);
                setCartItems(cartItemsResponse.cartItems);
                setCartFinalTotal(cartItemsResponse.cartTotalAmount);
                setCartFinalWithoutShipping(Number(cartItemsResponse.cartTotalAmount) - 40)
                if (cartItemsResponse.cart && cartItemsResponse.cart[0].coupon_code) {
                  const couponResponse = await fetchCouponFromId(token, cartItemsResponse.cart[0].coupon_code);
                  if (couponResponse.coupon_code_found) {
                    setIsCouponCodeApplied(true);
                    const couponCodeObj = couponResponse.coupon_code;
                    setCouponCode(couponCodeObj.coupon_code);
                    setCouponDiscountPercentages(couponCodeObj.discount);
                    const discount = parseFloat(couponCodeObj.discount) / 100;
                    setCouponDiscount(discount);
                    setDiscountAmount((cartFinalWithoutShipping * couponDiscount).toFixed(2));
                    const discountedAmount = (cartFinalWithoutShipping - (cartFinalWithoutShipping * couponDiscount)).toFixed(2);
                    setDiscountedPriceWithoutShipping(discountedAmount);
                    setDiscountedPrice((Number(discountedAmount) + 40).toFixed(2));
                  } else {
                    setIsCouponCodeApplied(false);
                  }
                }
              }
            }
          } catch (error) {
            console.error(error);
          }
        };
        fetchData();
      }, [dataBillingAddressId, dataShippingAddressId, setCartItems, cartFinalTotal, couponDiscount]);
      
      // Initialize the Stripe object with your API key
   
    // Handler function for "Confirm and Pay" button click event
    const handleConfirmPay = ()=>{
        const userOrder = JSON.parse(localStorage.getItem('user_order'));
        const token = localStorage.getItem('auth-token');
        if(userOrder){
            try{
                updateLoader(true); //Show Gadgetbazaar Loader
                fetch(`${config.paymentAPIUrl}/create-payment-session`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': `Bearer ${token}`,
                        'Access-Control-Allow-Origin': '*'
                    },
                    body: JSON.stringify({
                        order_id: userOrder.orderId,
                        secret_order_id: userOrder.secret_order_id
                    })
                })
                .then(function(response) {
                    return response.json();
                })
                .then(function(session) {
                    // Redirect the user to the Stripe Checkout page
                    console.log("Got the payment session")
                    console.log(session.session)
                    console.log(session.session.url)
                    console.log("Printing stripe object")
                    console.log(session)
                    window.location.href = session.session.url;
                    updateLoader(false); //Hide Gadgetbazaar Loader
                })
            }catch(err){
                updateLoader(false); //Hide Gadgetbazaar Loader
                console.log("Error while calling calling payment")
            }
        }
    }
    return (
        <div className="container" style={{marginTop: "104px"}}>
            {setPageTitle("Order Confirmation")}
            <div className="row">
                <div className="col w-100">
                    <h1 style={{ textAlign: 'center',fontSize: '2rem',fontWeight: 'bold',margin: '2rem 0', fontFamily: '-apple-system, BlinkMacSystemFont,Segoe UI, Roboto, Oxygen,Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif'}}>Confirm Your Order <br/> 
                    <span className='d-inline-block' style={{fontSize: '1.6rem', borderTop: "2px dashed grey", marginTop: "5px", paddingTop: "5px"}}>Please Review Your Order Details</span></h1>
                    <h4 className="mb-3">Order Summary</h4>
                    <div className='d-flex w-100 justify-content-between'>
                        {shippingAddress && (
                        <div className="mb-3 w-50">
                            <h6>Shipping Address:</h6>
                            <p>
                                {shippingAddress.address_line_1}
                                {shippingAddress.address_line_2 && ","+shippingAddress.address_line_2} 
                                {shippingAddress.city && ","+shippingAddress.city}
                                {shippingAddress.state && ","+shippingAddress.state}
                                {shippingAddress.pincode && ","+shippingAddress.pincode}
                                {shippingAddress.country && ","+shippingAddress.country}
                            </p>
                        </div>
                        )}
                        {billingAddress && (
                        <div className="mb-3 w-50">
                            <h6>Billing Address:</h6>
                            <p>
                                {billingAddress.address_line_1}
                                {billingAddress.address_line_2 && ","+billingAddress.address_line_2} 
                                {billingAddress.city && ","+billingAddress.city}
                                {billingAddress.state && ","+billingAddress.state}
                                {billingAddress.pincode && ","+billingAddress.pincode}
                                {billingAddress.country && ","+billingAddress.country}
                            </p>
                        </div>
                        )}
                    </div>
                    <div className='d-flex w-100 justify-content-between'> 
                        {shippingMethod && (
                            <div className='d-flex w-100 justify-content-between'>
                                <div className="mb-3 w-50">
                                    <h6>Shipping Method:</h6>
                                    <p>{shippingMethod.shipping_method}</p>
                                </div>
                                <div className="mb-3 w-50">
                                    <h6>Shipping Charges:</h6>
                                    <p> &#8377;{shippingMethod.shipping_charge}</p>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="col order-md-2 mb-4 p-0">
                        <h4 className="d-flex justify-content-between align-items-center mb-3">
                            <span className="text-muted">Your Order Items</span>
                            <span className="badge badge-secondary badge-pill">{cartItems.length}</span>
                        </h4>
                        {cartItems.length === 0 ? (
                            <p>No items in cart</p>
                        ) : (
                            <ul className="list-group mb-3 sticky-top checkout-items-container" style={{ maxHeight: '865px', overflowY: 'auto', paddingBottom: "5px" }}>
                                {cartItems.map((cartItem) => (
                                <li key={cartItem.product_id.id} className="list-group-item d-flex justify-content-between lh-condensed">
                                    <div>
                                        <h6 className="my-0 text-left">{cartItem.product_id.name} x {cartItem.quantity}</h6>
                                        
                                        <small className="text-muted text-left">{cartItem.product_id.description.slice(0, 120)}{cartItem.product_id.description.length > 120 ? '...' : ''}</small>
                                    </div>
                                    <div>
                                        <div className="text-muted text-right">&#8377;{cartItem.price}/Item</div>
                                        <div className="text-muted text-right">Item Total: &#8377;{cartItem.price * cartItem.quantity}</div>
                                    </div>
                                </li>
                                ))}
                                <li className="list-group-item d-flex justify-content-between bg-light">
                                    <div className="text-muted">
                                        <h6 className="my-0">Delivery Charges</h6>
                                        <small>Standard</small>
                                    </div>
                                    <span className="text-muted">+ &#8377;40.00</span>
                                </li>
                                {isCouponCodeApplied && (
                                <>
                                    <li className="list-group-item d-flex justify-content-between bg-light">
                                        <div className="text-success">
                                            <h6 className="my-0">Promo code</h6>
                                            <small>{`${couponCode} (${couponDiscountPercentages}% Off)`}</small>
                                        </div>
                                        <span className="text-success">- &#8377;{discountAmount}</span>
                                    </li>
                                </>
                                )}
                                <li className="list-group-item d-flex justify-content-between" style={{minHeight: "51px"}}>
                                    <span>Total</span>
                                    <strong>&#8377;{isCouponCodeApplied ? discountedPrice : cartFinalTotal}</strong>
                                </li>
                            </ul>
                        )}
                    </div>

                    <div className="d-flex justify-content-center my-5">
                    <button className="btn btn-primary mx-2" id='confirm_payment_btn' onClick={handleConfirmPay}>
                        Confirm and Pay
                    </button>
                    <button className="btn btn-secondary custom-secondary-btn mx-2" onClick={() => navigate('/cart')}>
                        &lt; Back to Cart
                    </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
