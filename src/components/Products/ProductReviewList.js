import React, { useState, useEffect } from 'react';
import StarRating from './StarRating';
const config = require("../../config/config")
const ProductReviewList = ({ productId  }) => {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`${config.productBaseAPIUrl}/reviews/get/${productId}`);
        const data = await response.json();
        console.log(data)
        if(data){
          if(data.success){
            setReviews(data.reviews);
            setRating(data.reviews.rating)
            console.log(data)
          }
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchReviews();
  }, [productId]);
  const formatDate = (datestr) =>{
    const dateTime = new Date(datestr);
    const options = {
    year: 'numeric', month: 'short', day: 'numeric',
    };
    const formattedDateTime = dateTime.toLocaleString('en-IN', options);
    return formattedDateTime;
  }
  return (
    <div className='mt-4'>
      <h2>Product Reviews</h2>
      {reviews && reviews.length === 0 && <p>No reviews yet, Be the first one to add a review</p>}
      {reviews && reviews.length > 0 && reviews.map((review) => (
        <div class="card p-2 mb-4" key={review._id}>
            <div class="row d-flex" style={{marginLeft: "15px",marginRight: "100px"}}>
                <div class="d-flex align-items-center">
                    <h3 class="mb-0 mr-2">{review.user_id.name}</h3>
                    <div>
                      <StarRating rating={review.rating} setRating={setRating} />
                    </div>
                    <p class="text-muted mb-0 ml-2 mt-1">{formatDate(review.created_date)}</p>
       
                </div>
               
            </div>
            <div class="row text-left" style={{marginLeft: "15px",marginRight: "15px"}}>
                <p class="content">{review.msg}</p>
            </div>
            <div style={{position: "absolute", right: "15px", top: "15px"}}>
              <button>Delete Review</button>
            </div>
        </div>
      ))}
    </div>
  );
};

export default ProductReviewList;
