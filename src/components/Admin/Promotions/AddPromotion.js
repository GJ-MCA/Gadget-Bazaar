import React, { useState, useEffect } from 'react';
import { adminMainAPIUrl } from '../../../config/config';
import { useNavigate } from 'react-router-dom';
import { addNeccessaryClasses, adminFrontPromotionsPostFix, getPromotionStatusValues } from '../../../helpers/adminHelper';
import { setPageTitle } from '../../../helpers/titleHelper';

function AddPromotion() {
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
      fetchPromotionOptions();
    addNeccessaryClasses();
  }, []);

  const handleAddPromotion = async (event) => {
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
      const response = await fetch(`${adminMainAPIUrl}/promotions/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if(data.success){
        setMessage(data.success);
        setPromotionName('');
        setCouponCode('');
        setDiscount('');
        setTimesRemaining('');
        setExpiryDate('');
        setStatus('');
        setErrors('');
     }else{
        if(data.errors){
            setErrors(data.errors)
            setMessage('');
        }
    }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='content'>
      {setPageTitle("Add Promotion")}
      <h2>Add Promotion</h2>
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
        <button type='button' onClick={handleAddPromotion}>
          Add Promotion
        </button>
      </form>
    </div>
  );
}

export default AddPromotion;
