import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";     
import { Link } from 'react-router-dom';
const config = require("../../config/config");


function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    // Checking if user is already logged in and then redirecting it to home if already logged in
    const checkUser = async () => {
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
            console.log(data);
            navigate('/');
          } else {
            console.error(data);
          }
        } catch (error) {
          console.error(error.message);
        }
      }
    }
   checkUser();
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await fetch(`${config.authAPIUrl}/createuser`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await response.json();
    if (response.ok) {
      localStorage.setItem('auth-token', data.authtoken);
      window.location.href = '/';
    } else {
      setErrors(data.errors);
    }
  }

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
              <h2 className="text-uppercase text-center mb-5">Create an account</h2>

              <form onSubmit={handleSubmit}>

                {errors.length > 0 && (
                  <div className="alert alert-danger">
                    <ul>
                      {errors.map((error, index) => (
                        <li key={index}>{error.msg}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="form-outline mb-4">
                  <label className="form-label" for="name">Your Name</label>
                  <input type="text" id="name" name="name" className="form-control " value={name} onChange={(event) => setName(event.target.value)} />
                </div>

                <div className="form-outline mb-4">
                  <label className="form-label" for="email">Your Email</label>
                  <input type="email" id="email" name="email" className="form-control " value={email} onChange={(event) => setEmail(event.target.value)} />
                </div>

                <div className="form-outline mb-4">
                  <label className="form-label" for="password">Password</label>
                  <input type="password" id="password" name="password" className="form-control " value={password} onChange={(event) => setPassword(event.target.value)} />
                </div>

                <div className="form-check d-flex justify-content-center" style={{alignItems: "center",marginTop: "20px", marginBottom: "20px"}}>
                  <input className="form-check-input me-2" type="checkbox" value="" id="terms_service" style={{position: "static", width: "30px", margin: "0"}}/>
                  <label className="form-check-label" for="terms_service">
                    I agree all statements in <Link to="/terms-service" className="text-body"><u>Terms of service</u></Link>
                  </label>
                </div>

                <div className="d-flex justify-content-center">
                  <button type="submit"
                    className="btn btn-success btn-block btn-lg gradient-custom-4">Submit</button>
                </div>

                <p className="text-center text-muted mt-4 mb-0">Have already an account? <Link to="/login"
                    className="fw-bold text-body"><u>Login here</u></Link></p>

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
}

export default Register;
