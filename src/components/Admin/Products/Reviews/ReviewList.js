import React, { useEffect, useState } from 'react';
import { adminMainAPIUrl } from '../../../../config/config';
import { Link, useNavigate } from 'react-router-dom';
import { addNeccessaryClasses, adminFrontProductReviewPostFix, adminFrontProductsPostFix, adminFrontUsersPostFix } from '../../../../helpers/adminHelper';
import { setPageTitle } from '../../../../helpers/titleHelper';

function ReviewList() {
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(adminMainAPIUrl+"/product-reviews/getall");
      const data = await response.json();
      setReviews(data);
    }

    fetchData();
    addNeccessaryClasses();
  }, []);
  const handleEditReviewClick = (id) => {
    if (id) {
      navigate(adminFrontProductReviewPostFix+"/edit/"+id);
    } else {
      alert("Something went wrong!");
    }
  };

  return (
    <div className='main-table-container content'>
      {setPageTitle("Review List")}
      <h2>Review List</h2>
      {reviews && reviews.length > 0 ? (
        <div className='table-container mt-4'>
          <table>
            <thead>
              <tr>
                <th>User ID</th>
                <th>User Name</th>
                <th>Product SKU</th>
                <th>Rating</th>
                <th>Message</th>
                <th>Approved</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review) => (
                <tr key={review._id}>
                  <td><Link to={`${adminFrontUsersPostFix}/edit/${review.user_id._id}`}>  {review.user_id._id} </Link></td>
                  <td><Link to={`${adminFrontUsersPostFix}/edit/${review.user_id._id}`}>  {review.user_id.name} </Link></td>
                  <td><Link to={`${adminFrontProductsPostFix}/edit/${review.product_id._id}`}>  {review.product_id.sku} </Link></td>
                  <td>{review.rating}</td>
                  <td>{review.msg}</td>
                  <td>{review.is_approved ? "Yes" : "No"}</td>
                  <td>
                    <button onClick={() => handleEditReviewClick(review._id)}>Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No Reviews found.</p>
      )}
    </div>
  );
}

export default ReviewList;
