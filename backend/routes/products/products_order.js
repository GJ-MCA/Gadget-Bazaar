const express = require('express');
const fetchuser = require('../../middleware/fetchuser');
const router = express.Router();
const CartItem = require('../../models/Cart_Item');
const OrderDetails = require('../../models/Order_Details');
const OrderItems = require('../../models/Order_Items');
const Shopping_Session = require("../../models/Shopping_Session")
//ROUTE: 1 - Add to Cart the Product - POST "gadgetbazaar/order/cart/add"
router.post('/cart/add', fetchuser, async (req, res) => {
  try {
    const { session_id, product_id } = req.body;

    // Find or create a shopping session for the user
    console.log("req.user: ")
    console.log(req.user);
    const shoppingSession = await Shopping_Session.findOneAndUpdate(
      { user_id: req.user._id },
      { $setOnInsert: { user_id: req.user._id, total: 0, cart_items: [] } },
      { upsert: true, new: true }
    );

    // Find or create a cart item for the product in the shopping session
    const cartItem = await CartItem.findOneAndUpdate(
      { session_id: shoppingSession._id, product_id },
      { $inc: { quantity: 1 } },
      { upsert: true, new: true }
    ).populate('product_id');

    // Update the shopping session total based on the new cart item
    const total = shoppingSession.total + cartItem.product_id.price;
    shoppingSession.total = total;
    shoppingSession.cart_items.push(cartItem._id);
    await shoppingSession.save();

    res.json({ success: true, cartItem, total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});




//ROUTE: 2 - Buy Now the Product - POST "gadgetbazaar/order/buy-now"
router.post('/buy-now', fetchuser, async (req, res) => {
  try {
    const { user_id, product_id, quantity, total, payment_id } = req.body;
    const orderDetails = new OrderDetails({ user_id, total, payment_id });
    const orderItem = new OrderItems({ order_id: orderDetails._id, product_id, quantity });
    await Promise.all([orderDetails.save(), orderItem.save()]);
    res.json({ success: true, orderDetails, orderItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

//ROUTE: 3 - Checkout Multiple Products - POST "gadgetbazaar/order/checkout"
router.post('/checkout', async (req, res) => {
  try {
    const { user_id, items, total, payment_id } = req.body;
    const orderDetails = new OrderDetails({ user_id, total, payment_id });
    const orderItems = items.map(item => new OrderItems({ order_id: orderDetails._id, product_id: item.product_id, quantity: item.quantity }));
    await Promise.all([orderDetails.save(), ...orderItems.map(item => item.save())]);
    res.json({ success: true, orderDetails, orderItems });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});


module.exports = router;
