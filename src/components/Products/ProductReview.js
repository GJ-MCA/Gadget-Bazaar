import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const config = require("../../config/config")
const ProductReview = ({ productId }) => {
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [msg, setMsg] = useState('');
  const [success, setSuccess] = useState(null);
  const [errors, setErrors] = useState(null);
    const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`${config.productBaseAPIUrl}/reviews/add/${productId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, rating, msg }),
      });
      const data = await response.json();
      setSuccess(data.success);
      setName('');
      setRating(0);
      setMsg('');
    } catch (err) {
      setErrors('Failed to submit review');
    }
  };

  return (
   <>
   <h4 className='mt-3'>Add Product Review </h4>
   {localStorage.getItem("auth-token") ? (

       <form onSubmit={handleSubmit} className='mt-3'>
    {errors && errors.length > 0 && (
          <div className="alert alert-danger">
            <ul>
              {errors.map((error, index) => (
                <li key={index}>{error.msg}</li>
              ))}
            </ul>
          </div>
    )}
      {success && <div className="success alert alert-success">{success}</div>}
      <div>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          className='form-control'
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="rating">Rating:</label>
        <input
          type="number"
          className='form-control'
          id="rating"
          min="1"
          max="5"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="msg">Message:</label>
        <textarea
          id="msg"
          className='form-control'
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          required
        />
      </div>
      <button type="submit">Submit</button>
    </form>
   ): (
    <>
         <div>
            <p> Login to add product review.</p>
            <button onClick={() => {navigate("/login") }}> Login </button>
        </div>
     </>
   )}
   </>
  );
};

export default ProductReview;
