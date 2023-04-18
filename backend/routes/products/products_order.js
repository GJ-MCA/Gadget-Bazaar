const express = require('express');
const fetchuser = require('../../middleware/fetchuser');
const router = express.Router();
const CartItem = require('../../models/Cart_Item');
const OrderDetails = require('../../models/Order_Detail');
const OrderItems = require('../../models/Order_Item');
const Product = require('../../models/Product');
const ShippingMethod = require('../../models/ShippingMethod');
const Address = require("../../models/Address");
//ROUTE: 1 - Add to Cart the Product - POST "backend-gadgetbazaar/order/cart/add"
router.post('/cart/add', fetchuser, async (req, res) => {
  try {
    const { product_id } = req.body;

    // Check product availability
    const product = await Product.findById(product_id);
    if (!product || product.quantity < 1) {
      return res.status(200).json({ success: false, error: 'Product not available', errcode:"OUTOFSTOCK"});
    }

    // Find or create a cart item for the product and user
    let cartItem = await CartItem.findOne({ customer_id: req.user.id, product_id }).populate('product_id');

    if (!cartItem) {
      // Create a new cart item
      cartItem = new CartItem({
        customer_id: req.user.id,
        product_id,
        quantity: 1,
        shipping_charge: 40, // set shipping charge here
      });
    } else {
      // Update the cart item quantity and shipping charge
      cartItem.quantity += 1;
      cartItem.shipping_charge = 40; // set shipping charge here
    }

    // Calculate the item total and update it in the cart item
    let cartTotalAmount = 0.0;
    const cartItems = await CartItem.find({ customer_id: req.user.id }).populate('product_id');
    cartItems.forEach(item => {
      cartTotalAmount += item.product_id.price * item.quantity;
      item.item_total = item.product_id.price * item.quantity;
    });
    cartTotalAmount += 40;
    cartTotalAmount = cartTotalAmount.toFixed(2);
    // Save the cart item to the database
    await cartItem.save();

    res.json({ success: true, cartItem, cartTotalAmount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

//ROUTE: 2 - Buy Now the Product - POST "backend-gadgetbazaar/order/buy-now"
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


//ROUTE: 3 - Checkout Multiple Products - POST "backend-gadgetbazaar/order/checkout"
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

//ROUTE: 4 - Get cart items for the authenticated user - POST "backend-gadgetbazaar/order/getcart"
router.get('/getcart', fetchuser, async (req, res) => {
  const userId = req.user.id;

  try {
    const cartItems = await CartItem.find({ customer_id: userId })
      .populate('product_id')
      .exec();
    let cartTotalAmount = 0.0;
    cartItems.forEach(item => {
      cartTotalAmount += item.product_id.price * item.quantity;
    });
    cartTotalAmount += 40;
    cartTotalAmount = cartTotalAmount.toFixed(2);
    res.json({cartItems, cartTotalAmount});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//ROUTE: 5 - Update cart items for the given product for authenticated user - PATCH "backend-gadgetbazaar/order/updatecart"
router.patch('/updatecart', fetchuser, async (req, res) => {
  const { productId, quantity, shipping_charge, item_total } = req.body;
  const userId = req.user.id; // the user ID is stored in the JWT
  
  try {
    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if the cart item already exists
    let cartItem = await CartItem.findOne({
      product_id: productId,
      customer_id: userId
    });
    
    if (cartItem) {
      // Update the quantity of the existing cart item
      if(shipping_charge)
        cartItem.shipping_charge = shipping_charge;
      if(item_total)
        cartItem.item_total = item_total;
      if(quantity)
        cartItem.quantity = quantity;
      await cartItem.save();
    } else {
      // Create a new cart item
      let qty = 0;
      let ship_charge = 0;
      let total = 0;
      if(quantity)
        qty = quantity;
      if(shipping_charge)
        ship_charge = shipping_charge;
      if(item_total)
        total = item_total;

      cartItem = new CartItem({
        product_id: productId,
        customer_id: userId,
        quantity: quantity,
        shipping_charge: ship_charge,
        item_total: total
      });
      await cartItem.save();
    }
    let cartTotalAmount = await CartItem.aggregate([
      {
        $match: { customer_id: userId }
      },
      {
        $group: {
          _id: null,
          totalPrice: { $sum: { $add: ["$item_total", "$shipping_charge"] } }
        }
      }
    ]);
    cartTotalAmount = parseFloat(cartTotalAmount).toFixed(2);
    return res.json({ message: 'Cart updated successfully', cartTotalAmount });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

//ROUTE: 6 - Delete product from cart for authenticated user - DELETE "backend-gadgetbazaar/order/cart/removeproduct"
router.delete('/cart/removeproduct', fetchuser,async (req, res) => {
  try {
    const currentUser = req.user; // assuming the user is authenticated and their information is stored in req.user
    const productId = req.body.product_id;
    const cartItems = await CartItem.deleteMany({ product_id: productId, customer_id: currentUser.id });
    if (cartItems.deletedCount === 0) {
      return res.status(404).json({ message: 'No cart items found containing this product' });
    }
    res.json({ message: 'Cart items removed successfully', deletedCount: cartItems.deletedCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

//ROUTE: 7 - Get Shipping Methods - GET "backend-gadgetbazaar/order/shipping/methods/show"
router.get('/shipping/methods/show', async (req, res) => {
  try {
    const shippingMethod = await ShippingMethod.find();
    res.json(shippingMethod);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

//ROUTE: 7 - Add Shipping Methods - POST "backend-gadgetbazaar/order/shipping/methods/add"
router.post('/shipping/methods/add', async (req, res) => {
  try {
    const { shipping_method, status } = req.body;

    // create a new shipping method document
    const newShippingMethod = new ShippingMethod({
      shipping_method,
      status,
    });

    // save the new shipping method to the database
    await newShippingMethod.save();

    // send a success response
    res.status(201).json({ message: 'Shipping method created successfully.' });
  } catch (error) {
    // send an error response
    res.status(500).json({ error: error.message });
  }
});

//ROUTE: 8 - Get Saved Addresses - GET "backend-gadgetbazaar/order/address/getsaved"
router.get('/address/getsaved', async (req, res) => {
  try {
    const userId = req.user._id;
    const addresses = await Address.find({ userId: userId });
    res.status(200).json(addresses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
