import React, { createContext, useState } from 'react';

export const GadgetBazaarContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [shippingMethods, setShippingMethods] = useState(null);
  const [cartFinalTotal, setCartFinalTotal] = useState(null);
  const [checkoutSavedAddresses, setCheckoutSavedAddresses] = useState([]);
  return (
    <GadgetBazaarContext.Provider value={{ cartCount, setCartCount, cartItems, setCartItems, currentUser, setCurrentUser, shippingMethods, setShippingMethods, cartFinalTotal, setCartFinalTotal, checkoutSavedAddresses, setCheckoutSavedAddresses }}>
      {children}
    </GadgetBazaarContext.Provider>
  );
};
