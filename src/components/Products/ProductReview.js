import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StarRating from './StarRating';
const config = require("../../config/config")
const ProductReview = ({ productId }) => {
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [msg, setMsg] = useState('');
  const [success, setSuccess] = useState(null);
  const [errors, setErrors] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
      const token = localStorage.getItem('auth-token');
			if (token) {
				// Make an API call to get the user's details
				fetch(`${config.authAPIUrl}/getuser`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'auth-token': `Bearer ${token}`
				},
				})
				.then(response => {
				if (response.ok) {
					return response.json();
				}
				throw new Error('Network response was not ok');
				})
				.then(data => {
					setName(data.name);
				})
				.catch(error => {
				console.error('There was a problem with the fetch operation:', error);
				});
			}
      
    }, [])
    
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem('auth-token');
      const response = await fetch(`${config.productBaseAPIUrl}/reviews/add/${productId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'auth-token': `Bearer ${token}` },
        body: JSON.stringify({ name, rating, msg }),
      });
      const data = await response.json();
      setSuccess(data.success);
      setRating(5);
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
          disabled={name !== ''}
          required
        />
      </div>
      <div>
          <label htmlFor="rating" style={{marginBottom: "0"}}>Rating:</label>
          <StarRating rating={rating} setRating={setRating} />
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
