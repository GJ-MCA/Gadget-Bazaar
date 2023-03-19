const express = require('express');
const fetchuser = require('../../middleware/fetchuser');
const router = express.Router();
const CartItem = require('../../models/Cart_Item');
const OrderDetails = require('../../models/Order_Details');
const OrderItems = require('../../models/Order_Items');
const Product = require('../../models/Product');
//ROUTE: 1 - Add to Cart the Product - POST "gadgetbazaar/order/cart/add"
router.post('/cart/add', fetchuser, async (req, res) => {
  try {
    const { product_id } = req.body;

    // Check product availability
    const product = await Product.findById(product_id);
    if (!product || product.quantity < 1) {
      return res.status(200).json({ success: false, error: 'Product not available', errcode:"OUTOFSTOCK"});
    }

    // Find or create a cart item for the product and user
    const cartItem = await CartItem.findOneAndUpdate(
      { customer_id: req.user.id, product_id },
      { $inc: { quantity: 1 } },
      { upsert: true, new: true }
    ).populate('product_id');

    // Decrease product quantity by the amount added to cart
    await Product.findByIdAndUpdate(product_id, { $inc: { quantity: -1 } });

    res.json({ success: true, cartItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

//ROUTE: 2 - Buy Now the Product - POST "gadgetbazaar/order/buy-now"
router.post('/buy-now', fetchuser, async (req, res) => {
  try {
    const { product_id, total, payment_id } = req.body;
    const orderDetails = new OrderDetails({ user_id: req.user._id, total, payment_id });
    const orderItem = new OrderItems({ order_id: orderDetails._id, product_id, quantity:1 });
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

    if (!user_id || !items || !total || !payment_id) {
      return res.status(400).json({ success: false, error: 'Missing required fields.' });
    }

    const orderDetails = new OrderDetails({ user_id, total, payment_id });
    const orderItems = items.map(item => new OrderItems({ order_id: orderDetails._id, product_id: item.product_id, quantity: item.quantity }));

    await Promise.all([orderDetails.save(), ...orderItems.map(item => item.save())]);

    res.json({ success: true, orderDetails, orderItems });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

//ROUTE: 4 - Get cart items for the authenticated user - POST "gadgetbazaar/order/getcart"
router.get('/getcart', fetchuser, async (req, res) => {
  const userId = req.user.id;

  try {
    const cartItems = await CartItem.find({ customer_id: userId })
      .populate('product_id')
      .exec();
    res.json(cartItems);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
