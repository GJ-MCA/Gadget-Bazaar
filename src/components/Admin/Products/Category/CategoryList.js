import React, { useEffect, useState } from 'react';
import { adminProductAPIUrl } from '../../../../config/config';
import { Link, useNavigate } from 'react-router-dom';
import { addNeccessaryClasses, adminFrontCategoryPostFix, } from '../../../../helpers/adminHelper';

function CategoryList() {
  const [categories, setCategories] = useState([]);
    const navigate = useNavigate();
  useEffect(() => {
    async function fetchData() {
      const response = await fetch(adminProductAPIUrl+"/category/getall");
      const data = await response.json();
      setCategories(data);
    }

    fetchData();
    addNeccessaryClasses();
  }, []);

  const handleAddCategoryClick = () => {
    console.log("Called")
    navigate(adminFrontCategoryPostFix+"/add")
  }
  const handleEditCategoryClick = (id) => {
    if(id)
        navigate(adminFrontCategoryPostFix+"/edit/"+id)
    else{
        alert("Something went wrong!")
    }
  }
  return (
    <div className='main-table-container content'>
      <h2>Category List</h2>
      <button onClick={handleAddCategoryClick}>Add Category</button>
        {categories && categories.length > 0 ? 
            <>
                <div className='table-container mt-4'>
                <table>
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Logo</th>
                        <th>Description</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {categories.map((category) => (
                        <tr key={category._id}>
                        <td>{category.name}</td>
                        <td style={{width: "100px"}}>
                            <img src={category.image} alt="Category Image" />
                        </td>
                        <td>{category.description}</td>
                        <td>{category.is_active ? "Active": "Disabled"}</td>
                        <td>
                        <button onClick={() => handleEditCategoryClick(category._id)}>Edit</button>

                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
             </>
             :
             <>
                <p>No Categories found.</p>
             </>
        }
    </div>
  );
}

export default CategoryList;
