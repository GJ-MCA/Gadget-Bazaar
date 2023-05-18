const express = require("express");
const router = express.Router();
const { body, validationResult, check } = require("express-validator");
const User = require("../../models/User");
const Product = require("../../models/Product");
const Order_Detail = require('../../models/Order_Detail');
const Order_Item = require('../../models/Order_Item');
const checkAdminUser = require("../../middleware/checkAdminUser");
const ProductSale = require("../../models/ProductSale");
const multer = require('multer');
const bcrypt = require('bcryptjs');
const Promotion = require("../../models/Promotion");
const Product_Review = require("../../models/Product_Review");
const { sendEmail } = require("../../services/emailService");
const promoUpload = multer();
const userUpload = multer();
const reviewUpload = multer();

//ROUTE: 1 - Get Dashboard Counts - Admin - GET "backend-gadgetbazaar/admin/main/get-counts"
router.get('/get-counts', checkAdminUser, async (req, res) => {
    try {
      const customers = await User.countDocuments({ role: 'customer' });
      const products = await Product.countDocuments();
      const orders = await Order_Detail.find({ payment_status: 'paid' });
      const reviews = await Product_Review.countDocuments();
      console.log(orders)
      const totalSaleAmount = orders.reduce((total, order) => total + parseFloat(order.total), 0);
      res.json({ customers, products,orders, totalSaleAmount, reviews });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Internal Server Error');
    }
});
//ROUTE: 2 - Generate Sales Report - Admin - GET "backend-gadgetbazaar/admin/main/sales-report"
router.get('/sales-report', async (req, res) => {
    const { fromDate, toDate } = req.query;
    try {
      const salesReport = await ProductSale.aggregate([
        {
          $match: {
            year: { $gte: parseInt(fromDate.split('-')[0]), $lte: parseInt(toDate.split('-')[0]) },
            month: { $gte: parseInt(fromDate.split('-')[1]), $lte: parseInt(toDate.split('-')[1]) },
            date: { $gte: parseInt(fromDate.split('-')[2]), $lte: parseInt(toDate.split('-')[2]) }
          }
        },
        {
          $group: {
            _id: {
              year: "$year",
              month: "$month",
              date: "$date"
            },
            sales: { $sum: "$total_sale" },
            quantity: { $sum: "$quantitySold" }
          }
        },
        {
          $sort: {
            "_id.year": 1,
            "_id.month": 1,
            "_id.date": 1
          }
        }
      ]);
  
      return res.json({ data: salesReport });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server Error' });
    }
});
//ROUTE: 2 - Generate Sales Report - Admin - GET "backend-gadgetbazaar/admin/main/product-sales-report"
router.get('/product-sales-report', async (req, res) => {
  try {
    const fromDate = new Date(req.query.fromDate);
    const toDate = new Date(req.query.toDate);

    // Get the product sales within the specified date range
    const productSales = await ProductSale.find({
      date: { $gte: fromDate.getDate(), $lte: toDate.getDate() },
      month: { $gte: fromDate.getMonth() + 1, $lte: toDate.getMonth() + 1 },
      year: { $gte: fromDate.getFullYear(), $lte: toDate.getFullYear() }
    }).populate('productId');

    // Calculate the total sales and quantity sold for each product
    const reportData = {};
    productSales.forEach((sale) => {
      const product = sale.productId;
      const productId = product._id.toString();

      if (!reportData[productId]) {
        reportData[productId] = {
          productName: product.name,
          quantitySold: 0,
          totalSale: 0
        };
      }

      reportData[productId].quantitySold += sale.quantitySold;
      reportData[productId].totalSale += parseFloat(sale.total_sale);
      console.log(sale)
    });

    // Convert the report data object into an array
    const report = Object.keys(reportData).map((productId) => ({
      productId,
      productName: reportData[productId].productName,
      quantitySold: reportData[productId].quantitySold,
      totalSale: reportData[productId].totalSale.toFixed(2)
    }));
    console.log(report)
    res.json({ data: report });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
//ROUTE: 5 - Add a Promotion - Admin - POST "backend-gadgetbazaar/admin/main/promotions/add"
router.post('/promotions/add', promoUpload.none(), [
  body('promotion_name', 'Please enter Promotion Name!').notEmpty(),
  body('coupon_code', 'Please enter Coupon Code!').notEmpty(),
  body('discount', 'Please enter Discount Code!').notEmpty(),
  body('times_remaining', 'Please enter Times Remaining!').notEmpty(),
  body('expiry_date', 'Please enter Expiry Date Code!').notEmpty(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { promotion_name, discount, expiry_date, status } = req.body;
    let { coupon_code, times_remaining } = req.body;
    coupon_code = coupon_code.replace(/\s/g, '').toUpperCase(); // Remove spaces and convert to uppercase
    times_remaining = Math.round(parseInt(times_remaining))
    // Check if the coupon code contains only numbers and alphabets
    const isValidCouponCode = /^[A-Za-z0-9]+$/.test(coupon_code);

    if (!isValidCouponCode) {
      return res.status(400).json({ errors: [{msg:'Invalid coupon code'}] });
    }

    const existingPromotion = await Promotion.findOne({ coupon_code });
    if (existingPromotion) {
      return res.status(400).json({ errors: [{msg:'Promotion already exists with the same coupon code', success: false}]});
    }

    const newPromotion = new Promotion({
      promotion_name,
      coupon_code,
      discount,
      times_remaining,
      expiry_date,
      status,
    });

    const savedPromotion = await newPromotion.save();
    res.status(200).json({success: "Promotion added successfully",savedPromotion});
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error: '+error);
  }
});
//ROUTE: 4 - Get a promotions from id - Admin - POST "backend-gadgetbazaar/admin/main/promotions/get/:id/"
router.get('/promotions/get/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const promotion = await Promotion.findById(id);
    if (!promotion) {
      return res.status(404).send("Promotion not found");
    }
    res.json({promotion});
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});
//ROUTE: 4 - Edit Promotion - Admin - PUT "backend-gadgetbazaar/admin/main/promotions/edit/:id"
router.put('/promotions/edit/:id', promoUpload.none(), [
  body('promotion_name', 'Please enter Promotion Name!').notEmpty(),
  body('coupon_code', 'Please enter Coupon Code!').notEmpty(),
  body('discount', 'Please enter Discount Code!').notEmpty(),
  body('times_remaining', 'Please enter Times Remaining!').notEmpty(),
  body('expiry_date', 'Please enter Expiry Date Code!').notEmpty(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { promotion_name, discount, expiry_date, status } = req.body;
    let { coupon_code, times_remaining } = req.body;
    coupon_code = coupon_code.replace(/\s/g, '').toUpperCase(); // Remove spaces and convert to uppercase
    times_remaining = Math.round(parseInt(times_remaining))
    // Check if the coupon code contains only numbers and alphabets
    const isValidCouponCode = /^[A-Za-z0-9]+$/.test(coupon_code);

    if (!isValidCouponCode) {
      return res.status(400).json({ errors: [{msg:'Invalid coupon code'}] });
    }

    const existingPromotion = await Promotion.findOne({ coupon_code });
    if (!existingPromotion) {
      return res.status(400).json({ errors: [{msg:'Promotion not found', success: false}]});
    }
      existingPromotion.promotion_name = promotion_name
      existingPromotion.coupon_code = coupon_code
      existingPromotion.discount = discount
      existingPromotion.times_remaining = times_remaining
      existingPromotion.expiry_date = expiry_date
      existingPromotion.status = status
    

    const savedPromotion = await existingPromotion.save();
    res.status(200).json({success: "Promotion updated successfully",savedPromotion});
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error: '+error);
  }
});
//ROUTE: 11 - Get order status values the authenticated user - GET "backend-gadgetbazaar/admin/main/promotions/status/getallvalues"
router.get('/promotions/status/getallvalues', async (req, res) => {
  try {
    const promotionStatusOptions = Promotion.schema.paths['status'].enumValues;
    if (promotionStatusOptions) {
      
      return res.json({ message: "Promotion statuses found successfully", promotionStatusOptions, success: true });
    }
    else {
      return res.json({ message: "Promotion statuses not found!", success: false });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error: '+err, success: false });
  }
});
//ROUTE: 6 - Disable a Specification - Admin - POST "backend-gadgetbazaar/admin/main/specifications/disable/:id
router.put('/promotions/disable/:id', async (req, res) => {
  try {
    const specification = await Specification.findByIdAndUpdate(req.params.id, { is_active: false }, { new: true });
    if (!specification) {
      return res.status(404).send("Specification not found");
    }
    res.json(specification);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});
//ROUTE: 6 - Enable a Specification - Admin - POST "backend-gadgetbazaar/admin/main/specifications/enable/:id
router.put('/specifications/enable/:id', async (req, res) => {
  try {
    const specification = await Specification.findByIdAndUpdate(req.params.id, { is_active: true }, { new: true });
    if (!specification) {
      return res.status(404).send("Specification not found");
    }
    res.json(specification);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});
//ROUTE: 4 - Edit a Specification - Admin - PUT "backend-gadgetbazaar/admin/main/specifications/edit/:id"
router.put('/specifications/edit/:id', /*checkAdminUser,*/ async (req,res)=>{
  try{
    const {id} = req.params;

    const {name, value, is_active} = req.body;
    console.log(name, value, is_active)
    const specification = await Specification.findOne({_id: id});
    if(!specification){
      return res.status(400).send("Specification not found");
    }

    specification.name = name;
    specification.value = value;
    specification.is_active = is_active;

    const savedSpecification = await specification.save();
    res.json(savedSpecification);

  }catch(error){
    res.status(500).send("Internal Server Error: " + error);
  }
});
//ROUTE: 7 - Get all Specifications - Admin - POST "backend-gadgetbazaar/admin/main/promotions/getall
router.get('/promotions/getall', async (req, res) => {
  try {
    const promotions = await Promotion.find();
    res.json(promotions);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});
//ROUTE: 8 - Get active Specifications - Admin - POST "backend-gadgetbazaar/admin/main/specifications/getactive
router.get('/specifications/getactive', async (req, res) => {
  try {
    const specifications = await Specification.find({ is_active: true });
    res.json(specifications);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});
//ROUTE: 9 - Get not active Specifications - Admin - POST "backend-gadgetbazaar/admin/main/specifications/getnotactive
router.get('/specifications/getnotactive', async (req, res) => {
  try {
    const specifications = await Specification.find({ is_active: false});
    res.json(specifications);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});
//ROUTE: 10 - Get all Orders - Admin - POST "backend-gadgetbazaar/admin/main/orders/getall
router.get('/orders/getall', async (req, res) => {
  try {
    const orders = await Order_Detail.find().exec();
    if (orders) {
      const ordersWithItems = [];
      for (const order of orders) {
        const order_items = await Order_Item.find({ order_id: order._id })
          .populate('product_id')
          .exec();
        const itemsWithProduct = order_items.map(item => ({
          ...item.toObject(),
          product: item.product_id.toObject(),
          order_reference_code: order.order_reference_code
        }));
        const orderWithItems = {
          ...order.toObject(),
          items: itemsWithProduct
        };
        ordersWithItems.push(orderWithItems);
      }
      return res.json({ message: "Orders found successfully", orders: ordersWithItems, success: true });
    }
    else {
      return res.json({ message: "Orders not found!", success: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});
//ROUTE: 10 - Get an Order by referencecode - Admin - POST "backend-gadgetbazaar/admin/main/orders/getorderbyreferencecode
router.post('/orders/getorderbyreferencecode', async (req, res) => {
  try {
    
    const { order_reference_code } = req.body;
    console.log(order_reference_code)
    const order_details = await Order_Detail.findOne({ order_reference_code: order_reference_code});
    console.log(order_details)
    if (order_details) {
      const order_items = await Order_Item.find({ order_id: order_details._id })
        .populate('product_id')
        .populate({
          path: 'order_id',
          model: 'Order_Detail',
          select: 'order_reference_code'
        })
        .exec();
      const itemsWithProduct = order_items.map(item => ({
        ...item.toObject(),
        product: item.product_id.toObject(),
        order_reference_code: item.order_id.order_reference_code
      }));
      const orderWithItems = {
        ...order_details.toObject(),
        items: itemsWithProduct
      };
      return res.json({ message: "Order found successfully", order: orderWithItems, success: true });
    }
    else {
      return res.json({ message: "Order not found!", success: false });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error', success: false });
  }
});
//ROUTE: 11 - Get order status values the authenticated user - GET "backend-gadgetbazaar/admin/main/orders/status/getallvalues"
router.get('/orders/status/getallvalues', async (req, res) => {
  try {
    const orderStatusOptions = Order_Detail.schema.paths['order_status'].enumValues;
    if (orderStatusOptions) {
      
      return res.json({ message: "Order statuses found successfully", orderStatusOptions, success: true });
    }
    else {
      return res.json({ message: "Order statuses not found!", success: false });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error: '+err, success: false });
  }
});
//ROUTE: 12 - Update order status value the authenticated user - GET "backend-gadgetbazaar/admin/main/orders/status/update"
router.post('/orders/status/update', async (req, res) => {
  try {
    const {order_id, order_status} = req.body;
    const order_details = await Order_Detail.findById(order_id);
    if (order_details) {
        order_details.order_status = order_status;
       await order_details.save();
      return res.json({ message: "Order status updated successfully", success: true });
    }
    else {
      return res.json({ message: "Order status can not be updated!", success: false });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error: '+err, success: false });
  }
});
//ROUTE: 4 - Get user from id - Admin - POST "backend-gadgetbazaar/admin/main/users/get/:id/"
router.get('/users/get/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.json(user);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});
//ROUTE: 4 - Edit User - Admin - PUT "backend-gadgetbazaar/admin/main/users/edit/:id"
router.put('/users/edit/:id',userUpload.none(),[
  body('name').isLength({ min: 3 }).withMessage('Name must have at least 3 characters'),	
  body('email').isEmail().withMessage('Invalid email'),
], /*checkAdminUser,*/ async (req,res)=>{
  try{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {id} = req.params;

    const {name, email, contact, role, is_active} = req.body;
    const user = await User.findOne({_id: id});
    if(!user){
      return res.status(400).send("User not found");
    }

    user.name = name;
    user.email = email;
    user.contact = contact;
    user.role = role;
    user.is_active = is_active;

    const savedUser = await user.save();
    res.status(200).json({success: "User Updated Successfully", savedUser});

  }catch(error){
    res.status(500).send("Internal Server Error: " + error);
  }
});
//ROUTE: 4 - Add User - Admin - PUT "backend-gadgetbazaar/admin/main/users/add"

router.post('/users/add',userUpload.none(),[
  body('name').isLength({ min: 3 }).withMessage('Name must have at least 3 characters'),	
  body('email').isEmail().withMessage('Invalid email'),	
  body('password').isLength({ min: 6 }).withMessage('Password must have at least 6 characters')	
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$/)	
      .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
      body('name').notEmpty().withMessage('Please enter name'),
      body('email').notEmpty().withMessage('Please enter email'),
      body('password').notEmpty().withMessage('Please enter password'),
], /*checkAdminUser,*/ async (req,res)=>{
  try{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    let user = await User.findOne({email: req.body.email});
             
      if(user){
        return res.status(400).json({errors: [{msg:"Email already registered"}]})
      }
      const {name, email, contact, role, is_active} = req.body;
      const salt = await bcrypt.genSalt(10);
      const securedPass = await bcrypt.hash(req.body.password, salt);
      user = await User.create({
          name: name,
          email: email,
          password: securedPass,
          contact: contact || '',
          role: role,
          is_active: is_active
      });
      
    const savedUser = await user.save();
    res.status(200).json({success: "User Added Successfully", savedUser});

  }catch(error){
    res.status(500).send("Internal Server Error: " + error);
  }
});
//ROUTE: 7 - Get all Specifications - Admin - POST "backend-gadgetbazaar/admin/main/users/getall
router.get('/users/getall', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});
//ROUTE: 11 - Get order status values the authenticated user - GET "backend-gadgetbazaar/admin/main/orders/role/getallvalues"
router.get('/users/role/getallvalues', async (req, res) => {
  try {
    const userRolesOptions = User.schema.paths['role'].enumValues;
    if (userRolesOptions) {
      
      return res.json({ message: "User roles found successfully", userRolesOptions, success: true });
    }
    else {
      return res.json({ message: "User roles not found!", success: false });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error: '+err, success: false });
  }
});
//ROUTE: 7 - Get all product reviews - Admin - POST "backend-gadgetbazaar/admin/main/product-reviews/getall
router.get('/product-reviews/getall', async (req, res) => {
  try {
    // Logic to fetch all reviews from the database
    const reviews = await Product_Review.find().populate("product_id").populate("user_id").exec();
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});
//ROUTE: 4 - Get product review from id - Admin - POST "backend-gadgetbazaar/admin/main/product-reviews/get/:id/"
router.get('/product-reviews/get/:id', async (req, res) => {
  const reviewId = req.params.id;

  try {
    // Find the product review by its ID
    const review = await Product_Review.findById(reviewId).populate('user_id').populate('product_id').exec();

    if (!review) {
      return res.status(404).json({ error: 'Product review not found' });
    }

    res.json(review);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product review' });
  }
});

//ROUTE: 4 - Edit Product Review - Admin - PUT "backend-gadgetbazaar/admin/main/product-reviews/edit/:id"
router.put('/product-reviews/edit/:id',reviewUpload.none(), async (req, res) => {
  const reviewId = req.params.id;
  const { product_id, user_id, msg, rating, is_approved } = req.body;

  try {
    // Logic to find the review by ID and update its fields
    const review = await Product_Review.findById(reviewId);
    
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    // Update the review fields
    review.product_id = product_id || review.product_id;
    review.user_id = user_id || review.user_id;
    review.msg = msg || review.msg;
    review.rating = rating || review.rating;
    console.log(review.is_approved)
    review.is_approved = is_approved;
    console.log(review.is_approved)

    // Save the updated review
    const updatedReview = await review.save();
    res.status(200).json({success: "Product Review Updated Successfully", updatedReview});
  } catch (error) {
    res.status(500).json({ error: 'Failed to update review' });
  }
});
// ROUTE: 7 - Get Admin User Profile - GET "/backend-gadgetbazaar/admin/main/getprofile" Login Required
router.get('/getprofile',checkAdminUser,  async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('-password');
    if (!user) {
      res.status(404).send('User not found');
    } else {
      res.status(200).json(user);
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
});

// ROUTE: 8 - Update User Profile - PUT "/backend-gadgetbazaar/admin/main/updateprofile" Login Required
router.put('/updateprofile',checkAdminUser, [
  body('name').isLength({ min: 3 }).withMessage('Name must have at least 3 characters'),	
  body('email').isEmail().withMessage('Invalid email'),	
  body('password').optional({ checkFalsy: true }).isLength({ min: 6 }).withMessage('Password must have at least 6 characters')	
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$/)	
      .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  body('contact').optional({ checkFalsy: true }).isMobilePhone('en-IN').withMessage('Invalid contact number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const userId = req.user.id;
    const { name, email, password, contact } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).send('User not found');
    } else {
      user.name = name || user.name;
      user.email = email || user.email;
      if (password) {
        const salt = await bcrypt.genSalt(10);
        const securedPass = await bcrypt.hash(req.body.password, salt);
        user.password = securedPass;
      }
      user.contact = contact || user.contact;
      const updatedUser = await user.save();
      if(password){
        const name = req.user.name; // Get the user's name from the authenticated user object
        const email = req.user.email; // Get the user's email from the authenticated user object
        const subject = 'Password Changed'; // Email subject
        const html = `
          <p>Your password has been successfully changed.</p>
          <p>If you did not initiate this change, please contact us immediately.</p>
          <p>Thank you for using our services!</p>
        `;

        try {
          await sendEmail(name, email, subject, html); // Send the email
          console.log(`Password changed email sent to ${email}`);
        } catch (error) {
          console.error(`Error sending password changed email to ${email}: ${error.message}`);
        }
      }
      res.status(200).json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        contact: updatedUser.contact,
        success: "Profile updated successfully"
      });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
});
  module.exports = router;