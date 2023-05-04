import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
const config = require("../../config/config");

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const { token } = useParams();
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }
    try{
      const response = fetch(`${config.authAPIUrl}/resetpassword/${token}`, {
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
          }
          if(data.success)
            setMessage(data.success);
        }
        setTimeout(() => {
          navigate("/login");
        }, 5000);
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
      <div className="row justify-content-center">
        <div className="col-md-6 mt-5 mb-5">
        {message && <p className={`alert ${message.includes("not") || message.includes("Please") || message.includes("Invalid") ? "alert-danger":"alert-success"}`}>{message}</p>}
          <div className="card">
            <div className="card-header">Reset Password</div>
            <div className="card-body">
             
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>
                    New Password:
                  </label>
                    <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />

                  <label>
                    Confirm Password:
                  </label>
                    <input type="password" className="form-control" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
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
