const express = require("express");
const router = express.Router();
const { body, validationResult, check } = require("express-validator");
const User = require("../../models/User");
const Product = require("../../models/Product");
const Order_Detail = require('../../models/Order_Detail');
const Order_Item = require('../../models/Order_Item');
const checkAdminUser = require("../../middleware/checkAdminUser");
const ProductSale = require("../../models/ProductSale");

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
  


  module.exports = router;