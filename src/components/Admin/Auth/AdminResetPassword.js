import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
const config = require("../../../config/config");

const AdminResetPassword = () => {
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
          }
          if(data.success)
            setMessage(data.success);
        }
        setTimeout(() => {
          navigate(`${config.adminBaseUrl}/auth/login`);
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
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">Reset Password</div>
            <div className="card-body">
              {message && <p>{message}</p>}
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>
                    New Password:
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                  </label>

                  <label>
                    Confirm Password:
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                  </label>
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

export default AdminResetPassword;
