const express = require('express');
const router = express.Router();
const {body, validationResult} = require('express-validator');
const User = require('../../models/User');
const fetchuser = require('../../middleware/fetchuser');
const Product = require('../../models/Product');

//ROUTE: 1 - Add a Product - POST "gadgetbazaar/admin/products/add"
router.post('/add',[
    body('name','Enter At Least 5 Characters').isLength({min: 5}),
    body('name','Please Enter a Unique Name!').exists(),
    body('desc','Enter At Least 20 Characters').isLength({min: 20}),
    body('sku','Please Enter a Unique SKU!').exists(),
], async (req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try{
        //Add a product
        let product = await Product.create({
            name: req.body.name,
            desc: req.body.desc,
            sku: req.body.sku,
            category: req.body.category,
            price: req.body.price,
        });
        

        res.json({"success":"Product Created Successfully", "product": product});
    }
    catch(error){
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
    
})

module.exports = router;