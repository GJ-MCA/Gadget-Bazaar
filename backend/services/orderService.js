const Order = require("../models/Order_Detail");

// Function to check if order reference ID already exists in the database
async function checkIfOrderRefIDExists(orderRefID) {
  const order = await Order.findOne({ order_reference_code: orderRefID });
  if (order) {
    return true;
  }
  return false;
}

module.exports = { checkIfOrderRefIDExists };
