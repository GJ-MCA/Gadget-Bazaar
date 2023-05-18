import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateLoader } from '../../helpers/generalHelper';
import { getAdminUserProfile, updateAdminUserProfile } from '../../helpers/adminHelper';

const AdminProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isMobileVerified, setIsMobileVerified] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isMobileOTPSent, setIsMobileOTPSent] = useState(false);
  const [isEmailOTPSent, setIsEmailOTPSent] = useState(false);
  const [mobileOTP, setMobileOTP] = useState('');
  const [emailOTP, setEmailOTP] = useState('');
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('auth-token');
  const config = require("../../config/config")
  useEffect(() => {
    getAdminUserProfile(token)
      .then((data) => {
        console.log(data);
        if (data.errors) {
          setErrors(data.errors);
          setMessage("")
        }
        if(data.success){
            setMessage(data.success)
            setErrors("")
        }
        if(data.name){
          setName(data.name);
        }
        if(data.contact){
          setContact(data.contact);
        }
        if(data.email){
          setEmail(data.email);
        }
        if(data.is_mobile_verified){
          setIsMobileVerified(data.is_mobile_verified);
        }
      })
      .catch((err) => console.log(err));
  }, [token]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setName(name);
    setContact(contact);
    setEmail(email);
  };

  const handleSaveClick = (e) => {
    e.preventDefault();
    const updatedProfile = {
      name,
      contact,
      email,
      password,
    };
    if(password !== confirmPassword){
      alert("Password and Confirm Password Did not match!")
      return false;
    }
    updateAdminUserProfile(token, updatedProfile)
      .then((data) => {
        if (data.errors) {
          setErrors(data.errors);
          setMessage("")
        }
        if(data.success){
            setMessage(data.success)
            setErrors("")
            setIsEditing(false);
        }
        
        setName(name);
        setContact(contact);
        setEmail(email);
        setPassword('');
        setConfirmPassword('');
      })
      .catch((err) => {
        setErrors(err);
        setMessage("")
        console.log(err)
      });
  };

  const handleLogoutClick = () => {
    localStorage.removeItem('auth-token');
    navigate('/login');
  };
  const handleMobileVerifyClick = () => {
    // Call the API to verify the opt
    const token = localStorage.getItem("auth-token");
   if(!mobileOTP){
    alert("Please enter otp!")
   }
   else{
    updateLoader(true);
    fetch(config.authAPIUrl+"/contact/verifyotp/"+mobileOTP,
    {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'auth-token': `Bearer ${token}`
      },
    }) .then(response => {
      if (response.ok) {
        console.log(response)
        return response.json();
      } else {
        setErrors("Unable to verify the OTP, Please Try Again!")
      }
    })
      .then((data) => {
        console.log(data)
        if (data.errors) {
          setIsMobileOTPSent(true);
          setErrors(data.errors);
          setMessage("")
        }
        if(data.success){
            setMessage(data.success)
            setErrors("")
            setIsMobileVerified(true);
            setIsMobileOTPSent(false);
        }
      })
      .catch((err) => {
        setErrors(err);
        setMessage("")
        console.log(err)
      });
      updateLoader(false);
   }
  }
  const sendMobileOTP = ()=>{
    const token = localStorage.getItem("auth-token");
    updateLoader(true);
    fetch(config.authAPIUrl+"/sendMobileVerificationMessage",{
      method: "POST",   
      headers: {
        'Content-Type': 'application/json',
        'auth-token': `Bearer ${token}`
      },
    })
      .then(response => {
        if (response.ok) {
          console.log(response)
          return response.json();
        } else {
          setErrors("Unable to send the OTP, Please Try Again Later!")
        }
      })
      .then(data => {
        if(data){
          if(data.Message.includes("Successfully")){
            setIsMobileOTPSent(true);
          }else{
            setIsMobileOTPSent(false);
          }
        }
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
        setIsMobileOTPSent(false);
      });
      updateLoader(false);
  }
  const handleEmailVerifyClick = () => {
    // Call the API to verify the opt
    const token = localStorage.getItem("auth-token");
   if(!emailOTP){
    alert("Please enter otp!")
   }
   else{
    updateLoader(true);
    fetch(config.authAPIUrl+"/email/verifyotp/"+emailOTP,
    {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'auth-token': `Bearer ${token}`
      },
    }) .then(response => {
      if (response.ok) {
        console.log(response)
        return response.json();
      } else {
        setErrors("Unable to verify the OTP, Please Try Again!")
      }
    })
    .then((data) => {
      console.log(data)
      if (data.errors) {
        setIsEmailOTPSent(true);
        setErrors(data.errors);
        setMessage("")
      }
      if(data.success){
          setMessage(data.success)
          setErrors("")
          setIsMobileVerified(true);
          setIsEmailOTPSent(false);
      }
    })
    .catch((err) => {
      setErrors(err);
      setMessage("")
      console.log(err)
    });
    updateLoader(false);
   }
  }
  const sendEmailOTP = ()=>{
    const token = localStorage.getItem("auth-token");
    updateLoader(true);
    fetch(config.authAPIUrl+"/sendEmailVerificationMessage",{
      method: "POST",   
      headers: {
        'Content-Type': 'application/json',
        'auth-token': `Bearer ${token}`
      },
    })
    .then(response => {
      if (response.ok) {
        console.log(response)
        return response.json();
      } else {
        setErrors("Unable to send the OTP, Please Try Again Later!")
      }
    })
    .then(data => {
      if(data){
        if(data.success){
          setMessage(data.success)
          setErrors("")
          setIsEmailOTPSent(true);
        }else{
          setMessage("");
          setErrors(data.errors);
          setIsEmailOTPSent(false)
        }
      }
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
      setIsEmailOTPSent(false);
    });
    updateLoader(false);
  }
  return (
    <>
      <div className="content bootstrap snippet">
        <div className="row">
          <div className="col-sm-10">
            <h1
              style={{
                textAlign: 'center',
                fontSize: '2rem',
                fontWeight: 'bold',
                margin: '0',
                fontFamily:
                  '-apple-system, BlinkMacSystemFont,Segoe UI, Roboto, Oxygen,Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',
              }}
            >
              My Profile <br />
              <span
                className="d-inline-block"
                style={{
                  fontSize: '1.5rem',
                  borderTop: '2px dashed grey',
                  marginTop: '5px',
                  paddingTop: '5px',
                }}
              >
                {name}
              </span>
            </h1>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <div className="main-container">
                <div className="inner-container">
                      <hr />
                      <form className="form" onSubmit={handleSaveClick}>
                      {message && (
                          <div className='alert alert-success'>
                              {message}
                          </div>
                      )}
                      {errors.length > 0 && (
                          <div className="alert alert-danger">
                              <ul style={{paddingLeft: "15px", marginBottom: "0"}}>
                              {errors.map((error, index) => (
                                  <li key={index}>{error.msg}</li>
                              ))}
                              </ul>
                          </div>
                      )}
                            <div className="form-group">
                              <div className="col-xs-6">
                                <label htmlFor="name">
                                  <h5 className='mb-0'>Name</h5>
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  name="name"
                                  id="name"
                                  placeholder="Name"
                                  title="Enter your name"
                                  value={name}
                                  onChange={(e) => setName(e.target.value)}
                                  disabled={!isEditing}
                                />
                              </div>
                            </div>
                            <div className="form-group">
                              <div className="col-xs-6">
                                <label htmlFor="email">
                                  <h5 className='mb-0'>Email</h5>
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  name="email"
                                  id="email"
                                  placeholder="Email"
                                  title="Enter your email"
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                                  disabled={!isEditing}
                                />
                              </div>
                              {isEmailVerified !== true && (
                                <button
                                type="button"
                                className="btn btn-primary"
                                onClick={sendEmailOTP}
                                >
                                Send OTP
                                </button>
                              )}
                            </div>
                            {isEmailOTPSent && (
                              <div className="form-group">
                                  <div className="col-xs-6">
                                  <label htmlFor="email_otp">
                                    <h5 className='mb-0'>Enter Email OTP</h5>
                                    </label>
                                      <input
                                        type="text"
                                        className="form-control"
                                        name="email_otp"
                                        id="email_otp"
                                        placeholder="Enter email otp number"
                                        title="Enter your email otp number"
                                        value={emailOTP}
                                        onChange={(e) => setEmailOTP(e.target.value)}
                                      />
                                  </div>
                                  <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleEmailVerifyClick}
                                  >
                                    Verify Email OTP
                                  </button>
                              </div>
                            )}
                            <div className="form-group">
                              <div className="col-xs-6">
                              <label htmlFor="contact">
                                <h5 className='mb-0'>Contact</h5>
                                </label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="contact"
                                    id="contact"
                                    placeholder="Enter contact number"
                                    title="Enter your contact number"
                                    value={contact}
                                    onChange={(e) => setContact(e.target.value)}
                                    disabled={!isEditing}
                                  />
                              </div>
                              {isMobileVerified !== true && (

                                <button
                                type="button"
                                className="btn btn-primary"
                                onClick={sendMobileOTP}
                                >
                                Send OTP
                              </button>
                              )}
                            </div>
                            {isMobileOTPSent && (
                              <div className="form-group">
                                  <div className="col-xs-6">
                                  <label htmlFor="mobile_otp">
                                    <h5 className='mb-0'>Enter Contact OTP</h5>
                                    </label>
                                      <input
                                        type="text"
                                        className="form-control"
                                        name="mobile_otp"
                                        id="mobile_otp"
                                        placeholder="Enter otp number"
                                        title="Enter your otp number"
                                        value={mobileOTP}
                                        onChange={(e) => setMobileOTP(e.target.value)}
                                      />
                                  </div>
                                  <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleMobileVerifyClick}
                                  >
                                    Verify Contact OTP
                                  </button>
                              </div>
                            )}
                          
                            <div className="form-group">
                              <div className="col-xs-6">
                              <label htmlFor="password">
                                <h5 className='mb-0'>Password</h5>
                                </label>
                                  <input
                                    type="password"
                                    className="form-control"
                                    name="password"
                                    id="password"
                                    placeholder="Password"
                                    title="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={!isEditing}
                                  />
                              </div>
                            </div>
                            <div className="form-group">
                              <div className="col-xs-6">
                              <label htmlFor="confirmpassword">
                                <h5 className='mb-0'>Confirm Password</h5>
                                </label>
                                  <input
                                    type="password"
                                    className="form-control"
                                    name="confirmpassword"
                                    id="confirmpassword"
                                    placeholder="Confirm Password"
                                    title="Confirm Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    disabled={!isEditing}
                                  />
                              </div>
                            </div>
                            <div className="form-group">
                                <div className="col-xs-12">
                                  <br />
                                  {isEditing ? (
                                    <>
                                      <button
                                        className="btn mr-2"
                                        onClick={handleSaveClick}
                                        type="button"
                                      >
                                        <i className="glyphicon glyphicon-ok-sign"></i>{' '}
                                        Save
                                      </button>
                                      <button
                                        className="btn"
                                        onClick={handleCancelClick}
                                        type="button"
                                      >
                                        <i className="glyphicon glyphicon-repeat"></i>{' '}
                                        Cancel
                                      </button>
                                    </>
                                  ) : (
                                    <>
                                      <button
                                        className="btn mr-2"
                                        onClick={handleEditClick}
                                        type="button"
                                      >
                                        <i className="glyphicon glyphicon-edit"></i>{' '}
                                        Edit
                                      </button>
                                      <button
                                        className="btn"
                                        onClick={handleLogoutClick}
                                        type="button"
                                      >
                                        <i className="glyphicon glyphicon-log-out"></i>{' '}
                                        Logout
                                      </button>
                                    </>
                                  )}
                                </div>
                            </div>
                      </form>
                      <hr />
                </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminProfile;

                       
