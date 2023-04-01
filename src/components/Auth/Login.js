import React, { useState, useEffect  } from 'react';
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
const config = require('../../config/config');


const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
 
  useEffect(() => {
    // Checking if user is already logged in and then redirecting it to home if already logged in
    const checkUser = async () => {
      console.log("Check user is called inside login component")
      const token = localStorage.getItem('auth-token');
      console.log("Token in Login component");
      console.log(token);
      if (token) {
        console.log("token found");
        try {
          console.log("calling checkuser api");
          const response = await fetch(`${config.authAPIUrl}/checkuser`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
          });
          const data = await response.text();
          console.log("Data: ");
          console.log(data);
          if (response.ok) {
            console.log("repsonse.ok is true, printing data: ")
            console.log(data);
            navigate('/');
          } else {
            console.log("repsonse.ok is false, printing data: ")
            // handle unauthorized or other errors
            console.error(data);
          }
        } catch (error) {
          console.log("in catch found error:  ")
          console.error(error.message);
        }
      }
    }
   checkUser();
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
          'isadminattempt': false
        }),
      });
      const data = await response.json();
      if (response.ok) {
        console.log(data.authtoken);
        localStorage.setItem('auth-token', data.authtoken);
        // Redirect to protected page
        window.location.href = '/';
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
<div className="mask d-flex align-items-center h-100 gradient-custom-3">
  <div className="container h-100 pb-5 pt-5">
    <div className="row d-flex justify-content-center align-items-center h-100">
      <div className="col-12 col-md-9 col-lg-7 col-xl-6">
        <div className="card" style={{borderRadius: "15px"}}>
          <div className="card-body p-5">
            <h2 className="text-uppercase text-center mb-4">Login</h2>

          
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
              <button type="submit" className="btn btn-primary btn-block">
                Login
              </button>
            </form>
            <p className="text-center text-muted mt-4 mb-0">Don't Have an account? <Link to="/register"
                    className="fw-bold text-body"><u>Register here</u></Link></p>
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

export default Login;
