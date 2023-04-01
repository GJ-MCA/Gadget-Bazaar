const config = require("../config/config");
const fetchCartItems = async (token) => {
    try {
      const response = await fetch(`${config.orderAPIUrl}/getcart`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': `Bearer ${token}`
        },
      });
      const data = await response.json();
      return data;
    } catch (err) {
      console.error(err.message);
    }
  };
  
  export const updateCart = async (token, productId, newQuantity, setCartItems, setCartCount, totalQty) => {
    try {
      await fetch(`${config.orderAPIUrl}/updatecart`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': `Bearer ${token}`
        },
        body: JSON.stringify({productId: productId, quantity: newQuantity })
      });
  
      const response = await fetch(`${config.orderAPIUrl}/getcart`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': `Bearer ${token}`
        },
      });
      const data = await response.json();
      setCartItems(data);
      setCartCount(totalQty);
    } catch (err) {
      console.error(err.message);
    }
  }

  export const deleteCartItem = async (token, productId) => {
    try {
      const response = await fetch(`${config.orderAPIUrl}/cart/removeproduct`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': `Bearer ${token}`
        },
        body: JSON.stringify({ product_id: productId })
      });
      const data = await response.json();
      console.log(data); // log the response data to the console
    } catch (error) {
      console.error(error);
    }
  };
  export default fetchCartItems;
  