import React, { useState, useEffect  } from 'react';
import { useNavigate } from "react-router-dom";
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
    <div className="container">
      <div className="row mt-5">
        <div className="col-md-6 m-auto">
          <div className="card card-body">
            <h1 className="text-center mb-3">
              <i className="fas fa-sign-in-alt"></i> Login
            </h1>
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-control"
                  placeholder="Enter email"
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
                  placeholder="Enter password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary btn-block">
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
