import React from 'react';
import { Link } from 'react-router-dom';
export const PaymentFailed = () => {
  return (
    <div className='container payment-success-container'>
      <div className='payment-success-image-container'>
        <img src='/assets/img/payment_failed.jpg' alt='Payment Failed' />
      </div>
      <div className='payment-success-message-container'>
        <h2>Payment Failed!</h2>
        <p>Please go to the cart page and try to complete the payment again.</p>
        <p>Sorry for the inconvenience caused.</p>
        <Link to="/cart"> Go to Cart </Link>
      </div>
    </div>
  );
};
