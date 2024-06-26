import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { addNeccessaryClasses, adminFrontSpecificationsPostFix } from '../../../../helpers/adminHelper';
import { adminProductAPIUrl } from '../../../../config/config';
import { data } from 'jquery';
import { updateLoader } from '../../../../helpers/generalHelper';
import { setPageTitle } from '../../../../helpers/titleHelper';

function EditSpecification() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [specificationName, setSpecificationName] = useState("");
  const [specificationValue, setSpecificationValue] = useState("");
  const [isSpecificationActive, setIsSpecificationActive] = useState("");
  const [errors, setErrors] = useState([]);
  const [message, setMessage] = useState("");
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`${adminProductAPIUrl}/specifications/get/${id}`);
        const data = await response.json();
        if(data){
          setSpecificationName(data.name)
          setSpecificationValue(data.value)
          setIsSpecificationActive(data.is_active)
        }
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
    addNeccessaryClasses();
  }, [id]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    console.log(name, value)
    if(name === "name")
      setSpecificationName(value)
    else if(name === "value")
      setSpecificationValue(value)
    else if(name === "is_active"){
      setIsSpecificationActive(event.target.checked)
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      updateLoader(true);
      const response = await fetch(`${adminProductAPIUrl}/specifications/edit/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: specificationName,
          value: specificationValue,
          is_active: isSpecificationActive
        })
      });
      const data = await response.json();
      if (response.ok) {
        if(data.success){
          setMessage(data.success);
          setErrors([])
        }
      } else {
        setErrors(data.errors)
        setMessage("")
        console.error(response.statusText);
      }
    } catch (error) {
      console.error(error);
    }
    updateLoader(false);
  };

  return (
    <div className='content'>
      {setPageTitle("Edit Specification")}
      <h2>Edit Specification</h2>
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
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" name="name" value={specificationName} onChange={handleInputChange} />
        </div>
        <div>
          <label htmlFor="unit">Value:</label>
          <input type="text" id="value" name="value" value={specificationValue} onChange={handleInputChange} />
        </div>
        <div className='checkbox-container'>
          <label htmlFor="is_active">Active:</label>
          <input type="checkbox" id="is_active" name="is_active" checked={isSpecificationActive} onChange={handleInputChange} />
        </div>
        <button type="button" onClick={handleSubmit}>Update Specification</button>
      </form>
    </div>
  );
}

export default EditSpecification;
