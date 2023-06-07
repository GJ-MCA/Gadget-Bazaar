import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCities, getCountries, getStates } from '../../helpers/addressHelper';
import { setPageTitle } from '../../helpers/titleHelper';

const config = require("../../config/config");

const AddAddress = () => {
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

  const handleAddressCreate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('auth-token');
   
    try {
      const response = await fetch(`${config.authAPIUrl}/addresses/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': `Bearer ${token}`
        },
        body: JSON.stringify(address),
      });

      const data = await response.json();

      if (response.ok) {
        if (data && data.success) {
          setMessage(data.success);
          setErrors([]);
          setAddress({});
        } else if (data && data.errors) {
          setErrors(data.errors);
          setMessage("");
        }
      } else {
        console.error('Error creating address:', response.statusText);
      }
    } catch (error) {
      console.error('Error creating address:', error);
    }
  };

  const handleGoToMyAddresses = () => {
    navigate('/my-addresses');
  };

  return (
    <div className='container my-addresses-container add-address-container'>
        {setPageTitle("Add Address")}
      <h2>Add Address</h2>
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
            <form onSubmit={handleAddressCreate}>
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
                {country && country.length > 0 ? (
                    <>
                        <option value="">Select Country</option>
                        <option value="IN">India</option>
                        {country.map((value,index) => (
                                value.isoCode !== "IN" && <option key={index} value={value.isoCode} disabled>
                                {value.name}
                            </option>
                        ))}
                    </>
                    ) : (
                        <option value="">No countries</option>
                    )}
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
              <button style={{marginRight: "10px"}} type="submit">Save Address</button>
              <button type="button" onClick={handleGoToMyAddresses}>Go to My Addresses</button>
            </form>
          </div>
        );
      };
      
      export default AddAddress;
      
       
