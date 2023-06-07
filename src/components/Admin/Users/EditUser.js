import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminMainAPIUrl } from '../../../config/config';
import { addNeccessaryClasses, getUserRoleValues } from '../../../helpers/adminHelper';
import { updateLoader } from '../../../helpers/generalHelper';
import { setPageTitle } from '../../../helpers/titleHelper';

function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isUser, setIsUser] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [role, setRole] = useState('');
  const [roleValues, setRoleValues] = useState('');
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState([]);
  const [isUserActive, setIsUserActive] = useState(false);
  async function fetchUser() {
    const response = await fetch(`${adminMainAPIUrl}/users/get/${id}`);
    const data = await response.json();
    setIsUser(true);
    setName(data.name);
    setEmail(data.email);
    setContact(data.contact || '');
    setRole(data.role || '');
    if(data.is_active){
        setIsUserActive(true);
    }else{
        setIsUserActive(false)
    }
  }
  useEffect(() => {
    
    const fetchUserRoleOptions = async () =>{
        await getUserRoleValues().then(
          (data)=>{
            if(data.success === true){
                setRoleValues(data.userRolesOptions)
            }else{
                if(data.errors){
                    setErrors(data.errors)
                }
            }
          }
        )
      }
    fetchUser();
    fetchUserRoleOptions();
    addNeccessaryClasses();
  }, [id]);

  const handleUpdateUser = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    console.log(name)
    console.log(email)
    console.log(contact)
    console.log(role)
    formData.append('name', name);
    formData.append('email', email);
    formData.append('contact', contact);
    formData.append('role', role);
    formData.append('is_active', isUserActive);
    updateLoader(true);
    fetch(`${adminMainAPIUrl}/users/edit/${id}`, {
    method: 'PUT',
    body: formData,
    })
    .then((response) => response.json())
    .then((data) => {
        if (data.errors) {
        setErrors(data.errors);
        }
        if(data.success){
            setMessage(data.success)
        }
    })
    .catch((error) => {
        console.error(error);
        setMessage("")
    });
    setTimeout(async() => {
        await fetchUser();
    }, 1000);
    updateLoader(false);
    setIsUser(true);
    };
  return (
    <div className='content'>
      {setPageTitle("Edit User")}
      <h2>Edit User</h2>
      {isUser ? (
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
          <button type='button' onClick={handleUpdateUser}>Update</button>
        </form>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
}

export default EditUser;
