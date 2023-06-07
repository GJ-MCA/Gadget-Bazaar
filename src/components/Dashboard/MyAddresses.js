import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { setPageTitle } from '../../helpers/titleHelper';

const config = require("../../config/config");
const MyAddresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [editAddressId, setEditAddressId] = useState(null);
  useEffect(() => {
    // Fetch addresses from your backend API
    const fetchAddresses = async () => {
      try {
        const response = await fetch(`${config.authAPIUrl}/addresses/getall`); // Replace with your actual API endpoint
        const data = await response.json();
        setAddresses(data);
      } catch (error) {
        console.error('Error fetching addresses:', error);
      }
    };

    fetchAddresses();
  }, []);
  return (
    <div className='container my-addresses-container' style={{ minHeight: '30vh', marginTop: '104px' }}>
        {setPageTitle("My Addresses")}
      <h2>My Addresses</h2>
      {addresses.length > 0 ? (
        <div className='table-container'>
          <table>
            <thead>
              <tr>
                <th>Sr</th>
                <th>Address Line 1</th>
                <th>Address Line 2</th>
                <th>City</th>
                <th>State</th>
                <th>Country</th>
                <th>Pincode</th>
                <th>Contact</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {addresses.map((address, index) => (
                <tr key={address._id}>
                  <td>{index + 1}</td>
                  <td>{address.address_line_1 ? address.address_line_1 : "N/A"}</td>
                  <td>{address.address_line_2 ? address.address_line_2 : "N/A"}</td>
                  <td>{address.city ? address.city : "N/A"}</td>
                  <td>{address.state ? address.state : "N/A"}</td>
                  <td>{address.country ? address.country : "N/A"}</td>
                  <td>{address.pincode ? address.pincode : "N/A"}</td>
                  <td>{address.contact ? address.contact : "N/A"}</td>
                  <td>
                    <Link to={"edit/"+address._id}> Edit </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <>
          <p>No addresses found.</p>
        </>
      )}
      <div className='btn-container text-center mt-4'>
        <Link to="add">Add Address</Link>
      </div>
    </div>
  );
};

export default MyAddresses;
