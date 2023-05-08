import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { addNeccessaryClasses, adminFrontSpecificationsPostFix } from '../../../../helpers/adminHelper';
import { adminProductAPIUrl } from '../../../../config/config';
import { data } from 'jquery';

function EditSpecification() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [specification, setSpecification] = useState({
    name: '',
    value: '',
    is_active: false
  });
  const [errors, setErrors] = useState([]);
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`${adminProductAPIUrl}/specifications/get/${id}`);
        const data = await response.json();
        setSpecification(data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
    addNeccessaryClasses();
  }, [id]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setSpecification((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setSpecification((prevState) => ({
      ...prevState,
      [name]: checked
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`${adminProductAPIUrl}/specifications/edit/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(specification)
      });
      if (response.ok) {
        navigate(adminFrontSpecificationsPostFix);
        setErrors(data.errors)
      } else {
        console.error(response.statusText);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Edit Specification</h2>
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
          <input type="text" id="name" name="name" value={specification.name} onChange={handleInputChange} />
        </div>
        <div>
          <label htmlFor="unit">Unit:</label>
          <input type="text" id="unit" name="unit" value={specification.unit} onChange={handleInputChange} />
        </div>
        <div>
          <label htmlFor="is_active">Active:</label>
          <input type="checkbox" id="is_active" name="is_active" checked={specification.is_active} onChange={handleCheckboxChange} />
        </div>
        <button type="submit">Update Specification</button>
      </form>
    </div>
  );
}

export default EditSpecification;
