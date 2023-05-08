import React, { useEffect, useState } from 'react';
import fetchOrderById from '../../helpers/orderHelper';
import { clearCart } from '../../helpers/cartHelper';
import { myOrdersPreUrl } from '../../config/config';
import { updateLoader } from '../../helpers/generalHelper';
export const PaymentSuccess = () => {
  const [referenceCode, setReferenceCode] = useState('');
  const token = localStorage.getItem('auth-token');
  const userOrder = JSON.parse(localStorage.getItem('user_order'));
  useEffect(() => {
    const fetchData = async () => {
      try {
        updateLoader(true);
        if(userOrder){
          const data = await fetchOrderById(token, userOrder.orderId);
          console.log(data.order_details[0].order_reference_code)
          setReferenceCode(data.order_details[0].order_reference_code);
          await clearCart(token);
          if (localStorage.getItem("user_order"))
            localStorage.removeItem("user_order");
          }
          updateLoader(false)
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, [userOrder]);

  return (
    <div className='container payment-success-container'>
      <div className='payment-success-image-container'>
        <img src='/assets/img/payment_success.png' alt='Payment Success' />
      </div>
      <div className='payment-success-message-container'>
        <h2>Payment Successful!</h2>
        <p>Your order has been placed successfully.</p>
        {referenceCode && <p>Your order id is: <a href={myOrdersPreUrl + referenceCode}>{referenceCode}</a></p>}
      </div>
    </div>
  );
};
