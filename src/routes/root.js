import { Outlet, useLocation  } from "react-router-dom";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import React, { useEffect, useState } from "react";
const config = require("../config/config");

export default function Root() {

    const [user, setUser] = useState(null);
    const location = useLocation();

    useEffect(() => {
      const token = localStorage.getItem('auth-token');
      if(token)
      {
        fetch(`${config.authAPIUrl}/getuser`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            'auth-token': `Bearer ${token}`
          },
        })
          .then((response) => response.json())
          .then((data) => setUser(data))
          .catch((error) => console.log(error));
      }
    }, []);
    const isAdminPage = location.pathname.startsWith("/gadgetbazaar/admin");
    return (
      <>
         {isAdminPage || (user && user.role) === 'admin' ? null : (
        <div className="loader-outer" id="gadgetbazaar_loader">
          <div className="gadgetbazaar-loader-container">
          <div className="gadgetbazaar-loader">
            <img src="/assets/img/loader.gif" alt="Loader"/>
            <p> Gadgetbazaar Loading </p>
          </div>
        </div> 
        </div>    
        )}
        {isAdminPage || (user && user.role) === 'admin' ? null : <Header />}
          <Outlet />
        {isAdminPage || (user && user.role) === 'admin' ? null : <Footer />}
      </>
    );
  }