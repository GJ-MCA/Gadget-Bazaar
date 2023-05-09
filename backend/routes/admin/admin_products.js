const express = require('express');
const multer = require('multer');
const fs = require('fs');
const { body, validationResult } = require('express-validator');
const Brand = require('../../models/Brand');
const Product = require('../../models/Product');
const Specification = require('../../models/Specification');
const checkAdminUser = require('../../middleware/checkAdminUser');
const router = express.Router();
// Define storage for uploaded product images
const productImageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = 'public/assets/img/products';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const productImageUpload = multer({ storage: productImageStorage });

const brandLogoStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = 'public/assets/img/brands';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const brandLogoUpload = multer({ storage: brandLogoStorage });


//ROUTE: 1 - Add a Product - Admin - POST "backend-gadgetbazaar/admin/products/add"
router.post('/add', productImageUpload.array('images'),/* checkAdminUser, */[
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
      if(req.files){
        return res.status(400).json({ errors: errors.array() });
      }else{
        const my_errors = errors.array().concat({ msg: "Please Upload Images" });
        return res.status(400).json({ errors:my_errors });
      }
    }
    const {name, description, sku, price} = req.body;

    const product = new Product({
      name, description, sku, price, images: []
    });
    // Set the image URLs if images were uploaded
    if (req.files) {
      req.files.forEach(file => {
        product.images.push(file.path.replace('public', ''));
      });
    }
    const savedProduct = await product.save();
    res.json(savedProduct);

  }catch(error){
    res.status(500).send("Internal Server Error");
  }
});
//ROUTE: 2 - Add a Brand - Admin - POST "backend-gadgetbazaar/admin/products/brands/add"
router.post('/brands/add', brandLogoUpload.single('logo'), /*checkAdminUser,*/ [
  body('name','Enter Name').notEmpty(),
  body('description','Enter at least 50 characters in description' ).isLength({min: 50}),
], async (req,res)=>{
  try{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      if (req.file) {
        return res.status(400).json({ errors: errors.array() });
      } else {
        const my_errors = errors.array().concat({ msg: "Please upload a logo" });
        return res.status(400).json({ errors: my_errors });
      }
    }
    
    const {name, description, is_active} = req.body;
    console.log(name, description,is_active)
    // Check if the same data already exists
    const existingBrand = await Brand.findOne({ name: { $regex: new RegExp('^' + name + '$', 'i') } });
    if (existingBrand) {
      return res.status(400).json({ errors: [{ msg: 'Brand already exists' }] });
    }
    
    const brand = new Brand({
      name, description, logo: req.file.path.replace('public', ''), is_active
    });

    const savedBrand = await brand.save();
    return res.status(200).json({ message: 'Brand added successfully' , savedBrand});

  }catch(error){
    res.status(500).send("Internal Server Error: "+ error);
  }
});
//ROUTE: 3 - Disable a Brand - Admin - POST "backend-gadgetbazaar/admin/products/brands/disable/:id"
router.put('/brands/disable/:id', async (req, res) => {
  try {
    const brandId = req.params.id;
    const brand = await Brand.findById(brandId);
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }
    brand.is_active = false;
    const disabledBrand = await brand.save();
    res.json(disabledBrand);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});
//ROUTE: 4 - Enable a Brand - Admin - POST "backend-gadgetbazaar/admin/products/brands/enable/:id/"
router.put('/brands/enable/:id', async (req, res) => {
  try {
    const brand = await Brand.findByIdAndUpdate(req.params.id, { is_active: true }, { new: true });
    if (!brand) {
      return res.status(404).send("Brand not found");
    }
    res.json(brand);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});
//ROUTE: 4 - Get a Brand from id - Admin - POST "backend-gadgetbazaar/admin/products/brands/get/:id/"
router.get('/brands/get/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const brand = await Brand.findById(id);
    if (!brand) {
      return res.status(404).send("Brand not found");
    }
    res.json(brand);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});
//ROUTE: 4 - Edit a Brand - Admin - POST "backend-gadgetbazaar/admin/products/brands/edit/:id"
router.put('/brands/edit/:id', brandLogoUpload.single('logo'), /*checkAdminUser,*/ async (req,res)=>{
  try{
    const {id} = req.params;

    const {name, description, is_active} = req.body;

    const brand = await Brand.findOne({_id: id});
    if(!brand){
      return res.status(400).send("Brand not found");
    }

    brand.name = name;
    brand.description = description;
    brand.is_active = is_active;

    if(req.file){
      brand.logo = req.file.path.replace('public', '');
    }

    const savedBrand = await brand.save();
    res.json(savedBrand);

  }catch(error){
    res.status(500).send("Internal Server Error");
  }
});
//ROUTE: 7 - Get all brands - Admin - POST "backend-gadgetbazaar/admin/products/brands/getall
router.get('/brands/getall', async (req, res) => {
  try {
    const brands = await Brand.find();
    res.json(brands);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});
//ROUTE: 8 - Get active brands - Admin - POST "backend-gadgetbazaar/admin/products/brands/getactive
router.get('/brands/getactive', async (req, res) => {
  try {
    const brands = await Brand.find({ is_active: true });
    res.json(brands);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});
//ROUTE: 9 - Get not active brands - Admin - POST "backend-gadgetbazaar/admin/products/brands/getnotactive
router.get('/brands/getnotactive', async (req, res) => {
  try {
    const brands = await Brand.find({ is_active: false});
    res.json(brands);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});
//ROUTE: 5 - Add a Specification - Admin - POST "backend-gadgetbazaar/admin/products/specifications/add"
router.post('/specifications/add', [ body('name','Please Enter Specification Name!').exists(),
body('value','Please Enter Specification Value!' ).exists(),],async (req, res) => {
  try {
    const { name, value, is_active } = req.body;
    console.log(name, value, is_active)
    if (!name || !value) {
      return res.status(400).json({ errors: 'Please enter details properly' });
    }
    // Check if specification already exists with the same name and value
    const existingSpecification = await Specification.findOne({ name, value });
    if (existingSpecification) {
      return res.status(400).json({ errors: 'Specification already exists' });
    }

    const specification = new Specification({ name, value, is_active });
    const savedSpecification = await specification.save();
    res.json(savedSpecification);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});
//ROUTE: 6 - Disable a Specification - Admin - POST "backend-gadgetbazaar/admin/products/specifications/disable/:id
router.put('/specifications/disable/:id', async (req, res) => {
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
//ROUTE: 6 - Enable a Specification - Admin - POST "backend-gadgetbazaar/admin/products/specifications/enable/:id
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
//ROUTE: 7 - Get all Specifications - Admin - POST "backend-gadgetbazaar/admin/products/specifications/getall
router.get('/specifications/getall', async (req, res) => {
  try {
    const specifications = await Specification.find();
    res.json(specifications);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});
//ROUTE: 8 - Get active Specifications - Admin - POST "backend-gadgetbazaar/admin/products/specifications/getactive
router.get('/specifications/getactive', async (req, res) => {
  try {
    const specifications = await Specification.find({ is_active: true });
    res.json(specifications);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});
//ROUTE: 9 - Get not active Specifications - Admin - POST "backend-gadgetbazaar/admin/products/specifications/getnotactive
router.get('/specifications/getnotactive', async (req, res) => {
  try {
    const specifications = await Specification.find({ is_active: false});
    res.json(specifications);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});
//ROUTE: 2 - Update a Product - Admin - PUT "backend-gadgetbazaar/admin/products/update/:id"
router.put('/update/:id', productImageUpload.single('image'),checkAdminUser,[
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
      if(req.file){
        return res.status(400).json({ errors: errors.array() });
      }else{
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
    const user = await User.findOne({ email: req.user.email });
    if (!user) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (user.role !== 'admin') {
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
    res.status(500).send("Internal Server Error");
  }
})

//ROUTE: 3 - Disable a Product - Admin - PUT "backend-gadgetbazaar/admin/products/disable/:id"
router.put('/disable/:id', checkAdminUser, async (req,res)=>{
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
    res.status(500).send("Internal Server Error");
  }
})

//ROUTE: 4 - Enable a Product - Admin - PUT "backend-gadgetbazaar/admin/products/enable/:id"
router.put('/enable/:id', checkAdminUser, async (req,res)=>{
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
    res.status(500).send("Internal Server Error");
  }
})

//ROUTE: 5 - Delete a Product - Admin - DELETE "backend-gadgetbazaar/admin/products/delete/:id"
router.delete('/delete/:id', checkAdminUser, async (req,res)=>{
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
    res.status(500).send("Internal Server Error");
  }
})


module.exports = router;