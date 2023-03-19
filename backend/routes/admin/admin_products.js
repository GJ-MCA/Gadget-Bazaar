const express = require("express");
const router = express.Router();
const { body, validationResult, check } = require("express-validator");
const User = require("../../models/User");
const Product = require("../../models/Product");
const AdminUser = require("../../models/Admin_User")
const multer = require('multer');
const checkAdminUser = require("../../middleware/checkAdminUser");

// Define storage for uploaded images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/assets/img/products');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Initialize multer
const upload = multer({ storage: storage });

//ROUTE: 1 - Add a Product - Admin - POST "gadgetbazaar/admin/products/add"
router.post('/add', upload.single('image'),/* checkAdminUser, */[
  body('name','Enter at least 5 characters').custom(value => {
    if(value.length < 5){
        throw new Error('Name must be at least 5 characters long');
    }
    return true;
  }),
  body('description','Enter at least 20 characters' ).isLength({min: 20}),
  body('sku').custom(async (value) => {
    const product = await Product.findOne({ sku: value });
    if (product) {
      return Promise.reject('SKU already exists');
    }
  }),
  body('price').isNumeric(),
], async (req,res)=>{
  try{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("Found Validation Errors");
      console.log(errors)
      console.log(errors.array())
      if(req.file){
        return res.status(400).json({ errors: errors.array() });
      }else{
        console.log("No File")
        return res.status(400).json({ errors: {error: errors.array(), "Image": "Please Upload Image"} });
      }
    }
    const {name, description, sku, price} = req.body;

    const product = new Product({
      name, description, sku, price
    });
    // Set the image URL if an image was uploaded
    if (req.file) {
      product.image = req.file.path.replace('public', '');
    }
    console.log("Product Saved")
    const savedProduct = await product.save();
    console.log(savedProduct)
    res.json(savedProduct);

  }catch(error){
    console.log(error.message);
    console.log("Error While Saving Product")
    res.status(500).send("Internal Server Error");
  }
})

//ROUTE: 2 - Update a Product - Admin - PUT "gadgetbazaar/admin/products/update/:id"
router.put('/:id', upload.single('image'),checkAdminUser,[
  body('name','Enter at least 5 characters').custom(value => {
    if(value.length < 5){
        throw new Error('Name must be at least 5 characters long');
    }
    return true;
  }),
  body('description','Enter at least 20 characters' ).isLength({min: 20}),], async (req,res)=>{
  try{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("Found Validation Errors");
      console.log(errors)
      console.log(errors.array())
      if(req.file){
        return res.status(400).json({ errors: errors.array() });
      }else{
        console.log("No File")
        return res.status(400).json({ errors: {error: errors.array(), "Image": "Please Upload Image"} });
      }
    }

    const {name, description, sku, price} = req.body;

    // Check if the product exists
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
  // Check if the user is an admin
    const adminUser = await AdminUser.findOne({ email: req.user.email });
    if (!adminUser) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Update the product
    product.name = name;
    product.description = description;
    product.sku = sku;
    product.price = price;
    if (req.file) {
      product.image = req.file.path.replace('public', '');
    }
    const savedProduct = await product.save();
    res.json(savedProduct);

  }catch(error){
    console.log(error.message);
    console.log("Error While Saving Product")
    res.status(500).send("Internal Server Error");
  }
})

//ROUTE: 3 - Disable a Product - Admin - PUT "gadgetbazaar/admin/products/disable/:id"
router.put('/:id/disable', checkAdminUser, async (req,res)=>{
  try{
    // Check if the product exists
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Disable the product
    product.status = false;
    const savedProduct = await product.save();
    res.json(savedProduct);
  }catch(error){
    console.log(error.message);
    console.log("Error While Disabling Product")
    res.status(500).send("Internal Server Error");
  }
})

//ROUTE: 4 - Enable a Product - Admin - PUT "gadgetbazaar/admin/products/enable/:id"
router.put('/:id/enable', checkAdminUser, async (req,res)=>{
  try{
    // Check if the product exists
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Enable the product
    product.status = true;
    const savedProduct = await product.save();
    res.json(savedProduct);
  }catch(error){
    console.log(error.message);
    console.log("Error While Enabling Product")
    res.status(500).send("Internal Server Error");
  }
})

//ROUTE: 4 - Delete a Product - Admin - DELETE "gadgetbazaar/admin/products/delete/:id"
router.delete('/:id', checkAdminUser, async (req,res)=>{
  try{
    // Check if the product exists
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
  
    // Delete the product
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    
    // If the product was not deleted for some reason
    if (!deletedProduct) {
      return res.status(500).json({ message: 'Unable to delete product' });
    }
    
    res.json({ message: 'Product deleted successfully' });

  }catch(error){
    console.log(error.message);
    console.log("Error While Deleting Product")
    res.status(500).send("Internal Server Error");
  }
})


module.exports = router;