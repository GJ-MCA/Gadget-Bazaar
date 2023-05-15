import React, { useEffect, useState } from 'react';
import { adminProductAPIUrl } from '../../../../config/config';
import { useNavigate } from 'react-router-dom';
import { addNeccessaryClasses, adminFrontSpecificationsPostFix } from '../../../../helpers/adminHelper';
import { updateLoader } from '../../../../helpers/generalHelper';

function AddSpecification() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [is_active, setIsActive] = useState(true);
  const navigate = useNavigate();
  const [errors, setErrors] = useState([]);
  
    useEffect(() => {
        addNeccessaryClasses();
    }, [])
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('is_active', is_active);

    try {
      updateLoader(true);
      const response = await fetch(`${adminProductAPIUrl}/specifications/add`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      console.log(data);
      if(!response.ok){
        setErrors(data.errors)
      }
      navigate(adminFrontSpecificationsPostFix);
    } catch (error) {
      console.log(error);
    }
    updateLoader(false);
  };

  return (
    <div className='content'>
      <h2>Add Specification</h2>
      <form className='admin-form'>
      {errors.length > 0 && (
                  <div className="alert alert-danger">
                    <ul style={{paddingLeft: "15px", marginBottom: "0"}}>
                      {errors.map((error, index) => (
                        <li key={index}>{error.msg}</li>
                      ))}
                    </ul>
                  </div>
                )}
        <div className='form-inner-container'>
            <div>
            <label htmlFor="name">Name:</label>
            <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-control"
            />
            </div>
            <div>
            <label htmlFor="description">Value:</label>
            <input
                id="description"
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="form-control"
            />
            </div>
            <div className='checkbox-container'>
            <label htmlFor="is_active">Active:</label>
            <input
                type="checkbox"
                id="is_active"
                name="is_active"
                checked={is_active}
                onChange={(e) => setIsActive(e.target.checked)}
                className="form-control"
            />
            </div>
            <button type="button" onClick={handleSubmit}>Submit</button>
        </div>
      </form>
    </div>
  );
}

export default AddSpecification;
