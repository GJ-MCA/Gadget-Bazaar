const mongoose = require('mongoose');

const productSaleSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  date: {
    type: Number,
    required: true,
  },
  month: {
    type: Number,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  quantitySold: {
    type: Number,
    required: true
  },
  total_sale: {
    type: Number,
    get: function(value) {
      return value.toFixed(2);
    },
    set: function(value) {
      return parseFloat(value);
    }
  },
});

const ProductSale = mongoose.model('ProductSale', productSaleSchema);

module.exports = ProductSale;
