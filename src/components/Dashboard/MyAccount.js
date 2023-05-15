import React from 'react';
import { Link } from 'react-router-dom';

export const MyAccount = () => {
  return (
    <div className='container' style={{marginTop: "104px", height: "40vh"}}>
      <h2 className='text-center'>My Account</h2>
      <p>Welcome to your account page. Here you can manage your profile and view your orders</p>
      <ul>
        <li><Link to={"/profile"}  className='btn-links'> Profile </Link></li>
        <li><Link to={"/my-orders"} className='btn-links'> Orders </Link></li>
      </ul>
    </div>
  );
};

