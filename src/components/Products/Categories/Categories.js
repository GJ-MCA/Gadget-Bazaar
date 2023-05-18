import React, { useState, useEffect, useContext } from 'react';
import { GadgetBazaarContext } from '../../../context/GadgetBazaarContext';
import { Link, useNavigate } from 'react-router-dom';
import { updateLoader } from '../../../helpers/generalHelper';
const config = require("../../../config/config")

export const Categories = () => {
  const [categories, setCategories] = useState([]);
  const getAllCategoriesUrl = `${config.productBaseAPIUrl}/categories/showall`;
  const categoriesToDisplay = 8;
  const navigate = useNavigate();
  useEffect(() => {
    updateLoader(true)
    fetch(getAllCategoriesUrl)
      .then(response => {
        if (response.ok) {
          console.log(response)
          return response.json();
        } else {
          throw new Error('Network response was not ok.');
        }
      })
      .then(data => {
        console.log(data)
        setCategories(data);
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });
      updateLoader(false)
  },[getAllCategoriesUrl]);

  return (
    <>
      <section className="product_section layout_padding">
        <div className="container">
          <div className="heading_container heading_center">
            <h2>
              Our <span>categories</span>
            </h2>
          </div>
          {categories.length === 0 ? (
            <div className="text-center lead">No categories available</div>
          ) : (
              <>
                <div className="row">
                  {categories.slice(0, categoriesToDisplay).map(category => (
                    <div className="col-sm-6 col-md-4 col-lg-4" key={category._id}>
                      <div className="box">
                        <div className="option_container">

                        <div className='text-center' style={{backgroundColor: "#ffd1d1", padding: "15px", borderRadius: "20px"}}>
                          <p> View Category Products </p>
                          <Link to={config.categoriesPagePreUrl+"/"+category.name} className='option3 pdp-page-btn d-block text-center' style={{margin: "auto"}}>
                                View Products
                              </Link>
                        </div>
      
                        </div>

                        <div className="img-box">
                          <img src={category.image ? category.image: "/assets/img/logo.png"} alt={category.name} />
                        </div>
                        <div className="detail-box">
                          
                          <h5>{category.name}</h5>
                        </div>
                        <div className='product-desc mt-2'>
                          <h6>
                           {category.description.slice(0, 150)}{category.description.length > 150 ? '...' : ''}
                          </h6>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
          )}
        </div>
      </section>
    </>
  );
}
