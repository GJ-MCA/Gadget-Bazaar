import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminFrontBrandsPostFix, adminFrontProductsPostFix, adminFrontSpecificationsPostFix } from '../../../helpers/adminHelper';
import { setPageTitle } from '../../../helpers/titleHelper';
const config = require("../../../config/config");
const AdminProductList = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchProducts = async () => {
        try {
          const res = await fetch(`${config.productBaseAPIUrl}/showall`);
          if (!res.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await res.json();
          console.log(data);
          setProducts(data);
        } catch (error) {
          console.error(`Fetch Error: ${error.message}`);
        }
      };
      
    fetchProducts();
  }, []);
  const handleBrandsClick = ()=>{
    navigate(adminFrontBrandsPostFix)
  }
  const handleSpecificationsClick = ()=>{
    navigate(adminFrontSpecificationsPostFix)
  }
  const handleAddSProductClick = ()=>{
    navigate(adminFrontProductsPostFix+"/add")
  }
  const handleEditProductClick = (id) => {
    if (id) {
      navigate(adminFrontProductsPostFix + '/edit/' + id);
    } else {
      alert('Something went wrong!');
    }
  };
  return (
    <div className="content">
      {setPageTitle("Product List")}
      <h2>Product List</h2>
      <button onClick={handleAddSProductClick}>Add Product</button>
      <button className='ml-3' onClick={handleBrandsClick}>Brands</button>
      <button className='ml-3' onClick={handleSpecificationsClick}>Specifications</button>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>SKU</th>
            <th>Name</th>
            <th>Description</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td>{product._id}</td>
              <td>{product.sku}</td>
              <td>{product.name}</td>
              <td>{product.description}</td>
              <td>{product.quantity}</td>
              <td>&#8377;{product.price}</td>
              <td>
                <button onClick={() => handleEditProductClick(product._id)}>
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminProductList;
