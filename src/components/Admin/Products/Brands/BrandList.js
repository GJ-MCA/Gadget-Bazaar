import React, { useEffect, useState } from 'react';
import { adminProductAPIUrl } from '../../../../config/config';
import { Link, useNavigate } from 'react-router-dom';
import { addNeccessaryClasses, adminFrontBrandsPostFix } from '../../../../helpers/adminHelper';
import { setPageTitle } from '../../../../helpers/titleHelper';

function BrandList() {
  const [brands, setBrands] = useState([]);
    const navigate = useNavigate();
  useEffect(() => {
    async function fetchData() {
      const response = await fetch(adminProductAPIUrl+"/brands/getall");
      const data = await response.json();
      setBrands(data);
    }

    fetchData();
    addNeccessaryClasses();
  }, []);

  const handleAddBrandClick = () => {
    console.log("Called")
    navigate(adminFrontBrandsPostFix+"/add")
  }
  const handleEditBrandClick = (id) => {
    if(id)
        navigate(adminFrontBrandsPostFix+"/edit/"+id)
    else{
        alert("Something went wrong!")
    }
  }
  return (
    <div className='main-table-container content'>
      {setPageTitle("Brand List")}
      <h2>Brand List</h2>
      <button onClick={handleAddBrandClick}>Add Brand</button>
        {brands && brands.length > 0 ? 
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
                    {brands.map((brand) => (
                        <tr key={brand._id}>
                        <td>{brand.name}</td>
                        <td style={{width: "100px"}}>
                            <img src={brand.logo} alt="Brand Logo" />
                        </td>
                        <td>{brand.description}</td>
                        <td>{brand.is_active ? "Active": "Disabled"}</td>
                        <td>
                        <button onClick={() => handleEditBrandClick(brand._id)}>Edit</button>

                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
             </>
             :
             <>
                <p>No Brands found.</p>
             </>
        }
    </div>
  );
}

export default BrandList;
