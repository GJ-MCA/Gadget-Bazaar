import React, { useEffect, useState } from 'react';
import { adminProductAPIUrl } from '../../../../config/config';
import { Link, useNavigate } from 'react-router-dom';
import { addNeccessaryClasses, adminFrontSpecificationsPostFix } from '../../../../helpers/adminHelper';

function SpecificationList() {
  const [specs, setSpecs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`${adminProductAPIUrl}/specifications/getall`);
      const data = await response.json();
      setSpecs(data);
    }
    fetchData();
    
    addNeccessaryClasses();
  }, []);

  const handleAddSpecClick = () => {
    navigate(adminFrontSpecificationsPostFix + '/add');
  };

  const handleEditSpecClick = (id) => {
    if (id) {
      navigate(adminFrontSpecificationsPostFix + '/edit/' + id);
    } else {
      alert('Something went wrong!');
    }
  };

  return (
    <div className='main-table-container'>
      <h2>Specification List</h2>
      <button onClick={handleAddSpecClick}>Add Specification</button>
      {console.log(specs)}
        {specs && specs.length > 0 ? 
        <>
            <div className='table-container mt-4'>
                <table>
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Value</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {specs.map((spec) => (
                        <tr key={spec._id}>
                        <td>{spec.name}</td>
                        <td>{spec.value}</td>
                        <td>{spec.is_active ? 'Active' : 'Disabled'}</td>
                        <td>
                            <button onClick={() => handleEditSpecClick(spec._id)}>Edit</button>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </>
        : <>
          <p>No Specifications found.</p>
        </>}
    </div>
  );
}

export default SpecificationList;
