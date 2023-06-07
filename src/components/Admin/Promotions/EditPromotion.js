import React, { useState, useEffect } from 'react';
import { adminMainAPIUrl } from '../../../config/config';
import { useNavigate,useParams } from 'react-router-dom';
import { addNeccessaryClasses, adminFrontPromotionsPostFix, getPromotionStatusValues } from '../../../helpers/adminHelper';
import { setPageTitle } from '../../../helpers/titleHelper';

function EditPromotion() {
  const { id } = useParams();
  const [promotionName, setPromotionName] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState('');
  const [timesRemaining, setTimesRemaining] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [status, setStatus] = useState('');
  const [promotionStatusValues, setPromotionStatusValues] = useState('');
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchPromotion = async () => {
      try {
        const response = await fetch(`${adminMainAPIUrl}/promotions/get/${id}`);
        const data = await response.json();
        const promotion = data.promotion;

        setPromotionName(promotion.promotion_name);
        setCouponCode(promotion.coupon_code);
        setDiscount(promotion.discount);
        setTimesRemaining(promotion.times_remaining);
        if (promotion.expiry_date) {
          const expDate = new Date(promotion.expiry_date);
          const formattedDate = expDate.toISOString().slice(0, 10);
          setExpiryDate(formattedDate);
        }        
        setStatus(promotion.status);
      } catch (error) {
        console.error(error);
      }
    };
    const fetchPromotionOptions = async () =>{
        await getPromotionStatusValues().then(
          (data)=>{
            if(data.success === true){
                setPromotionStatusValues(data.promotionStatusOptions)
                setStatus(data.promotionStatusOptions[0])
            }else{
                if(data.errors){
                    setErrors(data.errors)
                }
            }
          }
        )
      }
      fetchPromotion();
      fetchPromotionOptions();
    addNeccessaryClasses();
  }, []);

  const handleEditPromotion = async (event) => {
    event.preventDefault();
    const formData = {
      promotion_name: promotionName,
      coupon_code: couponCode,
      discount: parseInt(discount),
      times_remaining: parseInt(timesRemaining),
      expiry_date: expiryDate,
      status: status
    };

    try {
      const response = await fetch(`${adminMainAPIUrl}/promotions/edit/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setMessage(data.success);
      } else {
        if (data.errors) {
          setErrors(data.errors);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <div className='content'>
      {setPageTitle("Edit Promotion")}
      <h2>Edit Promotion</h2>
      <form className='admin-form'>
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
        <div>
          <label htmlFor='promotionName'>Promotion Name(Example: 10% OFF):</label>
          <input
            className='form-control'
            type='text'
            id='promotionName'
            value={promotionName}
            onChange={(e) => setPromotionName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor='couponCode'>Coupon Code:</label>
          <input
            className='form-control'
            type='text'
            id='couponCode'
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor='discount'>Discount (%):</label>
          <input
            className='form-control'
            type='number'
            id='discount'
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor='times_remaining'>Times Remaining:</label>
          <input
          title='This field represents the number of times the promotion can still be used before it expires'
            className='form-control'
            type='number'
            id='times_remaining'
            value={timesRemaining}
            onChange={(e) => setTimesRemaining(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor='expiryDate'>Expiry Date:</label>
          <input
            className='form-control'
            type='date'
            id='expiryDate'
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            required
          />
        </div>
        <div className='dropdown-container form-control mt-4'>
            <label htmlFor='status' style={{fontSize: "1rem", color: "#000", marginBottom: "0"}}> Status:  </label>
            <select className='ml-2' style={{textTransform: "capitalize"}} id="status" name='status' value={status || ""}  onChange={(e) => setStatus(e.target.value)}>
            {promotionStatusValues && promotionStatusValues.map(option => (
                <option key={option} value={option}>{option}</option>
            ))}
            </select>
          </div>
        <button type='button' onClick={handleEditPromotion}>
          Save Promotion
        </button>
      </form>
    </div>
  );
}

export default EditPromotion;
