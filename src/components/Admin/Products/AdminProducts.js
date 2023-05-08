import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { adminFrontBrandsPostFix, adminFrontProductsPostFix, adminFrontSpecificationsPostFix } from '../../../helpers/adminHelper';
const config = require("../../../config/config");
const AdminProducts = () => {
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
  return (
    <div className="">
      <h2>Product List</h2>
      <button onClick={handleAddSProductClick}>Add Product</button>
      <button onClick={handleBrandsClick}>Brands</button>
      <button onClick={handleSpecificationsClick}>Specifications</button>
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
                <Link to={`/admin/products/${product._id}`} className="btn btn-primary">
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminProducts;
