const config = require("../config/config");
  const fetchOrderById = async (token, order_id) => {
    try {
      const response = await fetch(`${config.orderAPIUrl}/getorder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': `Bearer ${token}`
        },
        body: JSON.stringify({order_id: order_id })
      });
      const data = await response.json();
      return data;
    } catch (err) {
      console.error(err.message);
    }
  };
  export const fetchAllOrdersForCurrentUser = async (token) => {
    try {
      const response = await fetch(`${config.orderAPIUrl}/getallorders`, {
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
 export const fetchOrderByReferenceCode = async (token, order_reference_code) => {
    try {
      const response = await fetch(`${config.orderAPIUrl}/getorderbyreferencecode`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': `Bearer ${token}`
        },
        body: JSON.stringify({order_reference_code: order_reference_code })
      });
      const data = await response.json();
      return data;
    } catch (err) {
      console.error(err.message);
    }
  };
  export default fetchOrderById;