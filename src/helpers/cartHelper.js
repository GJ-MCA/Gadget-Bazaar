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
      console.log(err.message);
    }
  };
  export const updateCart = async (token, productId, newQuantity, setCartItems, setCartCount, totalQty, shippingCharge = null, cartTotal = null, setCartFinalTotal) => {
    try {
      const updateCartResponse = await fetch(`${config.orderAPIUrl}/updatecart`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': `Bearer ${token}`
        },
        body: JSON.stringify({productId: productId, quantity: newQuantity, shipping_charge: shippingCharge, cart_total: cartTotal })
      });
      const updateCartData = await updateCartResponse.json();
      if(updateCartData){
        console.log(updateCartData)
        if(updateCartData.errcode){
          if(updateCartData.errcode === "OUTOFSTOCK"){
            console.log("Outofstock")
            return updateCartData;
          }
        }
      }
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
      return true;
    } catch (err) {
      console.error(err.message);
    }
  }
  export const updateCartPrice = async (token, items) => {
    try {
      const updateCartPriceResponse = await fetch(`${config.orderAPIUrl}/updatecartprice`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': `Bearer ${token}`
        },
        body: JSON.stringify({items})
      });
      if(!updateCartPriceResponse.ok){
        throw new Error('Network response was not ok in update cart price');
      }
      return true;
    } catch (err) {
      console.error(err.message);
    }
  }
  export const updateCouponCart = async (token, coupon_code, discounted_total) => {
    console.log("dtotal"+discounted_total)
    try {
      await fetch(`${config.orderAPIUrl}/cart/update-coupon`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': `Bearer ${token}`
        },
        body: JSON.stringify({coupon_code,discounted_total})
      });
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

  export const clearCart = async (token) => {
    try {
      const response = await fetch(`${config.orderAPIUrl}/cart/clear`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (!response.ok) {
        return data.error;
      }
    } catch (err) {
      console.error(err);
    }
  };

  export const applyCouponCode = async (token, couponCode)=>{
    try {
      const response = await fetch(`${config.orderAPIUrl}/validate-coupon?code=${couponCode}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': `Bearer ${token}`
        },
      });
      const data = await response.json();
      console.log(response)
      console.log(data)
      if(!response.ok){
        data["status"] = 500;
        console.log(data)
        return data;
      }
      data["status"] = 200;
      console.log(data);
      return data;
    } catch (err) {
      console.log(err);
    }
  }
  export const fetchCouponFromId = async (token, coupon_id) => {
    try {
      const response = await fetch(`${config.orderAPIUrl}/coupon/get?code=${coupon_id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': `Bearer ${token}`
        },
      });
      if(response.ok){
        const data = await response.json();
        data["ok"] = true;
        return data;
      }else{
        const data = await response.json();
        data["ok"] = false;
        return data;
      }
    } catch (err) {
      console.error(err.message);
    }
  };
  export const removeCouponFromCartUsingCouponCode = async (token, coupon_code) => {
    console.log("couponcode: "+coupon_code)
    try {
      const response = await fetch(`${config.orderAPIUrl}/cart/coupon/remove`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': `Bearer ${token}`
        },
        body: JSON.stringify({coupon_code: coupon_code })
      });
      const data = await response.json();
      return data;
    } catch (err) {
      console.error(err.message);
    }
  };
  export const getShippingMethodById = async (shipping_method_id, token) => {
    try {
      const response = await fetch(`${config.orderAPIUrl}/shipping/get/${shipping_method_id}`,{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': `Bearer ${token}`
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  };
  export default fetchCartItems;
  