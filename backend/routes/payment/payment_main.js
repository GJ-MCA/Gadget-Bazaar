const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const payment_provider = require("../../provider/payment");
const fetchuser = require('../../middleware/fetchuser');
const stripe = require('stripe')(payment_provider.stripe_secret_key);
const backend_base_url = "http://localhost:5000/backend-gadgetbazaar";
const payment_order_success_page = "http://localhost:3000/payment-success"
const payment_cancel_page = "http://localhost:3000/order-confirmation"
const Payment_Detail = require("../../models/Payment_Detail");
const Order_Detail = require("../../models/Order_Detail");
//ROUTE: 1 - Create checkout session - POST "backend-gadgetbazaar/payment/create-payment-session"
router.post('/create-payment-session', fetchuser, async (req, res) => {
    const { order_id } = req.body;
    const token = req.headers['auth-token'];
    let orderData, order_details, stripe_session;
  
    // Fetch the order
    try {
      const response = await fetch(`${backend_base_url}/order/getorder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': token
        },
        body: JSON.stringify({ order_id: order_id })
      });
      orderData = await response.json();
      order_details = orderData.order_details[0];
    } catch (err) {
      console.error("Error while fetching order data in payment: " + err.message);
      return res.status(500).send({ error: 'Failed to fetch order data in payment' });
    }
  
    // Create a Stripe session
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        success_url: payment_order_success_page,
        cancel_url: payment_cancel_page,
        line_items: [{
          price_data: {
            currency: 'inr',
            unit_amount: order_details.total * 100,
            product_data: {
              name: 'Total Amount'
            }
          },
          quantity: 1
        }],
        client_reference_id: order_id // Pass order_id as client_reference_id
      });
  
      stripe_session = session.id;
      console.log("Session: ");
      console.log(session)  
      res.status(200).json({ session: session });
    } catch (err) {
      console.error(err.message);
      return res.status(500).send({ error: 'Error in generating stripe_session' });
    }
});
  
  // Handle the webhook event
router.post('/stripe-webhook', async (req, res) => {
    console.log("Stripe Webhook Called")
    const event = req.body;
    console.log(event)
    if (event.type === 'checkout.session.completed'){
        const checkoutSession = event.data.object;
        const checkoutOrderId = checkoutSession.client_reference_id;
        const checkoutPaymentIntentId = checkoutSession.payment_intent;
        const checkoutPaymentStatus = checkoutSession.payment_status;
        if(checkoutSession && checkoutOrderId && checkoutPaymentIntentId && checkoutPaymentStatus){
            if(checkoutPaymentStatus === "paid"){
                try{
                    // Get order details from the database
                    const orderDetails = await Order_Detail.findOne({ order_id: checkoutOrderId });
                    if (!orderDetails) {
                        throw new Error('Order not found in checkout session webhook');
                    }
                    // Update order status to 'paid'
                    orderDetails.payment_status = 'paid';
                    await orderDetails.save();
        
                    // Create a payment record with the Stripe session ID
                    const paymentRecord = new Payment_Detail({
                        user_id: req.user.id,
                        payment_order_id: checkoutPaymentIntentId,
                        order_id: orderDetails,
                    });
                    await paymentRecord.save();

                    try{
                        await CartItem.deleteMany({ customer_id: req.user.id });
                    }catch(err){
                        console.log("Error in stripe webhook while deleting the cart: " + err);
                    }

                    if(localStorage.getItem("user_order"))
                        localStorage.removeItem("user_order");

                }catch(err){
                    console.error("Error in creating new updating order details/payment record in stripe webhook"+err.message);
                    return res.status(500).send({ error: "Error in creating new updating order details/payment record in stripe webhook"+err.message });
                }
            }
        }
    }
    res.sendStatus(200);
});
  
  
module.exports = router;