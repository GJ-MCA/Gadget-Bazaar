import React, { useEffect, useState } from 'react';
import { adminProductAPIUrl } from '../../../../config/config';
import { useNavigate } from 'react-router-dom';
import { addNeccessaryClasses, adminFrontBrandsPostFix } from '../../../../helpers/adminHelper';

function AddBrand() {
  const [name, setName] = useState('');
  const [logo, setLogo] = useState('');
  const [description, setDescription] = useState('');
  const [is_active, setIsActive] = useState(true);
  const navigate = useNavigate();
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    addNeccessaryClasses();
  }, [])
  
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('logo', logo);
    formData.append('description', description);
    formData.append('is_active', is_active);
    try {
      const response = await fetch(`${adminProductAPIUrl}/brands/add`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        navigate(adminFrontBrandsPostFix);
      } else {
        setErrors(data.errors);
        console.error('Error creating brand.');
        console.log(data.errors)
      }
    } catch (error) {
      console.error('Error creating brand:', error);
    }
  };

  return (
    <div>
      <h2>Add Brand</h2>
      <form onSubmit={handleFormSubmit}>
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
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>
        <div>
          <label htmlFor="logo">Logo:</label>
          <input
            type="file"
            id="logo"
            accept="image/png, image/jpeg"
            onChange={(event) => setLogo(event.target.files[0])}
          />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
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
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default AddBrand;
