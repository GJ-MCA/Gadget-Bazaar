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
const Promotion = require("../../models/Promotion");
const promoUpload = multer();
//ROUTE: 1 - Get Dashboard Counts - Admin - GET "backend-gadgetbazaar/admin/main/get-counts"
router.get('/get-counts', checkAdminUser, async (req, res) => {
    try {
      const customers = await User.countDocuments({ role: 'customer' });
      const products = await Product.countDocuments();
      const orders = await Order_Detail.find({ payment_status: 'paid' });
      console.log(orders)
      const totalSaleAmount = orders.reduce((total, order) => total + parseFloat(order.total), 0);
      res.json({ customers, products, totalSaleAmount });
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
//ROUTE: 5 - Add a Promotion - Admin - POST "backend-gadgetbazaar/admin/main/promotions/add"
router.post('/promotions/add',promoUpload.none(), [ body('promotion_name','Please Enter Promotion Name!').notEmpty(),
body('coupon_code','Please Enter Promotion Coupon Code!' ).notEmpty(),],async (req, res) => {
  try {
    const { name, description, is_active } = req.body;
    console.log(name, description, is_active)
    if (!name || !description) {
      return res.status(400).json({ errors: 'Please enter details properly' });
    }
    // Check if specification already exists with the same name and value
    const existingSpecification = await Specification.findOne({ name, value:description });
    if (existingSpecification) {
      return res.status(400).json({ errors: 'Specification already exists' });
    }

    const specification = new Specification({ name, value:description, is_active });
    const savedSpecification = await specification.save();
    res.json(savedSpecification);
  } catch (error) {
    res.status(500).send("Internal Server Error");
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
//ROUTE: 4 - Get a promotions from id - Admin - POST "backend-gadgetbazaar/admin/main/promotions/get/:id/"
router.get('/promotions/get/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const promotions = await Promotion.findById(id);
    if (!promotions) {
      return res.status(404).send("Promotion not found");
    }
    res.json(promotions);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});
//ROUTE: 4 - Edit a Specification - Admin - POST "backend-gadgetbazaar/admin/main/specifications/edit/:id"
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
  module.exports = router;