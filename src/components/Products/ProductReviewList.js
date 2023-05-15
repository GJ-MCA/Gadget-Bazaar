import React, { useState, useEffect } from 'react';
const config = require("../../config/config")
const ProductReviewList = ({ productId  }) => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`${config.productBaseAPIUrl}/reviews/get/${productId}`);
        const data = await response.json();
        console.log(data)
        if(data){
          if(data.success){
            setReviews(data);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchReviews();
  }, [productId]);

  return (
    <div className='mt-4'>
      <h2>Product Reviews</h2>
      {reviews && reviews.length === 0 && <p>No reviews yet, Be the first one to add a review</p>}
      {reviews && reviews.length > 0 && reviews.map((review) => (
        <div key={review._id}>
          <h3>{review.name}</h3>
          <p>Rating: {review.rating}/5</p>
          <p>{review.msg}</p>
        </div>
      ))}
    </div>
  );
};

export default ProductReviewList;
