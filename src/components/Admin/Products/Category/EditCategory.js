import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminProductAPIUrl } from '../../../../config/config';
import { addNeccessaryClasses, adminFrontCategoryPostFix } from '../../../../helpers/adminHelper';
import { updateLoader } from '../../../../helpers/generalHelper';

const EditCategory = () => {
  const { id } = useParams();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isPreviewImage, setIsPreviewImage] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [errors, setErrors] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${adminProductAPIUrl}/category/get/${id}`);
        const data = await response.json();
        setName(data.name);
        setDescription(data.description);
        setImage(data.image);
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
    if (name === 'image') {
      setImage(event.target.files[0]);
      if (event.target.files[0]) {
        setPreviewImage(URL.createObjectURL(event.target.files[0]));
        setIsPreviewImage(true);
    }else{
        setPreviewImage(null);
        setIsPreviewImage(false);
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
    if (image) {
      formData.append('image', image);
    }

    try {
      updateLoader(true);
      const response = await fetch(`${adminProductAPIUrl}/category/edit/${id}`, {
        method: 'PUT',
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error('Failed to update category');
      }else{
        setErrors(data.errors)
      }
      navigate(adminFrontCategoryPostFix);
    } catch (error) {
      setError(error.message);
    }
    updateLoader(false);
  };

  return (
    <div className='content'>
      {error ? (
        <p>{error}</p>
      ) : (
        <form>
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
            <label htmlFor="image">Image:</label>
            {image && !isPreviewImage && (
              <img
                src={`${image}`}
                alt="Category Image"
                width="200"
                className='ml-2 mb-2'
              />
            )}
            {previewImage && isPreviewImage && (
              <img
                src={`${previewImage}`}
                alt="Category Image Preview"
                width="200"
                className='ml-2 mb-2'
              />
            )}
            <input type="file" name="image" onChange={handleInputChange} />
          </div>
          <div className='checkbox-container'>
            <label htmlFor="is_active">Active:</label>
            <input type="checkbox" name="is_active" checked={isActive} onChange={handleInputChange} />
          </div>
          <button type="button" onClick={handleSubmit}>Update Category</button>
        </form>
      )}
    </div>
  );
};

export default EditCategory;
