import React, { useEffect, useContext, useState, useMemo } from 'react'
import { GadgetBazaarContext } from '../../context/GadgetBazaarContext';
import fetchCartItems, {fetchSavedAddresses} from '../../helpers/cartHelper';
import {fetchCurrentUser} from '../../helpers/userHelper';
import {getCountries, getStates, getCities} from '../../helpers/addressHelper';
import { Link } from 'react-router-dom';
export const Checkout = () => {
    
	const {setCartCount, cartItems, setCartItems, currentUser, setCurrentUser, cartFinalTotal, setCartFinalTotal, checkoutSavedAddresses, setCheckoutSavedAddresses } = useContext(GadgetBazaarContext);
    const [setName] = useState(null);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [selectedState, setSelectedState] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);
    const [country, setCountry] = useState('');
    const [state, setState] = useState('');
    const [city, setCity] = useState('');
    const [isShippingDifferent, setIsShippingDifferent] = useState(false);
    const totalQty = useMemo(() => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    }, [cartItems]);
    useEffect(() => {
        document.body.classList.add("gadgetbazaar-checkout-page");
        const token = localStorage.getItem('auth-token');
        fetchCartItems(token).then((data) => {
            setCartItems(data['cartItems']);
            setCartFinalTotal(data['cartTotalAmount'])
        });
        fetchSavedAddresses(token).then((data) => {
            setCheckoutSavedAddresses(data);
        });
        fetchCurrentUser(token).then((data) => {
            setCurrentUser(data);
        });
        setCartCount(totalQty);
        getCountries().then((countries) => {
            setCountry(countries);
        });
        // cleanup function to remove the class on unmount
        return () => {
          document.body.classList.remove("gadgetbazaar-checkout-page");
        };
      }, [setCartCount, setCartItems, totalQty]);
      const handleCountryChange = (event) => {
        console.log("Country changed")
        let selectedcountry = event.target.value;
        setSelectedCountry(selectedcountry);
        console.log(selectedcountry)
        getStates(selectedcountry).then((states)=>{
            console.log(states)
            setState(states);
        });
      };
    
      const handleStateChange = (event) => {
        let selectedstate = event.target.value;
        setSelectedState(selectedstate);
        console.log(selectedCountry)
        console.log(selectedState)
        getCities(selectedCountry,selectedstate).then((cities)=>{
            setCity(cities);
        });
      };
      const handleCityChange = (event) => {
        let selectedcity = event.target.value;
        setSelectedCity(selectedcity);
      };
  return (
    <>
        <div className="container">
            <div className="py-5 text-center">
                <img className="d-block mx-auto mb-4" src="/assets/img/logo.png" alt="" width="200"/>
                <h2>Checkout</h2>
            </div>
            <div className="pt-3 pb-4">
                <h6 className="mb-0">
                    <Link to="/cart" className="text-body">
                        <i className="fa fa-long-arrow-left mr-2"></i>
                        Back to Cart
                    </Link>
                </h6>
            </div>
            <div className="mb-5">
                    <label htmlFor="saved-address">Saved Addresses</label>
                    <select
                        className="custom-select d-block w-100"
                        id="saved-address"
                        value={selectedAddressId || ''}
                        onChange={(event) => setSelectedAddressId(event.target.value)}
                    >
                        {checkoutSavedAddresses && checkoutSavedAddresses.length > 0 ? (
                            <>
                                <option value="">Choose...</option>
                                {checkoutSavedAddresses.map((address, index) => (
                                    <option key={index} value={address.id}>
                                        {address.address_line_1}, {address.address_line_2}, {address.city}, {address.state}, {address.pincode}, {address.country}
                                    </option>
                                ))}
                            </>
                        ) : (
                            <option value="">No saved addresses found</option>
                        )}
                    </select>
                </div>
            <div className="row">
                <div className="col-md-4 order-md-2 mb-4">
                    <h4 className="d-flex justify-content-between align-items-center mb-3">
                        <span className="text-muted">Your cart</span>
                        <span className="badge badge-secondary badge-pill">{cartItems.length}</span>
                    </h4>
                    {cartItems.length === 0 ? (
                        <p>No items in cart</p>
                    ) : (
                        <ul className="list-group mb-3 sticky-top">
                              {cartItems.map((cartItem) => (
                            <li key={cartItem.product_id.id} className="list-group-item d-flex justify-content-between lh-condensed">
                                <div>
                                    <h6 className="my-0">{cartItem.product_id.name}</h6>
                                    <small className="text-muted">{cartItem.product_id.description}</small>
                                </div>
                                <span className="text-muted">&#8377;{cartItem.product_id.price * cartItem.quantity}</span>
                            </li>
                             ))}
                            <li className="list-group-item d-flex justify-content-between bg-light">
                                <div className="text-muted">
                                    <h6 className="my-0">Delivery Charges</h6>
                                    <small>Standard</small>
                                </div>
                                <span className="text-muted">+ &#8377;40.00</span>
                            </li>
                            <li className="list-group-item d-flex justify-content-between bg-light">
                                <div className="text-success">
                                    <h6 className="my-0">Promo code</h6>
                                    <small>EXAMPLECODE</small>
                                </div>
                                <span className="text-success">-$5</span>
                            </li>
                            <li className="list-group-item d-flex justify-content-between">
                                <span>Total</span>
                                <strong>&#8377;{cartFinalTotal}</strong>
                            </li>
                        </ul>
                     )}
                </div>
               
                <div className="col-md-8 order-md-1">
                    <form className="needs-validation" noValidate="">
                        <div className='billing-address' id="billing_address">
                            <h4 className="mb-3">Billing address</h4>
                            <div className="mb-3">
                                <label htmlFor="name">Name</label>
                                <input type="text" className="form-control" id="name" placeholder="" onChange={(event) => setName(event.target.value)} value={currentUser ? currentUser.name : ""} required="" disabled={"disabled"}/>
                                <div className="invalid-feedback"> Valid name is required. </div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="address_1">Address Line 1</label>
                                <input type="text" className="form-control" name="address_1" id="address_1" placeholder="1234 Main St" required=""/>
                                <div className="invalid-feedback"> Please enter your address. </div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="address_2">Address Line 2 <span className="text-muted">(Optional)</span></label>
                                <input type="text" className="form-control" name="address_2-2" id="address_2" placeholder="Apartment or suite"/>
                            </div>
                            <div className="row">
                                <div className="col-md-4 mb-3">
                                    <label htmlFor="country">Country</label>
                                    <select className="custom-select d-block w-100" name="country" id="country" required="" value={selectedCountry || ''} onChange={handleCountryChange}>
                                        {country && country.length > 0 ? (
                                            <>
                                                <option value="">Choose...</option>
                                                {country.map((value,index) => (
                                                    <option key={index} value={value.isoCode}>
                                                    {value.name}
                                                    </option>
                                                ))}
                                            </>
                                        ) : (
                                            <option value="">No countries</option>
                                        )}
                                    </select>
                                    <div className="invalid-feedback"> Please provide a valid country. </div>
                                </div>
                                <div className="col-md-4 mb-3">
                                    <label htmlFor="state">State</label>
                                    <select
                                    className="custom-select d-block w-100"
                                    id="state" name="state"
                                    required=""
                                    onChange={handleStateChange}
                                    value={selectedState || ''}
                                    >
                                    <option value="">Choose...</option>
                                    {state && state.length > 0 ? (
                                        state.map((value, index) => (
                                        <option key={index} value={value.isoCode}>
                                            {value.name}
                                        </option>
                                        ))
                                    ) : (
                                        ""
                                    )}
                                    </select>
                                    <div className="invalid-feedback"> Please provide a valid state. </div>
                                </div>
                                <div className="col-md-4 mb-3">
                                    <label htmlFor="city">City</label>
                                    <select className="custom-select d-block w-100" id="city" name="city" required=""  onChange={handleCityChange} value={selectedCity || ''}>
                                    <option value="">Choose...</option>
                                    {city && city.length > 0 ? (
                                        city.map((value, index) => (
                                        <option key={index} value={value.name}>
                                            {value.name}
                                        </option>
                                        ))
                                    ) : (""
                                    )}
                                    </select>
                                    <div className="invalid-feedback"> Please provide a valid city. </div>
                                </div>
                                <div className="col-md-3 mb-3">
                                    <label htmlFor="pincode">Pincode</label>
                                    <input type="text" className="form-control" name="pincode" id="pincode" placeholder="" required=""/>
                                    <div className="invalid-feedback"> Pincode code required. </div>
                                </div>
                                <div className="col-md-3 mb-3">
                                    <label htmlFor="contact_address">Contact(Optional)</label>
                                    <input type="text" className="form-control" name="contact_address" id="contact_address" placeholder=""/>
                                </div>
                            </div>
                        </div>
                        <div className='shipping-address' id="shipping_address" style={{ display: isShippingDifferent ? "block" : "none" }}>
                        <h4 className="mb-3">Shipping address</h4>
                            <div className="mb-3">
                                <label htmlFor="address_1-2">Address Line 1</label>
                                <input type="text" className="form-control" name="address_1-2" id="address_1-2" placeholder="1234 Main St" required=""/>
                                <div className="invalid-feedback"> Please enter your address. </div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="address_2-2">Address Line 2 <span className="text-muted">(Optional)</span></label>
                                <input type="text" className="form-control" id="address_2-2" name="address_2-2" placeholder="Apartment or suite"/>
                            </div>
                            <div className="row">
                                <div className="col-md-4 mb-3">
                                    <label htmlFor="country-2">Country</label>
                                    <select className="custom-select d-block w-100" name="country-2" id="country-2" required="" value={selectedCountry || ''} onChange={handleCountryChange}>
                                        {country && country.length > 0 ? (
                                            <>
                                                <option value="">Choose...</option>
                                                {country.map((value,index) => (
                                                    <option key={index} value={value.isoCode}>
                                                    {value.name}
                                                    </option>
                                                ))}
                                            </>
                                        ) : (
                                            <option value="">No countries</option>
                                        )}
                                    </select>
                                    <div className="invalid-feedback"> Please provide a valid country. </div>
                                </div>
                                <div className="col-md-4 mb-3">
                                    <label htmlFor="state-2">State</label>
                                    <select
                                    className="custom-select d-block w-100"
                                    id="state-2" name="state-2"
                                    required=""
                                    onChange={handleStateChange}
                                    value={selectedState || ''}
                                    >
                                    <option value="">Choose...</option>
                                    {state && state.length > 0 ? (
                                        state.map((value, index) => (
                                        <option key={index} value={value.isoCode}>
                                            {value.name}
                                        </option>
                                        ))
                                    ) : (
                                        ""
                                    )}
                                    </select>
                                    <div className="invalid-feedback"> Please provide a valid state. </div>
                                </div>
                                <div className="col-md-4 mb-3">
                                    <label htmlFor="city-2">City</label>
                                    <select className="custom-select d-block w-100" id="city-2" name="city-2" required=""  onChange={handleCityChange} value={selectedCity || ''}>
                                    <option value="">Choose...</option>
                                    {city && city.length > 0 ? (
                                        city.map((value, index) => (
                                        <option key={index} value={value.name}>
                                            {value.name}
                                        </option>
                                        ))
                                    ) : (""
                                    )}
                                    </select>
                                    <div className="invalid-feedback"> Please provide a valid city. </div>
                                </div>
                                <div className="col-md-3 mb-3">
                                    <label htmlFor="pincode-2">Pincode</label>
                                    <input type="text" className="form-control" name="pincode-2" id="pincode-2" placeholder="" required=""/>
                                    <div className="invalid-feedback"> Pincode code required. </div>
                                </div>
                                <div className="col-md-3 mb-3">
                                    <label htmlFor="contact_address-2">Contact(Optional)</label>
                                    <input type="text" className="form-control" name="contact_address-2" id="contact_address-2" placeholder=""/>
                                </div>
                            </div>
                        </div>
                        <hr className="mb-4"/>
                        <div className="custom-control custom-checkbox">
                            <input type="checkbox" className="custom-control-input" id="is-ship-diff-address"
                            checked={isShippingDifferent}
                            onChange={(e) => setIsShippingDifferent(e.target.checked)}/>
                            <label className="custom-control-label" htmlFor="is-ship-diff-address">Shipping address is different from my billing address</label>
                        </div>
                        <div className="custom-control custom-checkbox">
                            <input type="checkbox" className="custom-control-input" id="save-info"/>
                            <label className="custom-control-label" htmlFor="save-info">Save this information for next time</label>
                        </div>
                        <hr className="mb-4"/>
                        <h4 className="mb-3">Payment</h4>
                        <div className="d-block my-3">
                            <div className="custom-control custom-radio">
                                <input id="credit" name="paymentMethod" type="radio" className="custom-control-input" required=""/>
                                <label className="custom-control-label" htmlFor="credit">Credit card</label>
                            </div>
                            <div className="custom-control custom-radio">
                                <input id="debit" name="paymentMethod" type="radio" className="custom-control-input" required=""/>
                                <label className="custom-control-label" htmlFor="debit">Debit card</label>
                            </div>
                            <div className="custom-control custom-radio">
                                <input id="paypal" name="paymentMethod" type="radio" className="custom-control-input" required=""/>
                                <label className="custom-control-label" htmlFor="paypal">PayPal</label>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label htmlFor="cc-name">Name on card</label>
                                <input type="text" className="form-control" id="cc-name" placeholder="" required=""/>
                                <small className="text-muted">Full name as displayed on card</small>
                                <div className="invalid-feedback"> Name on card is required </div>
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="cc-number">Credit card number</label>
                                <input type="text" className="form-control" id="cc-number" placeholder="" required=""/>
                                <div className="invalid-feedback"> Credit card number is required </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-3 mb-3">
                                <label htmlFor="cc-expiration">Expiration</label>
                                <input type="text" className="form-control" id="cc-expiration" placeholder="" required=""/>
                                <div className="invalid-feedback"> Expiration date required </div>
                            </div>
                            <div className="col-md-3 mb-3">
                                <label htmlFor="cc-cvv">CVV</label>
                                <input type="text" className="form-control" id="cc-cvv" placeholder="" required=""/>
                                <div className="invalid-feedback"> Security code required </div>
                            </div>
                        </div>
                        <hr className="mb-4"/>
                        <button className="btn btn-primary btn-lg btn-block" type="submit">Continue to checkout</button>
                    </form>
                </div>
            </div>
        </div>
    </>
  )
}
