import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminMainAPIUrl } from '../../../config/config';
import { addNeccessaryClasses, getUserRoleValues } from '../../../helpers/adminHelper';
import { updateLoader } from '../../../helpers/generalHelper';

function AddUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [contact, setContact] = useState('');
  const [role, setRole] = useState('');
  const [roleValues, setRoleValues] = useState('');
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState([]);
  const [isUserActive, setIsUserActive] = useState(false);
  useEffect(() => {
    
    const fetchUserRoleOptions = async () =>{
        await getUserRoleValues().then(
          (data)=>{
            if(data.success === true){
                setRoleValues(data.userRolesOptions)
                setRole(data.userRolesOptions[0])
            }else{
                if(data.errors){
                    setErrors(data.errors)
                }
            }
          }
        )
      }
    fetchUserRoleOptions();
    addNeccessaryClasses();
  }, []);

  const handleAddUser = async (event) => {
    event.preventDefault();
    console.log(role)
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('contact', contact);
    formData.append('role', role);
    formData.append('is_active', isUserActive);
    console.log(formData.get("role"))
    updateLoader(true);
    fetch(`${adminMainAPIUrl}/users/add`, {
    method: 'POST',
    body: formData,
    })
    .then((response) => response.json())
    .then((data) => {
        if (data.errors) {
        setErrors(data.errors);
        }
        if(data.success){
            setMessage(data.success)
            setErrors([])
            setName('')
            setEmail('')
            setPassword('')
            setContact('')
            setRole(roleValues[0])
            setIsUserActive(false)
        }
    })
    .catch((error) => {
        console.error(error);
        setMessage("")
    });
    updateLoader(false);
    };
  return (
    <div className='content'>
      <h2>Add User</h2>
        <form className='admin-form'>
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
          <div>
            <label htmlFor='name'>Name:</label>
            <input
            className='form-control'
              type='text'
              id='name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor='email'>Email:</label>
            <input
            className='form-control'
              type='email'
              id='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-outline mb-4">
                  <label className="form-label" htmlFor="password">Password</label>
                  <input type="password" id="password" name="password" className="form-control " value={password} onChange={(event) => setPassword(event.target.value)} />
                </div>
          <div>
            <label htmlFor='contact'>Contact:</label>
            <input
            className='form-control'
              type='text'
              id='contact'
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />
          </div>
          <div className='dropdown-container form-control mt-4'>
            <label htmlFor='role' style={{fontSize: "1rem", color: "#000", marginBottom: "0"}}> Role:  </label>
            <select className='ml-2' style={{textTransform: "capitalize"}} id="role" name='role' value={role || ""}  onChange={(e) => setRole(e.target.value)}>
            {roleValues && roleValues.map(option => (
                <option key={option} value={option}>{option}</option>
            ))}
            </select>
          </div>
          <div className='checkbox-container'>
            <label htmlFor="is_active">Active:</label>
            <input type="checkbox" id="is_active" name="is_active" checked={isUserActive} onChange={(e) => setIsUserActive(e.target.checked)} />
        </div>
          <button type='button' onClick={handleAddUser}>Submit</button>
        </form>
    </div>
  );
}

export default AddUser;
