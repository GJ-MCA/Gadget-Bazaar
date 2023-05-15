const express = require('express');
const multer = require('multer');
const fs = require('fs');
const { body, validationResult } = require('express-validator');
const Brand = require('../../models/Brand');
const Product = require('../../models/Product');
const Specification = require('../../models/Specification');
const Category = require('../../models/Category');
const checkAdminUser = require('../../middleware/checkAdminUser');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require("../../../src/config/config")
const User = require("../../models/User");
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
const specUpload = multer();
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

const categoryLogoStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = 'public/assets/img/categories';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const categoryLogoUpload = multer({ storage: categoryLogoStorage });


//ROUTE: 1 - Add a Product - Admin - POST "backend-gadgetbazaar/admin/products/add"
router.post('/add', productImageUpload.array('images'), /* checkAdminUser, */ [
  body('name', 'Enter at least 5 characters').custom(value => {
    if (value.length < 5) {
      throw new Error('Name must be at least 5 characters long');
    }
    return true;
  }),
  body('description', 'Enter at least 20 characters in product description').isLength({ min: 20 }),
  body('sku').custom(async (value) => {
    const product = await Product.findOne({ sku: value });
    if (product) {
      return Promise.reject('SKU already exists');
    }
  }).withMessage('SKU already exists'),
  body('name').custom(async (value) => {
    const product = await Product.findOne({ name: value });
    if (product) {
      return Promise.reject('Product with entered name already exists');
    }
  }).withMessage('Product with entered name already exists'),
  body('name').notEmpty().withMessage('Please enter product name'),
  body('description').notEmpty().withMessage('Please enter product description'),
  body('sku').notEmpty().withMessage('Please enter product sku'),
  body('category').notEmpty().withMessage('Please select product category'),
  body('price').isNumeric().withMessage('Please enter a valid value in product price'),
  body('brand').notEmpty().withMessage('Please select product brand'),
  body('quantity').notEmpty().withMessage('Please enter product quantity'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      if (req.files) {
        return res.status(400).json({ errors: errors.array() });
      } else {
        const my_errors = errors.array().concat({ msg: "Please Upload Images" });
        return res.status(400).json({ errors: my_errors });
      }
    }
    const {
      name,
      description,
      sku,
      category,
      brand,
      specification,
      price,
      quantity,
      token
    } = req.body;

    if (!token) {
      const my_errors = errors.array().concat({ msg: "Unauthorized: Please provide a valid token", status:"failed"  });
      return res.status(401).json(my_errors);
    }
    try {
      // Verify the token
      const decoded = jwt.verify(token, config.jwtSecret);
      // Check if the user is an admin
      const user = await User.findById(decoded.user.id);
      if (!user || user.role !== 'admin') {
        const my_errors = errors.array().concat({ msg: "Unauthorized: Only admins can access this resource", status:"failed"  });
        return res.status(401).json(my_errors);
      }
      // Set the user object in the request and proceed to the next middleware
      req.user = user;
    } catch (err) {
      const my_errors = errors.array().concat({ msg: "Unauthorized: Please provide a valid token", status:"failed"  });
      return res.status(401).json(my_errors);
    }
    const product = new Product({
      user_id:req.user.id,
      name,
      description,
      sku,
      category,
      brand,
      price,
      quantity,
      specification: [],
      images: []
    });

    // Set the image URLs if images were uploaded
    if (req.files) {
      req.files.forEach(file => {
        product.images.push(file.path.replace('public', ''));
      });
    }
    if(specification){
      let specificationObj = JSON.parse(specification); //convert object string to object
      if (specificationObj[0].specification !== '') { //if specification is available
        const specificationArray = specificationObj.map(specificationObject => specificationObject.specification); //create array of spec ids
        const specificationObjects = await Promise.all(
          specificationArray.map(specificationId => Specification.findById(specificationId)) //create array of spec objects
        );
        const specificationIds = specificationObjects.map(specificationObject => specificationObject._id); //get ids from objects and create an array of it
        if(specificationIds){
          specificationIds.forEach(specificationId => {
            if(!product.specification.includes(specificationId)){
              product.specification.push(specificationId); //push the id into product table if it's not already there
            }
          })
        }
      } else {
        product.specification = [];
        console.log("We are in condition false.....")
      }

    }

    // Save the updated Product instance
    const savedProduct = await product.save();

    return res.json({ success: 'Product added successfully', savedProduct });

  } catch (error) {
    res.status(500).send("Internal Server Error: " + error);
  }
});

//ROUTE: 2 - Edit a Product - Admin - PUT "backend-gadgetbazaar/admin/products/edit/:id"
router.put('/edit/:id', productImageUpload.array('images'), /* checkAdminUser, */ [
  body('name', 'Enter at least 5 characters').custom(value => {
    if (value.length < 5) {
      throw new Error('Name must be at least 5 characters long');
    }
    return true;
  }),
  body('description', 'Enter at least 20 characters in product description').isLength({ min: 20 }),
  body('sku').custom(async (value, { req }) => {
    const product = await Product.findOne({ sku: value, _id: { $ne: req.params.id } });
    if (product) {
      return Promise.reject('SKU already exists');
    }
  }).withMessage('SKU already exists'),
  body('name').custom(async (value, {req}) => {
    const product = await Product.findOne({ name: value, _id: { $ne: req.params.id } });
    if (product) {
      throw new Error('Product with entered name already exists');
    }
    return true;
}).withMessage('Product with entered name already exists'),
  body('name').notEmpty().withMessage('Please enter product name'),
  body('description').notEmpty().withMessage('Please enter product description'),
  body('sku').notEmpty().withMessage('Please enter product sku'),
  body('category').notEmpty().withMessage('Please select product category'),
  body('price').isNumeric().withMessage('Please enter a valid value in product price'),
  body('brand').notEmpty().withMessage('Please select product brand'),
  body('quantity').notEmpty().withMessage('Please enter product quantity'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    if (req.files) {
      return res.status(400).json({ errors: errors.array() });
    } else {
      const my_errors = errors.array().concat({ msg: "Please Upload Images" });
      return res.status(400).json({ errors: my_errors });
    }
  }

  const {
    name,
    description,
    sku,
    category,
    brand,
    specification,
    price,
    quantity
  } = req.body;

  const product = await Product.findById(req.params.id);
  if (!product) {
    const my_errors = errors.array().concat({ msg: "Product not found" });
    return res.status(404).json(my_errors);
  }

  product.name = name;
  product.description = description;
  product.sku = sku;
  product.category = category;
  product.brand = brand;
  product.price = price;
  product.quantity = quantity || 1;

  if (req.files && req.files.length > 0) {
    const images = req.files.map(file => {
      const path = file.destination.replace('public', ''); // remove 'public' from the path
      return `${path}/${file.filename}`; // create the relative path
    });
    product.images = images;
  }
  if(specification){
    let specificationObj = JSON.parse(specification); //convert object string to object
    if (specificationObj[0].specification !== '') { //if specification is available
      const specificationArray = specificationObj.map(specificationObject => specificationObject.specification); //create array of spec ids
      const specificationObjects = await Promise.all(
        specificationArray.map(specificationId => Specification.findById(specificationId)) //create array of spec objects
      );
      const specificationIds = specificationObjects.map(specificationObject => specificationObject._id); //get ids from objects and create an array of it
      if(specificationIds){
        product.specification.splice(0, product.specification.length); // empty the array
        specificationIds.forEach(specificationId => {
          if(!product.specification.includes(specificationId)){
            product.specification.push(specificationId); // push the id into product table if it's not already there
          }
        })
      }
      
    } else {
      product.specification = [];
      console.log("We are in condition false.....")
    }

  }
  await product.save();

  return res.json({ success: 'Product saved successfully', product });
});

// Disable a product - Admin - PUT "backend-gadgetbazaar/admin/products/disable/:id/"
router.put('/disable/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    product.is_active = false;
    const disabledProduct = await product.save();
    return res.status(200).json({ success: 'Product disabled successfully', disabledProduct });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

// Enable a product - Admin - PUT "backend-gadgetbazaar/admin/products/enable/:id/"
router.put('/enable/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, { is_active: true }, { new: true });
    if (!product) {
      return res.status(404).send("Product not found");
    }
    res.json(product);
    return res.status(200).json({ success: 'Product enabled successfully', product });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

// Get a product by ID - Admin - GET "backend-gadgetbazaar/admin/products/get/:id/"
router.get('/get/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findById(id).populate('specification');;
    if (!product) {
      return res.status(404).send("Product not found");
    }
    res.json(product);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

// Get all products - Admin - GET "backend-gadgetbazaar/admin/products/getall"
router.get('/getall', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

// Get active products - Admin - GET "backend-gadgetbazaar/admin/products/getactive"
router.get('/getactive', async (req, res) => {
  try {
    const products = await Product.find({ is_active: true });
    res.json(products);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

// Get not active products - Admin - GET "backend-gadgetbazaar/admin/products/getnotactive"
router.get('/getnotactive', async (req, res) => {
  try {
    const products = await Product.find({ is_active: false });
    res.json(products);
  } catch (error) {
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
router.post('/specifications/add',specUpload.none(), [ body('name','Please Enter Specification Name!').notEmpty(),
body('value','Please Enter Specification Value!' ).notEmpty(),],async (req, res) => {
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
//ROUTE: 4 - Get a Specification from id - Admin - POST "backend-gadgetbazaar/admin/products/specifications/get/:id/"
router.get('/specifications/get/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const specification = await Specification.findById(id);
    if (!specification) {
      return res.status(404).send("Specification not found");
    }
    res.json(specification);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});
//ROUTE: 4 - Edit a Specification - Admin - POST "backend-gadgetbazaar/admin/products/specifications/edit/:id"
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
//ROUTE: 9 -  Add a Category - Admin - POST "backend-gadgetbazaar/admin/products/category/add"
router.post('/category/add',categoryLogoUpload.single('image'), [ body('name','Enter Name').notEmpty(),
body('description','Enter at least 20 characters in description' ).isLength({min: 20}),
body('description','Description must be between 20 and 1000 characters long' ).isLength({max: 1000})], async (req, res) => {
  try {
    const { name, description, is_active } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      if (req.file) {
        return res.status(400).json({ errors: errors.array() });
      } else {
        const my_errors = errors.array().concat({ msg: "Please upload category image!" });
        return res.status(400).json({ errors: my_errors });
      }
    }
    const existingCategory = await Category.findOne({ name: { $regex: new RegExp('^' + name + '$', 'i') } });
    if (existingCategory) {
      return res.status(400).json({ errors: [{ msg: 'Category already exists' }] });
    }
    const category = new Category({ name, description, image:req.file.path.replace('public', ''), is_active });
    const newCategory = await category.save();
    return res.status(200).json({ message: 'Category added successfully' , newCategory});
  } catch (error) {
    res.status(500).json({ errors: [error.message] });
  }
});
//ROUTE: 3 - Disable a Category - Admin - POST "backend-gadgetbazaar/admin/products/category/disable/:id"
router.put('/category/disable/:id', async (req, res) => {
  try {
    const categoryId = req.params.id;
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    category.is_active = false;
    const disabledCategory = await category.save();
    res.json(disabledCategory);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});
//ROUTE: 4 - Enable a Category - Admin - POST "backend-gadgetbazaar/admin/products/category/enable/:id/"
router.put('/category/enable/:id', async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, { is_active: true }, { new: true });
    if (!category) {
      return res.status(404).send("category not found");
    }
    res.json(category);
  } catch (error) {
    res.status(500).send("Internal Server Error: " + error);
  }
});
//ROUTE: 4 - Get a category from id - Admin - POST "backend-gadgetbazaar/admin/products/category/get/:id/"
router.get('/category/get/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).send("Category not found");
    }
    res.json(category);
  } catch (error) {
    res.status(500).send("Internal Server Error: " + error);
  }
});
//ROUTE: 4 - Edit a category - Admin - POST "backend-gadgetbazaar/admin/products/category/edit/:id"
router.put('/category/edit/:id', categoryLogoUpload.single('image'), /*checkAdminUser,*/ async (req,res)=>{
  try{
    const {id} = req.params;

    const {name, description, is_active} = req.body;

    const category = await Category.findOne({_id: id});
    if(!category){
      return res.status(400).send("Category not found");
    }

    category.name = name;
    category.description = description;
    category.is_active = is_active;

    if(req.file){
      category.image = req.file.path.replace('public', '');
    }

    const savedCategory = await category.save();
    res.json(savedCategory);

  }catch(error){
    res.status(500).send("Internal Server Error");
  }
});
//ROUTE: 7 - Get all category - Admin - POST "backend-gadgetbazaar/admin/products/category/getall
router.get('/category/getall', async (req, res) => {
  try {
    const category = await Category.find();
    res.json(category);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});
//ROUTE: 8 - Get active category - Admin - POST "backend-gadgetbazaar/admin/products/category/getactive
router.get('/category/getactive', async (req, res) => {
  try {
    const category = await Category.find({ is_active: true });
    res.json(category);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});
//ROUTE: 9 - Get not active category - Admin - POST "backend-gadgetbazaar/admin/products/category/getnotactive
router.get('/category/getnotactive', async (req, res) => {
  try {
    const category = await Category.find({ is_active: false});
    res.json(category);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;