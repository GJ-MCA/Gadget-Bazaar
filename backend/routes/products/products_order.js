const express = require('express');
const fetchuser = require('../../middleware/fetchuser');
const router = express.Router();
const CartItem = require('../../models/Cart_Item');
const OrderDetails = require('../../models/Order_Detail');
const OrderItems = require('../../models/Order_Item');
const Product = require('../../models/Product');
const ShippingMethod = require('../../models/ShippingMethod');
const Address = require("../../models/Address");
const Promotion = require('../../models/Promotion');
const Cart_Item_Details = require('../../models/Cart_Item_Details');
const mongoose = require('mongoose');
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
    let cartItem = await CartItem.findOne({ customer_id: req.user.id, coupon_code: null });
    if (!cartItem) {
      // Create a new cart item
      cartItem = new CartItem({
        customer_id: req.user.id,
        shipping_charge: 40, // set shipping charge here
      });
      await cartItem.save();
    }

    // Create or update cart item details
    let cartItemDetail = await Cart_Item_Details.findOne({ product_id, cart_item_id: cartItem._id });
    if (!cartItemDetail) {
      // Create a new cart item detail
      cartItemDetail = new Cart_Item_Details({
        product_id,
        cart_item_id: cartItem._id,
        quantity: 1,
        item_total: product.price,
      });
    } else {
      // Update the cart item detail quantity and item total
      cartItemDetail.quantity += 1;
      cartItemDetail.item_total = cartItemDetail.quantity * product.price;
    }
    await cartItemDetail.save();

    // Calculate the cart item total and update it in the cart item
    const cartItemDetails = await Cart_Item_Details.find({ cart_item_id: cartItem._id });
    let cartTotalAmount = 0.0;
    cartItemDetails.forEach((item) => {
      cartTotalAmount += parseFloat(item.item_total);
    });
    cartTotalAmount += cartItem.shipping_charge;
    cartTotalAmount = parseFloat(cartTotalAmount).toFixed(2);
    cartItem.total = cartTotalAmount * 100;
    await cartItem.save();
    res.json({ success: true, cartItems: cartItemDetails, cartTotalAmount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});


//ROUTE: 2 - Buy Now the Product - POST "backend-gadgetbazaar/order/buy-now"
router.post('/buy-now', fetchuser, async (req, res) => {
  try {
    const { product_id, total, payment_id } = req.body;
    const orderDetails = new OrderDetails({ user_id: req.user.id, total, payment_id });
    const orderItem = new OrderItems({ order_id: orderDetails._id, product_id, quantity:1 });
    await Promise.all([orderDetails.save(), orderItem.save()]);
    res.json({ success: true, orderDetails, orderItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});


//ROUTE: 3 - Checkout Multiple Products - POST "backend-gadgetbazaar/order/checkout"
router.post('/checkout', fetchuser, async (req, res) => {
  try {
    let shipping_charge = 0;
    const { shipping_address, billing_address,shipping_method, items, total } = req.body;

    const user_id = req.user.id;
    if (!user_id || !items || !total || !shipping_address || !billing_address || !shipping_method) {
      return res.status(400).json({ success: false, error: 'Missing required fields.' });
    }
    if(shipping_method === "Default"){
      shipping_method = ShippingMethod.findOne({ shipping_method: "Standard" });
      shipping_charge = 40.00;
    }
    const orderDetails = new OrderDetails({ user_id, shipping_address, billing_address, shipping_method, shipping_charge });
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
    const cartItems = await CartItem.find({customer_id: userId});

    const cartItemDetails = await Cart_Item_Details.find({ cart_item_id: cartItems })
      .populate('product_id')
      .exec();
    let cartTotalAmount = 0.0;
    cartItemDetails.forEach(item => {
      cartTotalAmount += item.product_id.price * item.quantity;
    });
    cartTotalAmount += 40;
    cartTotalAmount = cartTotalAmount.toFixed(2);
    res.json({cartItems: cartItemDetails, cartTotalAmount, cart: cartItems});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//ROUTE: 5 - Update cart items for the given product for authenticated user - PATCH "backend-gadgetbazaar/order/updatecart"
router.patch('/updatecart', fetchuser, async (req, res) => {
  const { productId, quantity, shipping_charge } = req.body;
  const userId = req.user.id; // the user ID is stored in the JWT
  
  try {
    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if the cart item already exists
    let cartItem = await CartItem.findOne({
      customer_id: userId
    });
    let cartItemDetails = null;
    if (cartItem) {
      cartItemDetails = await Cart_Item_Details.findOne({
        cart_item_id: cartItem._id,
        product_id: productId
      });
      // Update the quantity of the existing cart item
      if(shipping_charge)
        cartItem.shipping_charge = shipping_charge;
      if(quantity)
        cartItemDetails.quantity = quantity;

      const product = await Product.findById(cartItemDetails.product_id).exec();
      cartItemDetails.item_total = (parseFloat(product.price) * quantity).toFixed(2);
    } else {
      // Create a new cart item
      let qty = 0;
      let ship_charge = 0;
      let total = 0;
      if(quantity)
        qty = quantity;
      if(shipping_charge)
        ship_charge = shipping_charge;
        const product = await Product.findById(cartItemDetails.product_id).exec();
        total = (parseFloat(product.price) * quantity).toFixed(2);

      cartItem = new CartItem({
        customer_id: userId,
        shipping_charge: ship_charge,
      });
      cartItemDetails = new Cart_Item_Details({
        cart_item_id: cartItem,
        product_id: productId,
        quantity: qty,
        item_total: total
      });

    }
    await cartItem.save();
    await cartItemDetails.save();
    console.log(userId)
    const cartTotalAmount = await Cart_Item_Details.aggregate([
      {
        $match: { cart_item_id: cartItem._id }
      },
      {
        $group: {
          _id: null,
          totalPrice: { $sum: "$item_total" }
        }
      }
    ]);
    let cartTotalAmountValue = null;
    if (cartTotalAmount && cartTotalAmount.length > 0 && cartTotalAmount[0].totalPrice) {
      cartTotalAmountValue = parseFloat(cartTotalAmount[0].totalPrice).toFixed(2);
      cartItem.total = cartTotalAmountValue;
      await cartItem.save();
    }
    return res.json({ message: 'Cart updated successfully', cartTotalAmountValue });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});
//ROUTE: 6 - Update coupon code related details in cart for authenticated user - PATCH "backend-gadgetbazaar/order/cart/update-coupon"
router.patch('/cart/update-coupon', fetchuser, async (req, res) => {
  const { coupon_code, discounted_total } = req.body;
  const userId = req.user.id;
  try {
    let cartItem = await CartItem.findOne({
      customer_id: userId
    });
    if (cartItem) {
      // Update the Cart_Item_Details record
      if (coupon_code && discounted_total) {
        const promotion = await Promotion.findOne({
          coupon_code: { $regex: new RegExp(coupon_code, "i") }
        });
        console.log(promotion);
        if (promotion) {
          cartItem.coupon_code = promotion._id;
          cartItem.discounted_total = discounted_total;
        }
      }
    }
    await cartItem.save();
    return res.json({ message: 'Cart coupon details updated successfully'});
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

//ROUTE: 7 - Delete product from cart for authenticated user - DELETE "backend-gadgetbazaar/order/cart/removeproduct"
router.delete('/cart/removeproduct', fetchuser ,async (req, res) => {
  try {
    const currentUser = req.user; // assuming the user is authenticated and their information is stored in req.user
    const productId = req.body.product_id;
    const cartItems = await CartItem.find({ customer_id: currentUser.id });
    const cartItemsDetails = await Cart_Item_Details.deleteMany({ product_id: productId, cart_item_id: cartItems });
    if (cartItemsDetails.deletedCount === 0) {
      return res.status(404).json({ message: 'No cart items found containing this product' });
    }
    res.json({ message: 'Cart items removed successfully', deletedCount: cartItemsDetails.deletedCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

//ROUTE: 8 - Clear the cart for authenticated user - DELETE "backend-gadgetbazaar/order/cart/clear"
router.delete('/cart/clear', fetchuser, async (req, res) => {
  try {
    const customer_id = req.user.id;

    // Delete all cart items for the given customer
    const cartItem = await CartItem.find({ customer_id });
    const cartItemDetails = await Cart_Item_Details.find({ cart_item_id: cartItem });

    await cartItemDetails.deleteMany({cart_item_id: cartItem});
    await cartItem.deleteMany({customer_id});

    return res.status(200).json({ message: 'Cart cleared successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

//ROUTE: 9 - Get Shipping Methods - GET "backend-gadgetbazaar/order/shipping/methods/show"
router.get('/shipping/methods/show', async (req, res) => {
  try {
    const shippingMethod = await ShippingMethod.find();
    res.json(shippingMethod);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

//ROUTE: 10 - Add Shipping Methods - POST "backend-gadgetbazaar/order/shipping/methods/add"
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

//ROUTE: 11 - Get Saved Addresses - GET "backend-gadgetbazaar/order/address/getsaved"
router.get('/address/getsaved', fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const addresses = await Address.find({ userId: userId });
    if (addresses.length === 0) {
      return res.status(200).json({ message: "No addresses found." });
    }
    return res.status(200).json(addresses);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

//ROUTE: 12 - Get Address From Id - GET "backend-gadgetbazaar/order/address/get/:id"
router.get('/address/get/:id', fetchuser, async (req, res) => {
  const { id } = req.params;
  
  try {
    const address = await Address.findById(id).populate('user_id');
    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }
    return res.json(address);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

//ROUTE: 13 - Save New Address - POST "backend-gadgetbazaar/order/address/add"
router.post('/address/add', fetchuser, async (req, res) => {
  try {
    const user_id = req.user.id;
    const { address_line_1, address_line_2, city, state, country, pincode, contact } = req.body;

    // Check if address already exists in the database
    const existingAddress = await Address.findOne({ 
      user_id,
      address_line_1,
      address_line_2,
      city,
      state,
      country,
      pincode,
      contact
    });

    if (existingAddress) {
      return res.status(200).json({ message: 'Address already exists', address_id: existingAddress });
    }

    // Create a new address record in the database
    let newAddress = new Address({ 
      user_id,
      address_line_1,
      address_line_2,
      city,
      state,
      country,
      pincode,
      contact
    });

    newAddress = await newAddress.save();

    return res.status(201).json({ message: 'Address saved successfully', address_id: newAddress });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

//ROUTE: 14 - Validate coupon code - GET "backend-gadgetbazaar/order/validate-coupon"
router.get('/validate-coupon', fetchuser, async (req, res) => {
  try {
    const couponCode = req.query.code;
    const promotion = await Promotion.findOne({
      coupon_code: { $regex: new RegExp(couponCode, "i") }
    });

    if (!promotion) {
      return res.status(400).json({ message: 'Invalid coupon code' });
    }

    if (promotion.status !== 'Active') {
      return res.status(400).json({ message: 'Coupon code is not active' });
    }

    if (promotion.expiry_date && promotion.expiry_date < new Date()) {
      return res.status(400).json({ message: 'Coupon code has expired' });
    }

    if (promotion.times_remaining !== null && promotion.times_used >= promotion.times_remaining) {
      return res.status(400).json({ message: 'Coupon code has already been used' });
    } else if (promotion.times_remaining === 1) {
      const updatedPromotion = await Promotion.findOneAndUpdate(
        { coupon_code: { $regex: new RegExp(couponCode, "i") } },
        { new: true }
      );
      res.json({ message: 'Coupon code is valid', promotion: updatedPromotion });
    } else {
      const updatedPromotion = await Promotion.findOneAndUpdate(
        { coupon_code: { $regex: new RegExp(couponCode, "i") } },
        { new: true }
      );
      res.json({ message: 'Coupon code is valid', promotion: updatedPromotion });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

//ROUTE: 15 - Get coupon code - GET "backend-gadgetbazaar/order/coupon/get"
router.get('/coupon/get', fetchuser, async (req, res) => {
  try {
    const coupon_id = req.query.code;
    const coupon_obj = mongoose.Types.ObjectId(coupon_id);
    try{
      const promotion = await Promotion.findOne({_id: coupon_obj}).exec();
      if(promotion)
        res.json({ message: 'Coupon code found', coupon_code: promotion, coupon_code_found: true }); 
      else  
        res.json({ message: 'Coupon code not found', coupon_code_found: false }); 
    }catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
