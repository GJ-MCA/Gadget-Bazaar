import React, { createContext, useState } from 'react';

export const GadgetBazaarContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);

  return (
    <GadgetBazaarContext.Provider value={{ cartCount, setCartCount }}>
      {children}
    </GadgetBazaarContext.Provider>
  );
};
