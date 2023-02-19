import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";     
const config = require("../../config/config");


function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [contact, setContact] = useState('');
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('auth-token');
    if (token) {
      navigate('/');
    }
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await fetch(`${config.authAPIUrl}/createuser`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, contact })
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
    <div className="container mt-3">
      <h1>Register</h1>
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
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input type="text" className="form-control" id="name" value={name} onChange={(event) => setName(event.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email address</label>
          <input type="email" className="form-control" id="email" value={email} onChange={(event) => setEmail(event.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" className="form-control" id="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="contact">Contact</label>
          <input type="text" className="form-control" id="contact" value={contact} onChange={(event) => setContact(event.target.value)} />
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
}

export default Register;
