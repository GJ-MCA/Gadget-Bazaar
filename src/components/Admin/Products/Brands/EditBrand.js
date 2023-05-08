import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminProductAPIUrl } from '../../../../config/config';
import { addNeccessaryClasses, adminFrontBrandsPostFix } from '../../../../helpers/adminHelper';

const EditBrand = () => {
  const { id } = useParams();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [logo, setLogo] = useState(null);
  const [previewLogo, setPreviewLogo] = useState(null);
  const [isPreviewLogo, setIsPreviewLogo] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [errors, setErrors] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${adminProductAPIUrl}/brands/get/${id}`);
        const data = await response.json();
        setName(data.name);
        setDescription(data.description);
        setLogo(data.logo);
        setIsActive(data.is_active);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchData();
    addNeccessaryClasses();
  }, [id]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === 'logo') {
      setLogo(event.target.files[0]);
      if (event.target.files[0]) {
        setPreviewLogo(URL.createObjectURL(event.target.files[0]));
        setIsPreviewLogo(true);
    }else{
        setPreviewLogo(null);
        setIsPreviewLogo(false);
      }
    } else if (name === 'is_active') {
      setIsActive(event.target.checked);
    } else {
      name === 'name' ? setName(value) : setDescription(value);
    }
  };  

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('is_active', isActive);
    if (logo) {
      formData.append('logo', logo);
    }

    try {
      const response = await fetch(`${adminProductAPIUrl}/brands/edit/${id}`, {
        method: 'PUT',
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error('Failed to update brand');
      }else{
        setErrors(data.errors)
      }
      navigate(adminFrontBrandsPostFix);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      {error ? (
        <p>{error}</p>
      ) : (
        <form onSubmit={handleSubmit}>
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
            <input type="text" name="name" value={name} onChange={handleInputChange} />
          </div>
          <div>
            <label htmlFor="description">Description:</label>
            <textarea name="description" value={description} onChange={handleInputChange} />
          </div>
          <div className='mb-2'>
            <label htmlFor="logo">Logo:</label>
            {logo && !isPreviewLogo && (
              <img
                src={`${logo}`}
                alt="Brand Logo"
                width="200"
                className='ml-2 mb-2'
              />
            )}
            {previewLogo && isPreviewLogo && (
              <img
                src={`${previewLogo}`}
                alt="Brand Logo Preview"
                width="200"
                className='ml-2 mb-2'
              />
            )}
            <input type="file" name="logo" onChange={handleInputChange} />
          </div>
          <div className='checkbox-container'>
            <label htmlFor="is_active">Active:</label>
            <input type="checkbox" name="is_active" checked={isActive} onChange={handleInputChange} />
          </div>
          <button type="submit">Update Brand</button>
        </form>
      )}
    </div>
  );
};

export default EditBrand;
