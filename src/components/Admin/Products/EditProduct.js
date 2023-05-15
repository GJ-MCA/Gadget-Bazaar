import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminProductAPIUrl } from '../../../config/config';
import { addNeccessaryClasses, adminFrontBrandsPostFix, adminFrontCategoryPostFix, adminFrontSpecificationsPostFix } from '../../../helpers/adminHelper';
import { event } from 'jquery';
import { updateLoader } from '../../../helpers/generalHelper';

const EditProduct = () => {
  const { id } = useParams();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [previewImages, setPreviewImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fetchedBrands, setFetchedBrands] = useState([]);
  const [specifications, setSpecifications] = useState([]);
  const [selectedSpecification, setSelectedSpecification] = useState("");
  const [fetchedCategories, setFetchedCategories] = useState([]);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState([]);
  const [imageURLs, setImageURLs] = useState([]);
  const [specificationForms, setSpecificationForms] = useState([{ specification: ''}]);

    const navigate = useNavigate();
    async function fetchProductData(){
        await fetch(`${adminProductAPIUrl}/get/${id}`)
        .then((response) => response.json())
        .then((data) => {
            console.log(data)
            setName(data.name);
            setDescription(data.description);
            setSku(data.sku);
            setCategory(data.category);
            setBrand(data.brand);
            setPrice(data.price);
            setQuantity(data.quantity);
            setPreviewImages(data.images);
            console.log("Specifications :")
            console.log(data.specification)
            if (data.specification) {
                if (data.specification.length < 1) {
                  setSpecificationForms([{ specification: '' }])
                } else {
                  const newForms = data.specification.map((dataSpec, index) => {
                    return {
                      specification: dataSpec._id
                    }
                  });
                  setSpecificationForms(newForms);
                }
            }
        })
        .catch((error) => {
            console.error(error);
        });
    }
    useEffect(() => {
        addNeccessaryClasses();

        // Make an API call to fetch the product details from the server
        fetchProductData()

        // Make an API call to fetch the brands from the server
        fetch(`${adminProductAPIUrl}/brands/getall`)
        .then((response) => response.json())
        .then((data) => {
            setFetchedBrands(data);
        })
        .catch((error) => {
            console.error(error);
        });

        // Make an API call to fetch the categories from the server
        fetch(`${adminProductAPIUrl}/category/getall`)
        .then((response) => response.json())
        .then((data) => {
            setFetchedCategories(data);
        })
        .catch((error) => {
            console.error(error);
        });

        // Fetch the list of available specifications from the backend
        fetch(`${adminProductAPIUrl}/specifications/getall`)
        .then((response) => response.json())
        .then((data) => setSpecifications(data));
    }, [id]);
    const addSpecificationForm = () => {
        setSpecificationForms([...specificationForms, { specification: '' }]);
      };
      
      const removeSpecificationForm = (indexToRemove) => {
        setSpecificationForms(specificationForms.filter((_, index) => index !== indexToRemove));
      };
      
      const handleSpecificationFormChange = (event, index) => {

          console.group("Inside handle Specififcation Form Change: ")
        console.log(" specificationFOrms before: ")
        console.log(specificationForms)
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
    console.log("input changes")
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
        const handleBrandChange = (event) => {
        setBrand(event.target.value);
        };
        
        const handleCategoryChange = (event) => {
        setCategory(event.target.value);
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
          
        
        const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setError(null);
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('sku', sku);
        formData.append('category', category);
        formData.append('brand', brand);
        console.log(specificationForms)
        formData.append('specification', JSON.stringify(specificationForms));
        formData.append('price', price);
        formData.append('quantity', quantity);
        for (let i = 0; i < imageURLs.length; i++) {
            console.log(imageURLs)
        formData.append('images', imageURLs[i]);
        }
        console.log("Image URLs:")
        console.log(imageURLs)
        updateLoader(true);
        fetch(`${adminProductAPIUrl}/edit/${id}`, {
        method: 'PUT',
        body: formData,
        })
        .then((response) => response.json())
        .then((data) => {
            setIsLoading(false);
            if (data.errors) {
            setErrors(data.errors);
            }
            if(data.success){
                setMessage(data.success)
            }
        })
        .catch((error) => {
            console.error(error);
            setIsLoading(false);
            setError('An error occurred while updating the product.');
            setMessage("")
        });
        setIsLoading(false);
        await fetchProductData();
        updateLoader(false);
    };

return (
<div className="container-fluid content">
    <div className="row">
        <div className="col-lg-12">
            <h2>Edit Product</h2>
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
            <form>
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input type="text" className="form-control" id="name" name="name" value={name} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea className="form-control" id="description" name="description" value={description} onChange={handleInputChange} required></textarea>
                </div>
                <div className="form-group form-group-half">
                    <label htmlFor="sku">SKU</label>
                    <input type="text" className="form-control" id="sku" name="sku" value={sku} onChange={handleInputChange} required />
                </div>
                <div className="form-group form-group-half">
                <label htmlFor="category">Category</label>
                    <select className="form-control" id="category" name="category" value={category || ''} onChange={handleCategoryChange} required>
                    <option value="">-- Select Category --</option>
                    {fetchedCategories.map((category) => (
                    <option key={category._id} value={category._id}>
                    {category.name}
                    </option>
                    ))}
                    </select>
                </div>
                <div className="form-group form-group-half">
                    <label htmlFor="brand">Brand</label>
                    <select className="form-control" id="brand" name="brand" value={brand || ''} onChange={handleBrandChange} required>
                    <option value="">-- Select Brand --</option>
                    {fetchedBrands.map((brand) => (
                    <option key={brand._id} value={brand._id}>
                    {brand.name}
                    </option>
                    ))}
                    </select>
                </div>
                <label className='mr-3 d-block'>Specifications(Optional):</label>
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
                <div className="form-group"  style={{width: "49%", display: "inline-block", marginRight: "30px"}}>
                <label htmlFor="price">Product Price</label>
                <input type="text" className="form-control" id="price" name="price" value={price} onChange={handleInputChange} />
                </div>
                <div className="form-group" style={{width: "49%", display: "inline-block"}}>
                <label htmlFor="quantity">Product Quantity</label>
                <input type="number" className="form-control" id="quantity" name="quantity" value={quantity} onChange={handleInputChange} />
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
                {isLoading ? 'Loading...' : 'Save Product'}
                </button>
            </form>
        </div>
    </div>
</div>
);
};
export default EditProduct;