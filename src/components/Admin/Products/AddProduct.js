import React, { useEffect, useState } from 'react';
import { adminProductAPIUrl } from '../../../config/config';
import { useNavigate } from 'react-router-dom';
import { addNeccessaryClasses, adminFrontBrandsPostFix, adminFrontCategoryPostFix, adminFrontSpecificationsPostFix } from '../../../helpers/adminHelper';
import { updateLoader } from '../../../helpers/generalHelper';

const AddProduct = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [specification, setSpecification] = useState("");
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [previewImages, setPreviewImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fetchedBrands, setFetchedBrands] = useState([]);
  const [specifications, setSpecifications] = useState([]);
  const [selectedSpecification, setSelectedSpecification] = useState("");
  const [fetchedCategories, setFetchedCategories] = useState([]);
  const [errors, setErrors] = useState([]);
  const [message, setMessage] = useState("");
  const [imageURLs, setImageURLs] = useState([]);
  const [specificationForms, setSpecificationForms] = useState([{ specification: ''}]);
  const navigate = useNavigate();
  useEffect(() => {
    addNeccessaryClasses()
    // Make an API call to fetch the brands from the server
    fetch(adminProductAPIUrl+"/brands/getall")
    .then((response) => response.json())
    .then((data) => {
        setFetchedBrands(data);
    })
    .catch((error) => {
        console.error(error);
    });
    // Make an API call to fetch the categories from the server
    fetch(adminProductAPIUrl+"/category/getall")
    .then((response) => response.json())
    .then((data) => {
      setFetchedCategories(data);
    })
    .catch((error) => {
      console.error(error);
    });

     // Fetch the list of available specifications from the backend
    fetch(adminProductAPIUrl+"/specifications/getall")
    .then((response) => response.json())
    .then((data) => setSpecifications(data));
    }, []);
    const addSpecificationForm = () => {
      setSpecificationForms([...specificationForms, { specification: ''}]);
    };
    
    const removeSpecificationForm = (indexToRemove) => {
      setSpecificationForms(specificationForms.filter((_, index) => index !== indexToRemove));
    };
    
    const handleSpecificationFormChange = (event, index) => {
      const { name, value } = event.target;
      const updatedForms = [...specificationForms];
      updatedForms[index] = { ...updatedForms[index], [name]: value };
      setSpecificationForms(updatedForms);
      console.log(" Event: ")
      console.log(event)
      console.log(" index: ")
      console.log(index)
      console.log(" Name: ")
      console.log(name)
      console.log(" Value: ")
      console.log(value)
      
      console.log(" updatedForms: ")
      console.log(updatedForms)
      console.log(" specificationFOrms after: ")
      console.log(specificationForms)
    };
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
      case 'price':
        setPrice(value);
        break;
      case 'quantity':
        setQuantity(value);
        break;
      default:
        break;
    }
  };
  const handleImages = (event) => {
    const files = Array.from(event.target.files);
    const newImageUrls = files.map(file => URL.createObjectURL(file));
    setImageURLs(imageURLs => [...imageURLs, ...files]);
    setPreviewImages(previewImages => [...previewImages, ...newImageUrls]);
    console.log(files)  
    console.log(newImageUrls)
    console.log(imageURLs)
    console.log(previewImages)
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
    formData.append('specification', JSON.stringify(specificationForms));
    formData.append('price', price);
    formData.append('quantity', quantity);
    const token = localStorage.getItem("auth-token");
    formData.append('token', token);
    for (let i = 0; i < imageURLs.length; i++) {
      console.log(imageURLs)
    formData.append('images', imageURLs[i]);
    }
    console.log("Image URLs:")
    console.log(imageURLs)

    const addProduct = async () => {
      try {
        updateLoader(true);
        const response = await fetch(adminProductAPIUrl+"/add", {
          method: 'POST',
          body: formData,
          
        });
        const data = await response.json();
        
        if (response.ok) {
          setIsLoading(false);
          setName('');
          setDescription('');
          setSku('');
          setCategory("");
          setBrand("");
          setSpecification("");
          setPrice('');
          setQuantity(1);
          setPreviewImages([]);
          setError(null);
          setErrors([]);
          setSpecificationForms([{ specification: ''}]);
          clearFileInputImages("images");
          if(data.success){
            setMessage(data.success);
          }
        } else {
          setIsLoading(false);
          setError('An error occurred while adding the product.');
          console.error(error);
          setErrors(data.errors);
          setMessage("")
        }
      } catch (error) {
        console.error(error);
      }
      updateLoader(false);
    };
  
    addProduct();
  
  };
  const clearFileInputImages = (elementid)=>{
    const fileInput = document.getElementById(elementid);
    fileInput.value = ''; // clear the value of the input field

    // clear the file data from the input field (required for security reasons)
    if (fileInput.files && fileInput.files[0]) {
      const reader = new FileReader();
      reader.onload = function() {
        fileInput.value = '';
      };
      reader.readAsDataURL(fileInput.files[0]);
    }
  }
  const handleSpecificationChange = (event) => {
    setSelectedSpecification(event.target.value);
  };
  const addCategory = () => {
    navigate(`${adminFrontCategoryPostFix}/add`, { target: '_blank' });
  };
  const addBrand = () => {
    navigate(`${adminFrontBrandsPostFix}/add`, { target: '_blank' });
  };
  const addSpecification = () => {
    navigate(`${adminFrontSpecificationsPostFix}/add`, { target: '_blank' });
  };
  
  return (
    <div className='content'>
      <h2>Add Product</h2>
      <form>
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
          <input type="text" id="name" name="name" value={name} onChange={handleInputChange} required />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <textarea id="description" name="description" value={description} onChange={handleInputChange} required />
        </div>
        <div style={{width: "33%", display: "inline-block"}}>
          <label htmlFor="sku">SKU:</label>
          <input type="text" id="sku" name="sku" value={sku} onChange={handleInputChange} required />
        </div>
        <div className="dropdown-container mb-3" style={{width: "33%", display: "inline-block", marginLeft: "15px"}}>
          <label htmlFor="category" className='d-block'>Category:</label>
          <select
            id="category"
            name="category"
            value={category}
            onChange={handleInputChange}
            required
            style={{marginLeft: "0", width: "80%"}}
          >
            <option value="">Select a category</option>
            {fetchedCategories && fetchedCategories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
          <button type="button" onClick={addCategory} className='button-with-select'>
            Add
          </button>
        </div>
        <div className="dropdown-container mb-3" style={{width: "32%", display: "inline-block", marginLeft: "10px"}}>
          <label htmlFor="brand" className='d-block'>Brand:</label>
          <select
            id="brand"
            name="brand"
            value={brand}
            onChange={handleInputChange}
            style={{marginLeft: "0", width: "80%"}}
            required
          >
            <option value="">Select a brand</option>
            {fetchedBrands && fetchedBrands.map((brand) => (
              <option key={brand._id} value={brand._id}>
                {brand.name}
              </option>
            ))}
          </select>
          <button type="button" onClick={addBrand} className='button-with-select'>Add</button>
        </div>
        <label className='mr-3'>Specifications(Optional):</label>
        <button type="button" onClick={addSpecification} className='button-with-select' style={{width: "220px"}} title='Go to Add Specification Page'>Add New Specification</button>
        <div className='specifications-container mt-3'>
            {specificationForms.map((form, index) => (
                <div key={index} className="form-group spec-form-group">
                    <label htmlFor={`specification-${index}`}>Specification {index + 1}</label>
                    <select
                    className={`form-control ${index === 0 ? "first" : ""}`}
                    id={`specification-${index}`}
                    name="specification"
                    value={form.specification}
                    onChange={(event) => handleSpecificationFormChange(event, index)}
                    required
                    >
                    <option value="">Select a specification</option>
                    {specifications.map((spec) => (
                        <option key={spec._id} value={spec._id}>
                        {spec.name} : {spec.value}
                        </option>
                    ))}
                    </select>
                    {index !== 0 && (
                    <button type="button" onClick={() => removeSpecificationForm(index)}>
                        Remove
                    </button>
                    )}
                </div>
                ))}
            <button className='add-spec-btn' type="button" onClick={addSpecificationForm}>
            Add
            </button>
          </div>
        <div style={{width: "49%", display: "inline-block", marginRight: "30px"}}>
          <label htmlFor="price">Price:</label>
          <input type="number" id="price" name="price" value={price} onChange={handleInputChange} required />
        </div>
        <div style={{width: "49%", display: "inline-block"}}>
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
            <label htmlFor="images">Product Images</label>
            <input type="file" className="form-control-file" id="images" name="images"  onChange={(event) => handleImages(event)} multiple />
            {previewImages && previewImages.length > 0 && (
                <div className='image-preview-container'>
                    {previewImages.map((image, index) => (
                    <div key={index} className="image-preview">
                        <img src={image} alt={`Product Image ${index}`} />
                        <button type="button" onClick={() => {
                        const newImages = [...previewImages];
                        const newUrls = [...imageURLs];
                        newImages.splice(index, 1);
                        newUrls.splice(index, 1);
                        setPreviewImages(newImages);
                        setImageURLs(newUrls);
                        }}>Remove</button>
                    </div>
                    ))}
                </div>
            )}

        </div>
        <button type="button" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? 'Adding...' : 'Add Product'}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;

