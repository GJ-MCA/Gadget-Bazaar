import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { getCities, getCountries, getStates } from '../../helpers/addressHelper';
import { setPageTitle } from '../../helpers/titleHelper';

const config = require("../../config/config");

const EditAddress = () => {
  const { address_id } = useParams();
  const navigate = useNavigate();
  const [address, setAddress] = useState({});
  const [errors, setErrors] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [country, setCountry] = useState([]);
  const [state, setState] = useState([]);
  const [city, setCity] = useState([]);

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const response = await fetch(`${config.authAPIUrl}/addresses/${address_id}`);
        const data = await response.json();
        setAddress(data);
        const { country, state, city } = data;
        setSelectedCountry(country);
        setSelectedState(state);
        setSelectedCity(city);
      } catch (error) {
        console.error('Error fetching address:', error);
      }
    };

    fetchAddress();
  }, [address_id]);

  useEffect(() => {
    getCountries().then((countries) => {
      setCountry(countries);
    });
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      getStates(selectedCountry).then((states) => {
        setState(states);
      });
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedCountry && selectedState) {
      getCities(selectedCountry, selectedState).then((cities) => {
        setCity(cities);
      });
    }
  }, [selectedCountry, selectedState]);

  const handleCountryChange = (event) => {
    const selectedCountry = event.target.value;
    setSelectedCountry(selectedCountry);
    setSelectedState("");
    setSelectedCity("");
    handleFormChange(event.target.name, event.target.value);
  };

  const handleStateChange = (event) => {
    const selectedState = event.target.value;
    setSelectedState(selectedState);
    setSelectedCity("");
    handleFormChange(event.target.name, event.target.value);
  };

  const handleCityChange = (event) => {
    const selectedCity = event.target.value;
    setSelectedCity(selectedCity);
    handleFormChange(event.target.name, event.target.value);
  };

  const handleFormChange = (name, value) => {
    setAddress((prevAddress) => ({
      ...prevAddress,
      [name]: value,
    }));
  };

  const handleAddressUpdate = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${config.authAPIUrl}/addresses/edit/${address_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(address),
      });

      const data = await response.json();

      if (response.ok) {
        console.log(response)
        console.log(data)
        if (data && data.success) {
          setMessage(data.success);
          setErrors([]);
          console.log(data)
          setAddress(data.address);
        } else if (data && data.errors) {
          setErrors(data.errors);
          setMessage("");
        }
      } else {
        console.error('Error updating address:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating address:', error);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className='container my-addresses-container edit-address-container'>
      {setPageTitle("Edit Address")}
      <h2>Edit Address</h2>
      {message && (
        <div className='alert alert-success'>{message}</div>
      )}
      {errors.length > 0 && (
        <div className='alert alert-danger'>
          <ul style={{ paddingLeft: "15px", marginBottom: "0" }}>
            {errors.map((error, index) => (
              <li key={index}>{error.msg}</li>
            ))}
          </ul>
        </div>
      )}
      <form onSubmit={handleAddressUpdate}>
        <input
          type="text"
          name="address_line_1"
          placeholder="Address Line 1"
          required
          value={address.address_line_1 || ''}
          onChange={e => handleFormChange(e.target.name, e.target.value)}
        />
        <input
          type="text"
          name="address_line_2"
          placeholder="Address Line 2"
          value={address.address_line_2 || ''}
          onChange={e => handleFormChange(e.target.name, e.target.value)}
        />
        <select
          className="custom-select d-block w-100"
          name="country"
          id="country"
          required
          value={selectedCountry || ''}
          onChange={handleCountryChange}
          data-label="country"
        >
          <option value="">Select Country</option>
          {country.map((value, index) => (
            <option key={index} value={value.isoCode}>{value.name}</option>
          ))}
        </select>
        <select
          className="custom-select d-block w-100"
          id="state"
          name="state"
          required
          value={selectedState || ''}
          onChange={handleStateChange}
          data-label="state"
        >
          <option value="">Choose...</option>
          {state.map((value, index) => (
            <option key={index} value={value.isoCode}>{value.name}</option>
          ))}
        </select>
        <select
          className="custom-select d-block w-100"
          id="city"
          name="city"
          required
          value={selectedCity || ''}
          onChange={handleCityChange}
          data-label="city"
        >
          <option value="">Choose...</option>
          {city.map((value, index) => (
            <option key={index} value={value.name}>{value.name}</option>
          ))}
        </select>
        <input
          type="text"
          name="pincode"
          placeholder="Pincode"
          required
          value={address.pincode || ''}
          onChange={e => handleFormChange(e.target.name, e.target.value)}
        />
        <input
          type="text"
          name="contact"
          placeholder="Contact"
          value={address.contact || ''}
          onChange={e => handleFormChange(e.target.name, e.target.value)}
        />
        <button style={{marginRight: "10px"}} type="submit">Update Address</button>
        <button type="button" onClick={handleCancel}>Cancel</button>
      </form>
    </div>
  );
};

export default EditAddress;

