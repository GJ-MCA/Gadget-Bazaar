import React, { useEffect, useState } from 'react';
import fetchOrderById from '../../helpers/orderHelper';
export const PaymentSuccess = () => {
  const [referenceCode, setReferenceCode] = useState('');
  const token = localStorage.getItem('auth-token');
  const userOrder = JSON.parse(localStorage.getItem('user_order'));
  useEffect(() => {
    if(userOrder){
      fetchOrderById(token, userOrder.orderId).then(data => setReferenceCode(data.order_reference_code));
      
    }
  }, [userOrder]);

  return (
    <div className='container payment-success-container'>
      <div className='payment-success-image-container'>
        <img src='/assets/img/payment_success.png' alt='Payment Success' />
      </div>
      <div className='payment-success-message-container'>
        <h2>Payment Successful!</h2>
        <p>Your order has been placed successfully.</p>
        {referenceCode && <p>Your order id is: {referenceCode}</p>}
      </div>
    </div>
  );
};
