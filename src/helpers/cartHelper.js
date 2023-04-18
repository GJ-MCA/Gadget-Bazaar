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
export const fetchSavedAddresses = async (token) => {
    try {
      const response = await fetch(`${config.orderAPIUrl}/address/getsaved`, {
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

  
  
  export const updateCart = async (token, productId, newQuantity, setCartItems, setCartCount, totalQty, shippingCharge = null, cartTotal = null, setCartFinalTotal) => {
    try {
      await fetch(`${config.orderAPIUrl}/updatecart`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': `Bearer ${token}`
        },
        body: JSON.stringify({productId: productId, quantity: newQuantity, shipping_charge: shippingCharge, cart_total: cartTotal })
      });
  
      const response = await fetch(`${config.orderAPIUrl}/getcart`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': `Bearer ${token}`
        },
      });
      const data = await response.json();
      setCartItems(data['cartItems']);
      setCartCount(totalQty);
      setCartFinalTotal(data['cartTotalAmount']);
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
      console.log(data)
    } catch (error) {
      console.error(error);
    }
  };
  export default fetchCartItems;
  