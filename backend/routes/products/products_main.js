const mongoose = require('mongoose');
const express = require("express");
const router = express.Router();
const Product = require("../../models/Product")
const Specification = require("../../models/Specification");
const Category = require('../../models/Category');
const Product_Review = require('../../models/Product_Review');
const fetchuser = require('../../middleware/fetchuser');
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
    const product = await Product.find({ sku: { $regex: `^${req.params.sku}$`, $options: 'i' } }).exec();
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
    const keyword = req.query.q;
    const categories = await Category.find(
      { name: { $regex: keyword, $options: 'i' } }
    );
    let products = await Product.find({
      $or: [
        { name: { $regex: keyword, $options: 'i' } },
        { sku: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { category: { $in: categories.map(category => category._id) } }
      ]
    });

    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
//ROUTE: 4 - Get a Specification from id - GET "backend-gadgetbazaar/products/specifications/get/:id/"
router.get('/specifications/get/:id', async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id)
    const specification = await Specification.findById(id);
    console.log(specification)
    if (!specification) {
      return res.status(404).send("Specification not found");
    }
    res.json(specification);
  } catch (error) {
    res.status(500).send("Internal Server Error: "+error);
  }
});
//ROUTE: 5 - Get All categories - GET "backend-gadgetbazaar/products/categories/showall"
router.get('/categories/showall', async (req, res) => {
  try {
    console.log("Showall Categories")
    const categories = await Category.find();
    console.log(categories)
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Unable to fetch all categories in products_main route' });
  }
});
//ROUTE: 5 - Get All products under category - GET "backend-gadgetbazaar/products/categories/:name"
router.get('/categories/:name', async (req, res) => {
  try {
    const category_products = await Category.find({name: { $regex:  req.params.name, $options: 'i' }}).exec();
    if (!category_products) {
      return res.status(404).json({ message: 'No Product not found in this category' });
    }
    console.log(category_products)
    if(category_products){
      const products = await Product.find({category: category_products}).exec();
      console.log(products)
      res.json(products);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Unable to fetch product by category' });
  }
});
//ROUTE: 6 - Get category by id - GET "backend-gadgetbazaar/products/categories/getbyid/:id"
router.get('/categories/getbyid/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'category not found' });
    }
    console.log(category)
    
    res.json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Unable to fetch category by id' });
  }
});
router.post('/reviews/add/:productId',fetchuser, async (req, res) => {
  try {
    const user_id = req.user.id;
    const productId = req.params.productId;
    const { name, rating, msg } = req.body;
    const product = await Product.findById(productId);

    const review = await new Product_Review({ product_id: product._id, user_id: user_id, name, rating, msg })
    .populate('user_id')
    .execPopulate();
    if(review){
      await review.save();
      return res.status(200).json({success: "Review Added Successfully, It will be visible after approval", review});
    }
    return res.status(200).json({errors: [{msg:"Unable to add review, please try again!"}]});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error: '+error });
  }
});
router.get('/reviews/get/:productId', async (req, res) => {
  try {
    const productId = req.params.productId;
    const product = await Product.findById(productId);

    const reviews = await Product_Review.find({product_id: product._id, is_approved: true}).populate('user_id')
    .exec();;
    console.log(productId)
    console.log(product)
    console.log(reviews)
    if(reviews && reviews.length > 0)
      return res.status(200).json({success: "Reviews found Successfully!", reviews});

    return res.status(200).json({errors: [{msg: "Reviews Not Found!"}]});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
module.exports = router;