import React, { useEffect, useState } from 'react';
import { adminMainAPIUrl, adminProductAPIUrl } from '../../../config/config';
import { Link, useNavigate } from 'react-router-dom';
import { addNeccessaryClasses, adminFrontPromotionsPostFix } from '../../../helpers/adminHelper';
import { setPageTitle } from '../../../helpers/titleHelper';

function PromotionList() {
  const [promos, setPromos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`${adminMainAPIUrl}/promotions/getall`);
      const data = await response.json();
      setPromos(data);
    }
    fetchData();
    
    addNeccessaryClasses();
  }, []);

  const handleAddPromoClick = () => {
    navigate(adminFrontPromotionsPostFix + '/add');
  };

  const handleEditPromoClick = (id) => {
    if (id) {
      navigate(adminFrontPromotionsPostFix + '/edit/' + id);
    } else {
      alert('Something went wrong!');
    }
  };
  function formatDate(date_string) {
    const date = new Date(date_string);
    const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', options);
    const formattedDateArray = formattedDate.split(", ");
    const formattedDayArray = formattedDateArray[1].split(" ");
    const formattedDateString = formattedDayArray[1] + "-" + formattedDayArray[0].substring(0, 3) + "-" + formattedDateArray[2] + " " + formattedDateArray[0];
    return formattedDateString;
  }
  return (
    <div className='main-table-container content'>
      {setPageTitle("Promotions List")}
      <h2>Promotions List</h2>
      <button onClick={handleAddPromoClick}>Add Promotion</button>
      {console.log(promos)}
        {promos && promos.length > 0 ? 
        <>
            <div className='table-container mt-4'>
                <table>
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Coupon Code</th>
                        <th>Discount</th>
                        <th>Times Used</th>
                        <th>Times Remaining</th>
                        <th>Expiry Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {promos.map((promo) => (
                        <tr key={promo._id}>
                        <td>{promo.promotion_name}</td>
                        <td>{promo.coupon_code}</td>
                        <td>{promo.discount}%</td>
                        <td>{promo.times_used}</td>
                        <td>{promo.times_remaining}</td>
                        <td>{formatDate(promo.expiry_date)}</td>
                        <td>{promo.status}</td>
                        <td>
                            <button onClick={() => handleEditPromoClick(promo._id)}>Edit</button>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </>
        : <>
          <p>No Promotions found.</p>
        </>}
    </div>
  );
}

export default PromotionList;
