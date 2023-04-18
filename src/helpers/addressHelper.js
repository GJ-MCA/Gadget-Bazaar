import {Country} from "country-state-city";
import {State} from "country-state-city";
import {City} from "country-state-city";

export const getCountries = async() => {
    try {
        const countries = Country.getAllCountries();
        console.log(countries)
        return countries;
    } catch (err) {
        console.error(err.message);
    }
}
export const getStates = async(countrycode) => {
    try {
        const states = State.getStatesOfCountry(countrycode);
        console.log(countrycode)
        console.log(states)
        return states;
    } catch (err) {
        console.error(err.message);
    }
}
export const getCities = async(countrycode,statecode) => {
    try {
        const cities = City.getCitiesOfState(countrycode,statecode);
        console.log(countrycode,statecode)
        console.log(cities)
        return cities ;
    } catch (err) {
        console.error(err.message);
    }
}