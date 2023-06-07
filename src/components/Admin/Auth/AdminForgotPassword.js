import React, { useState } from 'react';
import { updateLoader } from '../../../helpers/generalHelper';
import { setPageTitle } from '../../../helpers/titleHelper';
const config = require("../../../config/config");
const AdminForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();

    try{
      updateLoader(true);
      fetch(`${config.authAPIUrl}/forgotpassword`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, isadminattempt: true }),
      })
        .then((response) => response.json())
        .then((data) => {
          if(data){
            console.log(data)
            if(data.nouser){
              console.log(data.nouser)
              setMessage("User not found with the entered email!")
            }
            if(data.success){
              setMessage(data.success);
            }
            if(data.error_message){
              setMessage(data.error_message)
            }
          }
          updateLoader(false);
        })
        .catch((error) => {
          console.error('Error:', error);
      });
    }catch(err){
      console.log(err);
    }
  };

  return (
    <section className="bg-image"
    style={{backgroundImage: "url('https://mdbcdn.b-cdn.net/img/Photos/new-templates/search-box/img4.webp')"}}>
      {setPageTitle("Forgot Password")}
      <div className="mask d-flex align-items-center gradient-custom-3 admin-login-page">
        <div className="container mb-5" style={{marginTop: "104px"}}>
          <div className="row justify-content-center">
            <div className="col-md-6 mt-5 mb-5">
            {message && <p className={`alert ${message.includes("not") || message.includes("No") || message.includes("Please") ? "alert-danger":"alert-success"}`}>{message}</p>}
              <div className="card">
                <div className="card-header">Forgot Password</div>
                <div className="card-body">
                  <form onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label htmlFor="email">Email address</label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
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
      </div>
    </section>
  );
};

export default AdminForgotPassword;
