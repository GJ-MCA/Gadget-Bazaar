import React, { useEffect, useState } from 'react';
import { adminProductAPIUrl } from '../../../config/config';
import { useNavigate } from 'react-router-dom';
import { addNeccessaryClasses, adminFrontSpecificationsPostFix } from '../../../helpers/adminHelper';

const AddProduct = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState(null);
  const [brand, setBrand] = useState(null);
  const [specification, setSpecification] = useState(null);
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fetchedBrands, setFetchedBrands] = useState([]);
  const [specifications, setSpecifications] = useState([]);
  const [selectedSpecification, setSelectedSpecification] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    addNeccessaryClasses()
    // Make an API call to fetch the brands from the server
    fetch(adminProductAPIUrl+"/brands/getall")
    .then((response) => response.json())
    .then((data) => {
        setFetchedBrands(data.brands);
    })
    .catch((error) => {
        console.error(error);
    });

     // Fetch the list of available specifications from the backend
    fetch(adminProductAPIUrl+"specifications/getall")
    .then((response) => response.json())
    .then((data) => setSpecifications(data));
    }, []);
  const handleInputChange = (event) => {
    const target = event.target;
    const name = target.name;
    const value = target.value;

    switch (name) {
      case 'name':
        setName(value);
        break;
      case 'description':
        setDescription(value);
        break;
      case 'sku':
        setSku(value);
        break;
      case 'category':
        setCategory(value);
        break;
      case 'brand':
        setBrand(value);
        break;
      case 'specification':
        setSpecification(value);
        break;
      case 'price':
        setPrice(value);
        break;
      case 'quantity':
        setQuantity(value);
        break;
      case 'images':
        setImages(target.files);
        break;
      default:
        break;
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    setIsLoading(true);

    const formData = new FormData();

    formData.append('name', name);
    formData.append('description', description);
    formData.append('sku', sku);
    formData.append('category', category);
    formData.append('brand', brand);
    formData.append('specification', specification);
    formData.append('price', price);
    formData.append('quantity', quantity);

    for (let i = 0; i < images.length; i++) {
      formData.append('images', images[i]);
    }

    fetch(adminProductAPIUrl+"/add", {
      method: 'POST',
      body: formData
    })
      .then((response) => response.json())
      .then((data) => {
        setIsLoading(false);
        setName('');
        setDescription('');
        setSku('');
        setCategory(null);
        setBrand(null);
        setSpecification(null);
        setPrice('');
        setQuantity(1);
        setImages([]);
        setError(null);
        console.log(data);
      })
      .catch((error) => {
        setIsLoading(false);
        setError('An error occurred while adding the product.');
        console.error(error);
      });
  };
  const handleSpecificationChange = (event) => {
    setSelectedSpecification(event.target.value);
  };
  const addSpecification = () => {
    navigate(`${adminFrontSpecificationsPostFix}/add`, { target: '_blank' });
  };
  
  return (
    <div>
      <h2>Add Product</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" name="name" value={name} onChange={handleInputChange} required />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <textarea id="description" name="description" value={description} onChange={handleInputChange} required />
        </div>
        <div>
          <label htmlFor="sku">SKU:</label>
          <input type="text" id="sku" name="sku" value={sku} onChange={handleInputChange} required />
        </div>
        <div className="dropdown-container">
          <label htmlFor="category">Category:</label>
          <select
            id="category"
            name="category"
            value={category}
            onChange={handleInputChange}
            required
          >
            <option value="">Select a category</option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="books">Books</option>
            <option value="home">Home</option>
          </select>
        </div>
        <div className="dropdown-container">
          <label htmlFor="brand">Brand:</label>
          <select
            id="brand"
            name="brand"
            value={brand}
            onChange={handleInputChange}
            required
          >
            <option value="">Select a brand</option>
            {fetchedBrands && fetchedBrands.map((brand) => (
              <option key={brand.id} value={brand.name}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>
        <div className="dropdown-container">
            <label htmlFor="specification">Specification:</label>
            <select value={selectedSpecification} onChange={handleSpecificationChange}>
                <option value="">Select a specification</option>
                {specifications.map((specification) => (
                <option key={specification.id} value={specification.name}>
                    {specification.name}
                </option>
                ))}
            </select>
            <button onClick={addSpecification}>Add</button>
         
        </div>
        <div>
          <label htmlFor="price">Price:</label>
          <input type="number" id="price" name="price" value={price} onChange={handleInputChange} required />
        </div>
        <div>
          <label htmlFor="quantity">Quantity:</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={quantity}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="images">Images:</label>
          <input type="file" id="images" name="images" multiple onChange={handleInputChange} />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Adding...' : 'Add'}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;

