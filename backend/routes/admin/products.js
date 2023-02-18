const express = require("express");
const router = express.Router();
const { body, validationResult, check } = require("express-validator");
const User = require("../../models/User");
const fetchuser = require("../../middleware/fetchuser");
const Product = require("../../models/Product");

//ROUTE: 1 - Add a Product - Admin - POST "gadgetbazaar/admin/products/add"
router.post('/add',[
  body('name','Enter at least 5 characters').isLength({min: 5}),
  body('description','Enter at least 20 characters' ).isLength({min: 20}),
],fetchuser, async (req,res)=>{
  try{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {name, description, sku, price} = req.body;

    const product = new Product({
      name, description, sku, price
    })
    const savedProduct = await product.save();
    res.json(savedProduct);
  }catch(error){
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})

module.exports = router;