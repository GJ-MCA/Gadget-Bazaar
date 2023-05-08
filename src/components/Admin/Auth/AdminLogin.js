import React, { useState, useEffect  } from 'react';
import { Link, useNavigate } from "react-router-dom";
const config = require('../../../config/config');


const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
 
  useEffect(() => {
    // Checking if user is already logged in and then redirecting it to home if already logged in
    const checkAdmin = async () => {
      const token = localStorage.getItem('auth-token');
      if (token) {
        try {
          const response = await fetch(`${config.authAPIUrl}/checkuser`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
          });
          const data = await response.text();
          if (response.ok) {
            navigate('/');
          } else {
            // handle unauthorized or other errors
            console.error(data);
          }
        } catch (error) {
          console.error(error.message);
        }
      }
    }
   checkAdmin();
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`${config.authAPIUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          'isadminattempt': true
        }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('auth-token', data.authtoken);
        // Redirect to protected page
        window.location.href = `${config.adminBaseUrl}/dashboard`;
      } else {
        setErrorMessage(data.error);
      }
    } catch (error) {
      console.error(error.message);
      setErrorMessage('Internal Server Error');
    }
  };

  return (
    <>
    <section className="bg-image"
style={{backgroundImage: "url('https://mdbcdn.b-cdn.net/img/Photos/new-templates/search-box/img4.webp')"}}>
<div className="mask d-flex align-items-center gradient-custom-3 admin-login-page">
  <div className="container h-100 pb-5 pt-5">
    <div className="row d-flex justify-content-center align-items-center h-100">
      <div className="col-12 col-md-9 col-lg-7 col-xl-6">
        <div className="card" style={{borderRadius: "15px"}}>
          <div className="card-body p-5">
            <h2 className="text-uppercase text-center mb-4">Gadgetbazaar Admin</h2>

          
              <form onSubmit={handleSubmit}>
              {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-control"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="form-control"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </div>
              <p className="text-muted mt-4 mb-2"><Link to={config.adminBaseUrl+"/auth/forgotpassword"}
                    className="fw-bold text-body"><u>Forgot Password?</u></Link></p>
              <button type="submit" className="btn btn-primary btn-block">
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</section>
  </>
  );
};

export default AdminLogin;
