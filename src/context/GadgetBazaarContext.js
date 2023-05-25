import React, { createContext, useState } from 'react';

export const GadgetBazaarContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [shippingMethods, setShippingMethods] = useState(null);
  const [cartFinalTotal, setCartFinalTotal] = useState(null);
  const [cartFinalWithoutShipping, setCartFinalWithoutShipping] = useState(0); //Remove shipping charge from cartFinalTotal
  const [checkoutSavedAddresses, setCheckoutSavedAddresses] = useState([]);
  const [couponCode, setCouponCode] = useState(''); //Coupon Code
  const [couponCodeMessage, setCouponCodeMessage] = useState(''); //Validation Message
  const [isCouponCodeApplied, setIsCouponCodeApplied] = useState(false); //Boolean Value to Check if Coupon Code is Applied or Not
  const [couponDiscountPercentages, setCouponDiscountPercentages] = useState(0); //Discount Percentages
  const [couponDiscount, setCouponDiscount] = useState(0); //Discount value with / 100, i.e., percentages/100 = 10 / 100 = 0.1
  const [discountedPrice, setDiscountedPrice] = useState(0); //Final Price After Discount
  const [discountedPriceWithoutShipping, setDiscountedPriceWithoutShipping] = useState(0); //Discounted price without shipping
  const [discountAmount, setDiscountAmount] = useState(0)//Actual amount of discount which will be decreased from the final before discount
  const [checkoutMainTotal, setCheckoutMainTotal] = useState(0)//Actual amount of discount which will be decreased from the final before discount
  
  return (
    <GadgetBazaarContext.Provider value={{ cartCount, setCartCount, cartItems, setCartItems, currentUser, setCurrentUser, shippingMethods, setShippingMethods, cartFinalTotal, setCartFinalTotal, checkoutSavedAddresses, setCheckoutSavedAddresses, couponCode, setCouponCode, couponCodeMessage, setCouponCodeMessage, isCouponCodeApplied, setIsCouponCodeApplied, couponDiscountPercentages, setCouponDiscountPercentages, couponDiscount, setCouponDiscount, discountedPrice, setDiscountedPrice, discountAmount, setDiscountAmount, cartFinalWithoutShipping, setCartFinalWithoutShipping, discountedPriceWithoutShipping, setDiscountedPriceWithoutShipping, checkoutMainTotal, setCheckoutMainTotal }}>
      {children}
    </GadgetBazaarContext.Provider>
  );
};
