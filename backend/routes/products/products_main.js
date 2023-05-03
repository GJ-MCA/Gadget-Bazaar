const express = require("express");
const router = express.Router();
const Product = require("../../models/Product")

//ROUTE: 1 - Get All Products - GET "backend-gadgetbazaar/products/showall"
router.get('/showall', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Unable to fetch all products in products_main route' });
  }
});

//ROUTE: 2 - Get a Single Product - GET "backend-gadgetbazaar/products/show/:sku"
router.get('/show/:sku', async (req, res) => {
  try {
    const product = await Product.find({sku: req.params.sku}).exec();
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Unable to fetch product by sku' });
  }
});

//ROUTE: 3 - Search Products - GET "backend-gadgetbazaar/products/search?q=query"
router.get('/search', async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({ message: 'Search query is missing' });
    }
    const products = await Product.find({
      $or: [
        { name: { $regex: new RegExp(query, 'i') } },
        { category: { $regex: new RegExp(query, 'i') } },
      ],
    });
    if (products.length === 0) {
      return res.status(404).json({ message: 'No products found' });
    }
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Unable to perform search' });
  }
});


module.exports = router;