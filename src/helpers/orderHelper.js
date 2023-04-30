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

  export default fetchOrderById;