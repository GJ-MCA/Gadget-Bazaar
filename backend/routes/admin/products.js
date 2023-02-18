const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const User = require("../../models/User");
const fetchuser = require("../../middleware/fetchuser");
const Product = require("../../models/Product");
const multer = require("multer");
const path = require("path");

// Set up Multer middleware to handle file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

//ROUTE: 1 - Add a Product - POST "gadgetbazaar/admin/products/add"
router.post(
  "/add",
  [
    body("name", "Enter At Least 5 Characters").isLength({ min: 5 }),
    body("name", "Please Enter Your Name!").exists(),
    body("desc", "Enter At Least 20 Characters").isLength({ min: 20 }),
    body("sku", "Please Enter SKU!").exists(),
    body("price", "Please Enter Price!").exists(),
    body("image", "Please Upload an Image!").exists(),
  ],
  upload.single("image"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      //Add a product
    
    //Check whether the user with this email exists already
    let productSKU = await Product.findOne({sku: req.body.sku});
    let productName = await Product.findOne({name: req.body.name});
    if(productSKU && productName){
        return res.status(400).json({error: "Sorry, Product SKU and Product Name with This Details Already Exists, Please Enter a Unique Product Name and SKU"});
    }else if(productSKU){
        return res.status(400).json({error: "Sorry, Product SKU with the Same SKU Already Exists, Please Enter a Unique SKU"});
    }else if(productName){
        return res.status(400).json({error: "Sorry, Product Name with the Same Name Already Exists, Please Enter a Unique Name"});
    }

      const { name, desc, sku, category, price } = req.body;
      const imagePath = path.join("images", req.file.filename);
      let product = await Product.create({
        name,
        desc,
        sku,
        category,
        price,
        image: imagePath,
      });
      res.json({ success: "Product Created Successfully", product: product });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

module.exports = router;
