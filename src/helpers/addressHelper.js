import {Country} from "country-state-city";
import {State} from "country-state-city";
import {City} from "country-state-city";
const config = require("../config/config");

export const getCountries = async() => {
    try {
        const countries = Country.getAllCountries();
        return countries;
    } catch (err) {
        console.error(err.message);
    }
}
export const getStates = async(countrycode) => {
    try {
        const states = State.getStatesOfCountry(countrycode);
        return states;
    } catch (err) {
        console.error(err.message);
    }
}
export const getCities = async(countrycode,statecode) => {
    try {
        const cities = City.getCitiesOfState(countrycode,statecode);
        return cities ;
    } catch (err) {
        console.error(err.message);
    }
}

//Calling APIs
export const addAddress = async (addressData, token) => {
    try {
      const response = await fetch(`${config.orderAPIUrl}/address/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': `Bearer ${token}`
        },
        body: JSON.stringify(addressData)
      });
  
      const data = await response.json();
  
      if (response.ok) {
        data["ok"] = true;
        return data;
    } else {
        data["ok"] = false;
        return data.error;
      }
    } catch (err) {
      console.error(err);
      return err;
    }
};
export const getAddressById = async (addressId, token) => {
    try {
        console.log("token: "+token)
      const response = await fetch(`${config.orderAPIUrl}/address/get/${addressId}`,{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': `Bearer ${token}`
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  };
  