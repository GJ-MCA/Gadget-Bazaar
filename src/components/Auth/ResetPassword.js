import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { updateLoader } from '../../helpers/generalHelper';
import { setPageTitle } from '../../helpers/titleHelper';
const config = require("../../config/config");

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState([]);
  const { token } = useParams();
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }
    try{
      updateLoader(true);
      fetch(`${config.authAPIUrl}/resetpassword/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      })
      .then((response) => response.json())
      .then((data) => {
        if(data){
          if(data.error_message){
            setMessage(data.error_message)
            if(!data.errors)
              setErrors([])
          }
          if(data.success){
            setMessage(data.success);
            setErrors([])
            setTimeout(() => {
              navigate("/login");
            }, 5000);
          }
          if(data.errors){
            setErrors(data.errors);
            if(!data.error_message || !data.success)
              setMessage("");
          }
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setMessage(error);
      });
    }catch(err){
      console.log(err);
    }
  };

  return (
    <div className="container">
      {setPageTitle("Reset Password")}
      <div className="row justify-content-center">
        <div className="col-md-6 mt-5 mb-5">
        {errors.length > 0 && (
          <div className="alert alert-danger">
            <ul>
              {errors.map((error, index) => (
                <li key={index}>{error.msg}</li>
              ))}
            </ul>
          </div>
        )}
        {message && <p className={`alert ${message.includes("not") || message.includes("Please") || message.includes("Invalid") ? "alert-danger":"alert-success"}`}>{message}</p>}
          <div className="card">
            <div className="card-header">Reset Password</div>
            <div className="card-body">
             
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>
                    New Password:
                  </label>
                    <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required/>

                  <label>
                    Confirm Password:
                  </label>
                    <input type="password" className="form-control" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required/>
                </div>
                <button type="submit" className="btn btn-primary">
                  Reset Password
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
