import React from 'react';
import { Link } from 'react-router-dom';
import { setPageTitle } from '../helpers/titleHelper';

const NotFound = () => {
  return (
    <div className="container my-5">
      {setPageTitle("Page Not Found")}
      <div className="row">
        <div className="col-md-6 mx-auto text-center">
          <img src="/assets/img/error-404.png" width={"50%"} alt="Not Found"/>
          <p className="lead mb-4">Oops! Page not found.</p>
          <Link to="/" className="btn custom-button">Go to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
