import React, { useEffect, useContext, useState, useMemo } from 'react'
import { GadgetBazaarContext } from '../../context/GadgetBazaarContext';
import fetchCartItems, {fetchSavedAddresses, fetchCouponFromId} from '../../helpers/cartHelper';
import {fetchCurrentUser} from '../../helpers/userHelper';
import {getCountries, getStates, getCities, addAddress} from '../../helpers/addressHelper';
import { Link, useNavigate } from 'react-router-dom';
import $ from 'jquery';
const config = require("../../config/config");
export const Checkout = () => {
    
	const {setCartCount, cartItems, setCartItems, currentUser, setCurrentUser, cartFinalTotal, setCartFinalTotal, checkoutSavedAddresses, setCheckoutSavedAddresses, couponCode, setCouponCode, isCouponCodeApplied, setIsCouponCodeApplied, couponDiscountPercentages, setCouponDiscountPercentages, couponDiscount, setCouponDiscount, discountedPrice, setDiscountedPrice, discountAmount, setDiscountAmount, cartFinalWithoutShipping, setCartFinalWithoutShipping, setDiscountedPriceWithoutShipping } = useContext(GadgetBazaarContext);
    const [setName] = useState(null);
    const [selectedBillAddressId, setSelectedBillAddressId] = useState("");
    const [selectedShipAddressId, setSelectedShipAddressId] = useState("");
    const [selectedCountry, setSelectedCountry] = useState("");
    const [selectedState, setSelectedState] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);
    const [selectedShipCountry, setShipSelectedCountry] = useState("");
    const [selectedShipState, setShipSelectedState] = useState(null);
    const [selectedShipCity, setShipSelectedCity] = useState(null);
    const [country, setCountry] = useState('');
    const [state, setState] = useState('');
    const [city, setCity] = useState('');
    const [shipState, setShipState] = useState('');
    const [shipCity, setShipCity] = useState('');
    const [isShippingDifferent, setIsShippingDifferent] = useState(false);
    const [showSavedShippingAddressForm, setSavedShowShippingAddressForm] = useState(false);
    const navigate = useNavigate();

    const totalQty = useMemo(() => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    }, [cartItems]);
    useEffect(() => {
        document.body.classList.add("gadgetbazaar-checkout-page");
        const token = localStorage.getItem('auth-token');
        fetchCartItems(token).then((data) => {
            setCartItems(data['cartItems']);
            setCartFinalTotal(data['cartTotalAmount'])
            setCartFinalWithoutShipping((data['cartTotalAmount']) - 40)

            console.log(data['cart'][0].coupon_code);
            if(data['cart']){
                if(data['cart'][0].coupon_code){
                    fetchCouponFromId(token, data['cart'][0].coupon_code).then((data)=>{
                        if(data.coupon_code_found){
                            setIsCouponCodeApplied(true);
                            console.log("coupon data: ");
                            console.log(data.coupon_code);
                            let coupon_code_obj = data.coupon_code;
                            setCouponCode(coupon_code_obj.coupon_code); 
                            setCouponDiscountPercentages(coupon_code_obj.discount);
                            const discount = parseFloat(coupon_code_obj.discount) / 100;
                            setCouponDiscount(discount);
                            setDiscountAmount((cartFinalWithoutShipping * couponDiscount).toFixed(2));
                            const discountedamount = (cartFinalWithoutShipping - (cartFinalWithoutShipping * couponDiscount)).toFixed(2);
                            setDiscountedPriceWithoutShipping(discountedamount);
                            setDiscountedPrice((Number(discountedamount) + 40).toFixed(2));
                        }else{
                            setIsCouponCodeApplied(false);
                        }
                    });
                }
            }
        });
        try{
            fetchSavedAddresses(token).then((data) => {
                setCheckoutSavedAddresses(data);
            });
        }catch(err){
            console.log(err);
        }
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
      const handleCountryChange = (event, ship=false) => {
        console.log("Country changed")
        let selectedcountry = event.target.value;
        if(ship)
            setShipSelectedCountry(selectedcountry);
        else
            setSelectedCountry(selectedcountry);
        console.log(selectedcountry)
        getStates(selectedcountry).then((states)=>{
            console.log(states)
            if(ship)
                setShipState(states);
            else
                setState(states);
        });
      };
    
      const handleStateChange = (event, ship=false) => {
        let selectedstate = event.target.value;
        if(ship)
            setShipSelectedState(selectedstate);
        else
            setSelectedState(selectedstate);
        console.log(selectedCountry)
        console.log(selectedState)
        if(ship){
            getCities(selectedShipCountry,selectedstate).then((cities)=>{
                setShipCity(cities);
            });
        }
        else{
            getCities(selectedCountry,selectedstate).then((cities)=>{
                setCity(cities);
            });
        }
      };
      const handleCityChange = (event, ship=false) => {
        let selectedcity = event.target.value;
        if(ship)
            setShipSelectedCity(selectedcity);
        else
            setSelectedCity(selectedcity);
      };
      function handleSavedShipToDifferentAddressChange() {
        setSavedShowShippingAddressForm(!showSavedShippingAddressForm);
      }
      const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('auth-token');
        // get the form data
        const checkoutForm = document.getElementById("checkout_form");
        const formData = new FormData(checkoutForm);
      
        // variables
        const selectedBillingAddressId = formData.get('saved-address-billing');
        const selectedShippingAddressId = formData.get('saved-address-shipping');
        const isSelectedShippingDifferent = formData.get('saved-ship-to-different-address') === 'on';
        const is_manual_ship_diff = formData.get('is-ship-diff-address') === 'on';
        // store address data and id temporary in these variable and pass them in the api 
        let dataBillingAddress = "";
        let dataShippingAddress = "";
        let dataBillingAddressId = null;
        let dataShippingAddressId = null;

        // validations
        const elementsToValidate = [  "saved-address-billing",  "address_1",  "country",  "state",  "city",  "pincode",  ...(is_manual_ship_diff || (showSavedShippingAddressForm && selectedShipAddressId==="addNewAddress") ? ["address_1-2", "country-2", "state-2", "city-2", "pincode-2"] : [])
        ];
        let hasError = false;
        
        $.each(elementsToValidate, function(i, el) {
            const element = $("#" + el);
            if (!element.length) return true; // Skip if element doesn't exist
            let errorLabel = null;
            if (element.val() === "") {
                element.focus();
                errorLabel = element.nextAll('.error-label')[0];
                if (errorLabel && errorLabel.classList) {
                    if (el === "address_1" || el === "address_1-2" || el === "pincode" || el === "pincode-2"){
                        $(errorLabel).text(`Please enter ${element.data("label")}`);
                    } else {
                        $(errorLabel).text(`Please select ${element.data("label")}`);
                    }
                    $(errorLabel).css("display", "block");
                }
                hasError = true;
            }
            element.on("change input", function() {
                if (element.val() !== "") {
                    $(errorLabel).css("display", "none");
                    hasError = false;
                }
            });
        });
        
        if (hasError) {
            return;
        }
        // if address is selected from saved addresses
        console.log("selected billing addressid")
        console.log(selectedBillingAddressId)
        if(selectedBillingAddressId && selectedBillingAddressId !== "addNewAddress"){
            // set billingaddressid as selectedbillingaddressid
            dataBillingAddressId = selectedBillingAddressId;
            //if shipping address is different from the billing address and is selected from saved addresses
            if(isSelectedShippingDifferent){
                // set shippingaddressid as selectedshippingaddressid
                dataShippingAddressId = selectedShippingAddressId;
            }else{
                //If both are same them assign same values
                dataShippingAddressId = dataBillingAddressId;
            }
        }else{
            //If adress is not selected from saved addresses

            // get address data from form to the variables
            dataBillingAddress = {
                address_line_1: formData.get('address_1'),
                address_line_2: formData.get('address_2'),
                city: formData.get('city'),
                state: formData.get('state'),
                country: formData.get('country'),
                pincode: formData.get('pincode'),
                contact: formData.get('contact_address'),
            };
            //call addAddress api to save the address
            await addAddress(dataBillingAddress, token)
			.then(data => {
                console.log(data);
                if(data.ok){
                    console.log("data is ok");
                    if(data.address_id){
                        console.log("data found address");
                        dataBillingAddressId = data.address_id;
                    }
                }else{
                    alert("Something went wrong while adding billing address, please check entered data and try again!")
                    return false;
                }
			})
			.catch(error => {
				console.error('There was a problem with the fetch operation while adding billing address:', error);
			});
            //do same process if shipping address is different and is added manually
            if(is_manual_ship_diff || (showSavedShippingAddressForm && selectedShipAddressId==="addNewAddress")){
                dataShippingAddress = {
                    address_line_1: formData.get('address_1-2'),
                    address_line_2: formData.get('address_2-2'),
                    city: formData.get('city-2'),
                    state: formData.get('state-2'),
                    country: formData.get('country-2'),
                    pincode: formData.get('pincode-2'),
                    contact: formData.get('contact_address-2'),
                };
                await addAddress(dataShippingAddress, token)
                .then(data => {
                    if(data.ok){
                        console.log("data is ok");
                        if(data.address_id){
                            console.log("data found address");
                            dataShippingAddressId = data.address_id;
                        }
                    }else{
                        alert("Something went wrong while adding shipping address, please check entered data and try again!")
                        return false;
                    }
                })
                .catch(error => {
                    console.error('There was a problem with the fetch operation while adding shipping address:', error);
                });
            }
            else{
                // otherwise set it as same
                dataShippingAddressId = dataBillingAddressId;
            }
            
        }
        // calling checkout api
        try {
            let dataTotal = cartFinalTotal;
            if(isCouponCodeApplied)
                dataTotal = discountedPrice;
            const response = await fetch(`${config.checkoutUrl}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': `Bearer ${token}`
                },
                body: JSON.stringify({
                    shipping_address: dataShippingAddressId,
                    billing_address: dataBillingAddressId,
                    shipping_method: 'Default',
                    items: cartItems,
                    total: dataTotal
                }),
            });
            if (!response.ok) {
                throw new Error('Something went wrong in checkout api call');
            }
            const data = await response.json();
            console.log(data);
            // redirect to the order confirmation page
            if(data["orderDetails"]){
                localStorage.setItem('user_order', JSON.stringify({ orderId: data["orderDetails"]._id }));
                navigate('/order-confirmation');
            }else{
                alert("Something went wrong, Please try again");
                return false;
            }
        } catch (err) {
            console.error(err.message);
        }
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
            <div className="row">
                <div className="col-md-4 order-md-2 mb-4">
                    <h4 className="d-flex justify-content-between align-items-center mb-3">
                        <span className="text-muted">Your cart</span>
                        <span className="badge badge-secondary badge-pill">{cartItems.length}</span>
                    </h4>
                    {cartItems.length === 0 ? (
                        <p>No items in cart</p>
                    ) : (
                        <ul className="list-group mb-3 sticky-top checkout-items-container">
                              {cartItems.map((cartItem) => (
                            <li key={cartItem.product_id.id} className="list-group-item d-flex justify-content-between lh-condensed">
                                <div>
                                    <h6 className="my-0">{cartItem.product_id.name}</h6>
                                    <small className="text-muted">{cartItem.product_id.description}</small>
                                </div>
                                <span className="text-muted">&#8377;{cartItem.price * cartItem.quantity}</span>
                            </li>
                             ))}
                            {isCouponCodeApplied && (
                            <>
                                <li className="list-group-item d-flex justify-content-between bg-light">
                                    <div className="text-success">
                                        <h6 className="my-0">Promo code</h6>
                                        <small>{`${couponCode} (${couponDiscountPercentages}% Off)`}</small>
                                    </div>
                                    <span className="text-success">- &#8377;{discountAmount}</span>
                                </li>
                            </>
                            )}
                            <li className="list-group-item d-flex justify-content-between bg-light">
                                <div className="text-muted">
                                    <h6 className="my-0">Delivery Charges</h6>
                                    <small>Standard</small>
                                </div>
                                <span className="text-muted">+ &#8377;40.00</span>
                            </li>
                            <li className="list-group-item d-flex justify-content-between">
                                <span>Total</span>
                                <strong>&#8377;{isCouponCodeApplied ? discountedPrice : cartFinalTotal}</strong>
                            </li>
                        </ul>
                     )}
                </div>
               
                <div className="col-md-8 order-md-1">
                    <form id="checkout_form" className="needs-validation" noValidate="">
                    <div className="mb-3">
                        <label htmlFor="saved-address">Saved Addresses</label>
                        <select
                            className="custom-select d-block w-100"
                            id="saved-address-billing"
                            name="saved-address-billing"
                            value={selectedBillAddressId || ''}
                            onChange={(event) => setSelectedBillAddressId(event.target.value)}
                            data-label="saved address or add new address"
                        >
                            {checkoutSavedAddresses && checkoutSavedAddresses.length > 0 ? (
                                <>
                                    <option value="">Choose...</option>
                                    {checkoutSavedAddresses.map((address, index) => (
                                        <option key={index} value={address.id}>
                                            {address.address_line_1}, {address.address_line_2}, {address.city}, {address.state}, {address.pincode}, {address.country}
                                        </option>
                                    ))}
                                    <option value="addNewAddress">Add New Address</option>
                                </>
                            ) : (
                                <>
                                <option value="">No saved addresses found</option>
                                <option value="addNewAddress">Add New Address</option>
                                </>
                                
                            )}
                        </select>
                        <div className='error-label'></div>
                        {checkoutSavedAddresses && checkoutSavedAddresses.length > 0 ? (
                            <>
                                <div className='mt-2 mb-1 d-flex align-items-center'>
                                    <input type="checkbox" id="saved-ship-to-different-address" name="saved-ship-to-different-address" onChange={handleSavedShipToDifferentAddressChange} style={{width: "20px"}}/>
                                    <label htmlFor="saved-ship-to-different-address" className='ml-2'>Ship to a different address</label>
                                </div>
                            </>
                            ):
                            ("")
                        }
                        {showSavedShippingAddressForm &&  (
                            <>
                                <select
                                className="custom-select d-block w-100"
                                id="saved-address-shipping"
                                name="saved-address-shipping"
                                value={selectedShipAddressId || ''}
                                onChange={(event) => setSelectedShipAddressId(event.target.value)}
                                data-label="Saved address"
                                >
                                    {checkoutSavedAddresses && checkoutSavedAddresses.length > 0 ? (
                                        <>
                                    <option value="">Choose...</option>
                                    {checkoutSavedAddresses.map((address, index) => (
                                        <option key={index} value={address.id}>
                                            {address.address_line_1}, {address.address_line_2}, {address.city}, {address.state}, {address.pincode}, {address.country}
                                        </option>
                                    ))}
                                    <option value="addNewAddress">Add New Address</option>
                                    </>
                                    ): (
                                        <>
                                        <option value="">No saved addresses found</option>
                                        <option value="addNewAddress">Add New Address</option>
                                        </>
                                    )}
                                </select>
                            </>
                        )}
                    </div>
                        {selectedBillAddressId === 'addNewAddress' && (
                        <>
                            <div className='billing-address' id="billing_address">
                            <h4 className="mb-3">Billing address</h4>
                            <div className="mb-3">
                                <label htmlFor="name">Name</label>
                                <input type="text" className="form-control" id="name" name="name" onChange={(event) => setName(event.target.value)} value={currentUser ? currentUser.name : ""} required="" disabled={"disabled"} data-label="name"/>
                                <div className="error-label"> </div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="address_1">Address Line 1</label>
                                <input type="text" className="form-control" name="address_1" id="address_1" placeholder="1234 Main St" required="" data-label="address line 1"/>
                                <div className="error-label"></div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="address_2">Address Line 2 <span className="text-muted">(Optional)</span></label>
                                <input type="text" className="form-control" name="address_2" id="address_2" placeholder="Apartment or suite"  data-label="address line 2"/>
                            </div>
                            <div className="row">
                                <div className="col-md-4 mb-3">
                                    <label htmlFor="country">Country(^)</label>
                                    <select className="custom-select d-block w-100" name="country" id="country" required="" value={selectedCountry || ''} onChange={handleCountryChange} data-label="country">
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
                                    <div className="error-label"></div>
                                </div>
                                <div className="col-md-4 mb-3">
                                    <label htmlFor="state">State</label>
                                    <select
                                    className="custom-select d-block w-100"
                                    id="state" name="state"
                                    required=""
                                    onChange={handleStateChange}
                                    value={selectedState || ''}
                                    data-label="state"
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
                                    <div className="error-label"></div>
                                </div>
                                <div className="col-md-4 mb-3">
                                    <label htmlFor="city">City</label>
                                    <select className="custom-select d-block w-100" id="city" name="city" required=""  onChange={handleCityChange} value={selectedCity || ''} data-label="city">
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
                                    <div className="error-label"></div>
                                </div>
                                <div className="col-md-4 mb-3">
                                    <label htmlFor="pincode">Pincode</label>
                                    <input type="text" className="form-control" name="pincode" id="pincode" required="" data-label="pincode"/>
                                    <div className="error-label"></div>
                                </div>
                                <div className="col-md-4 mb-3">
                                    <label htmlFor="contact_address">Contact(Optional)</label>
                                    <input type="text" className="form-control" name="contact_address" id="contact_address" data-label="contact"/>
                                </div>
                            </div>
                            </div>
                            <div className='shipping-address' id="shipping_address" style={{ display: isShippingDifferent || (showSavedShippingAddressForm && selectedShipAddressId==="addNewAddress") ? "block" : "none" }}>
                            <h4 className="mb-3">Shipping address</h4>
                                <div className="mb-3">
                                    <label htmlFor="address_1-2">Address Line 1</label>
                                    <input type="text" className="form-control" name="address_1-2" id="address_1-2" placeholder="1234 Main St" required="" data-label="address line 1"/>
                                    <div className="error-label"></div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="address_2-2">Address Line 2 <span className="text-muted">(Optional)</span></label>
                                    <input type="text" className="form-control" id="address_2-2" name="address_2-2" placeholder="Apartment or suite" data-label="address line 2"/>
                                </div>
                                <div className="row">
                                    <div className="col-md-4 mb-3">
                                        <label htmlFor="country-2">Country(^)</label>
                                        <select className="custom-select d-block w-100" name="country-2" id="country-2" required="" value={selectedShipCountry || ''} onChange={event => handleCountryChange(event, true)} data-label="country">
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
                                        <div className="error-label"></div>
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label htmlFor="state-2">State</label>
                                        <select
                                        className="custom-select d-block w-100"
                                        id="state-2" name="state-2"
                                        required=""
                                        onChange={event => handleStateChange(event, true)}
                                        value={selectedShipState || ''}
                                        data-label="state"
                                        >
                                        <option value="">Choose...</option>
                                        {shipState && shipState.length > 0 ? (
                                            shipState.map((value, index) => (
                                            <option key={index} value={value.isoCode}>
                                                {value.name}
                                            </option>
                                            ))
                                        ) : (
                                            ""
                                        )}
                                        </select>
                                        <div className="error-label"></div>
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label htmlFor="city-2">City</label>
                                        <select className="custom-select d-block w-100" id="city-2" name="city-2" required=""  onChange={event => handleCityChange(event, true)} value={selectedShipCity || ''} data-label="city">
                                        <option value="">Choose...</option>
                                        {shipCity && shipCity.length > 0 ? (
                                            shipCity.map((value, index) => (
                                            <option key={index} value={value.name}>
                                                {value.name}
                                            </option>
                                            ))
                                        ) : (""
                                        )}
                                        </select>
                                        <div className="error-label"></div>
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label htmlFor="pincode-2">Pincode</label>
                                        <input type="text" className="form-control" name="pincode-2" id="pincode-2" required="" data-label="pincode"/>
                                        <div className="error-label"></div>
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label htmlFor="contact_address-2">Contact(Optional)</label>
                                        <input type="text" className="form-control" name="contact_address-2" id="contact_address-2" data-label="contact"/>
                                    </div>
                                </div>
                            </div>
                            <hr className="mb-4"/>
                            <div className="custom-control custom-checkbox">
                                <input type="checkbox" className="custom-control-input" id="is-ship-diff-address" name="is-ship-diff-address"
                                checked={isShippingDifferent}
                                onChange={(e) => setIsShippingDifferent(e.target.checked)}/>
                                <label className="custom-control-label" htmlFor="is-ship-diff-address">Shipping address is different from my billing address</label>
                            </div>
                            <div className="info-text mt-2">
                                <p className="alert alert-info">This information will be saved in your account</p>
                                <p>^ Currently Only India is Available as Selectable Country </p>
                            </div>
                        </>
                        )}
                        <hr className="mb-4"/>
                        <button className="btn btn-primary btn-lg btn-block" type="submit" onClick={handleSubmit}>Continue</button>
                    </form>
                </div>
            </div>
        </div>
    </>
  )
}
