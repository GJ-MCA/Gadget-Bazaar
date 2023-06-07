import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminMainAPIUrl } from '../../../../config/config';
import { addNeccessaryClasses, adminFrontProductReviewPostFix } from '../../../../helpers/adminHelper';
import { updateLoader } from '../../../../helpers/generalHelper';
import { setPageTitle } from '../../../../helpers/titleHelper';

const EditReview = () => {
  const { id } = useParams();
  const [msg, setMsg] = useState('');
  const [user, setUser] = useState('');
  const [product, setProduct] = useState('');
  const [rating, setRating] = useState(0);
  const [isApproved, setIsApproved] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [errors, setErrors] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${adminMainAPIUrl}/product-reviews/get/${id}`);
        const data = await response.json();
        console.log(data)
        setUser(data.user_id);
        setProduct(data.product_id);
        setMsg(data.msg);
        setRating(data.rating);
        setIsApproved(data.is_approved);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchData();
    addNeccessaryClasses();
  }, [id]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === 'rating') {
      setRating(Number(value));
    } else if (name === 'is_approved') {
      setIsApproved(event.target.checked);
    } else {
      setMsg(value);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = {
      msg: msg,
      rating: rating,
      is_approved: isApproved,
    };

    try {
      updateLoader(true);
      const response = await fetch(`${adminMainAPIUrl}/product-reviews/edit/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error('Failed to update review');
      }
      if(data){
        if(data.success){
          setMessage(data.success);
          setErrors([])
        }else{
          setMessage("");
          setErrors(data.errors);
        }
      }
    } catch (error) {
      setError(error.message);
    }
    updateLoader(false);
  };

  return (
    <div className='content'>
      {setPageTitle("Edit Review")}
      <h2>Edit Review</h2>
      {message && (
          <div className='alert alert-success'>
            {message}
          </div>
        )}
      {errors.length > 0 && (
                  <div className="alert alert-danger">
                    <ul style={{paddingLeft: "15px", marginBottom: "0"}}>
                      {errors.map((error, index) => (
                        <li key={index}>{error.msg}</li>
                      ))}
                    </ul>
                  </div>
                )}
      {error ? (
        <p>{error}</p>
      ) : (
        <form>
          {errors.length > 0 && (
            <div className="alert alert-danger">
              <ul style={{ paddingLeft: "15px", marginBottom: "0" }}>
                {errors.map((error, index) => (
                  <li key={index}>{error.msg}</li>
                ))}
              </ul>
            </div>
          )}
          <div>
            <label htmlFor="product">Product:</label>
            <input type="text" name="product" value={product.name} onChange={handleInputChange} disabled />
          </div>
          <div>
            <label htmlFor="user">User:</label>
            <input type="text" name="user" value={user.name} onChange={handleInputChange} disabled />
          </div>
          <div>
            <label htmlFor="msg">Message:</label>
            <textarea name="msg" value={msg} onChange={handleInputChange} disabled style={{cursor: "not-allowed", backgroundColor: "#E3E3E3", color: "#66615B"}}/>
          </div>
          <div>
            <label htmlFor="rating">Rating:</label>
            <input type="number" name="rating" value={rating} onChange={handleInputChange} disabled/>
          </div>
          <div className='checkbox-container'>
            <label htmlFor="is_approved">Approved:</label>
            <input type="checkbox" name="is_approved" checked={isApproved} onChange={handleInputChange} />
          </div>
          <button type="button" onClick={handleSubmit}>Update Review</button>
        </form>
      )}
    </div>
  );
};

export default EditReview;
