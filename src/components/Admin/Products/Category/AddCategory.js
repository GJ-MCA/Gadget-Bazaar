import React, { useEffect, useState } from 'react';
import { adminProductAPIUrl } from '../../../../config/config';
import { addNeccessaryClasses } from '../../../../helpers/adminHelper';
import { updateLoader } from '../../../../helpers/generalHelper';
import { setPageTitle } from '../../../../helpers/titleHelper';

function AddCategory() {
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState('');
  const [is_active, setIsActive] = useState(true);
  const [errors, setErrors] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    addNeccessaryClasses();
  }, [])

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('image', image);
    formData.append('description', description);
    formData.append('is_active', is_active);
    try {
      updateLoader(true);
      const response = await fetch(`${adminProductAPIUrl}/category/add`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        console.log(data)
        if(data){
          if(data.message){
            setMessage(data.message); 
            setErrors([])
            setName("");
            setImage(null);
            setDescription("");
            setIsActive(true);
          }
        }
      } else {
        setMessage("")
        setErrors(data.errors);
        console.error('Error creating category.');
        console.log(data.errors)
      }
    } catch (error) {
      setMessage("");
      console.error('Error creating category:', error);
    }
    updateLoader(false);
  };

  return (
    <div className='content'>
      {setPageTitle("Add Category")}
      <h2>Add Category</h2>
      <form className='admin-form'>
        {message && message.length > 0 && (
          <div className={message.includes("successfully") ? "alert alert-success": "alert alert-info"}>
            {message}
          </div>
        )}
        {errors && errors.length > 0 && (
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
            required
          />
        </div>
        <div>
          <label htmlFor="image">Image:</label>
          <input
            type="file"
            id="image"
            accept="image/png, image/jpeg"
            onChange={(event) => setImage(event.target.files[0])}
            required
          />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            required
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
        <button type="button" onClick={handleFormSubmit}>Submit</button>
      </form>
    </div>
  );
}

export default AddCategory;
