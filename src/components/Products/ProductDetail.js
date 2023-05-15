import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GadgetBazaarContext } from '../../context/GadgetBazaarContext';
import Slider from "react-slick";
import { updateLoader } from '../../helpers/generalHelper';
import ProductReview from './ProductReview';
import ProductReviewList from './ProductReviewList';

const config = require("../../config/config");

export const ProductDetail = () => {
  
  const { setCartCount } = useContext(GadgetBazaarContext);
  const [product, setProduct] = useState({});
  const [specifications, setSpecifications] = useState([]);
  const { sku } = useParams();
  const navigate = useNavigate();
  const cartAddUrl = `${config.orderAPIUrl}/cart/add`;
  useEffect(() => {
    updateLoader(true)
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${config.baseUrl}/products/show/${sku}`);
        if (!response.ok) {
          throw new Error('Unable to fetch product');
        }
        const productData = await response.json();
        console.log(productData)
        setProduct(productData[0]);
        const specs = [];
        for (const spec of productData[0].specification) {
          const specResponse = await fetch(`${config.baseUrl}/products/specifications/get/${spec}`);
          if (!specResponse.ok) {
            throw new Error('Unable to fetch specification');
          }
          const specData = await specResponse.json();
          specs.push(specData);
        }
        setSpecifications(specs);
      } catch (error) {
        console.error(error);
      }
    };
    
    fetchProduct();
    updateLoader(false)
  }, [sku]);

  const showNotification = () =>{
    console.log("Show notification called")
    var x = document.getElementById("snackbar");

    // Add the "show" class to DIV
    x.className = "show";
  
    // After 3 seconds, remove the show class from DIV
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
  }
  const handleAddToCart = async (product, single_product = false) => {
    const item = {
      product_id: product._id,
      name: product.name,
      image: product.image,
      price: product.price,
      quantity: 1
    };
    try {
      		// Check if the user is logged in and set the user state accordingly
			const token = localStorage.getItem('auth-token');
      if(token){
        const response = await fetch(cartAddUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': `Bearer ${token}`
          },
          body: JSON.stringify(item)
        });
        if (!response.ok) {
          response.json().then(error => {
            throw new Error('Unable to add item to cart');
          });
        }
        if(response.ok){
          response.json().then(data => {
            if(data.errcode === "OUTOFSTOCK"){
              alert("Item is out of stock")
            }
          });
        }
        if(single_product){
          navigate("/cart");
        }
				const getCartUrl = `${config.orderAPIUrl}/getcart`;
				fetch(`${getCartUrl}`, {
					method: 'GET',
					headers: {
					'Content-Type': 'application/json',
					'auth-token': `Bearer ${token}`
					}
				})
				.then(response => {
				if (response.ok) {
					return response.json();
				}
				throw new Error('Network response was not ok');
				})
        .then(data => {
					var total_qty = 0;
					if(data){
						data['cartItems'].forEach(element => {
							total_qty += element.quantity;
						});
            showNotification();
					}
					setCartCount(total_qty);
				})
				.catch(error => {
				console.error('There was a problem with the fetch operation:', error);
				});

      }
    } catch (error) {
      console.error(error);
    }

  };
  
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };
  
  return (
    
    <>
    <link rel="stylesheet" type="text/css" charSet="UTF-8" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css" /> 
    <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css" />
    <section className="py-5 product-detail-section" style={{marginTop: "104px"}}>

      <div id="snackbar" className="alert alert-success">
          Product added to cart!
      </div>
      <div className="container">
        <div className="row gx-5">
          <aside className="col-lg-6">
          <Slider {...settings}>
            {product.images && product.images.map((image, index) => (
              <img key={index} src={image} alt={product.name}/>
            ))}
          </Slider>
          </aside>
          <main className="col-lg-6">
            <div className="ps-lg-3">
              <h4 className="title text-dark">
                {product.name}
              </h4>
              <div className="d-flex flex-row my-3">
            
                {product.quantity <= 0 ? (
                  <span className="badge badge-danger text-uppercase ml-2" style={{lineHeight: "20px"}}>Out of stock</span>
                ) : (
                  <span className="badge badge-success text-uppercase ml-2" style={{lineHeight: "20px"}}>In Stock</span>
                )}
              </div>

              <div className="mb-3">
                <span className="h5">&#8377;{product.price}</span>
                <span className="text-muted">/per item</span>
              </div>

              <p>
                {product.description}
              </p>

              <hr />
              {product.quantity <= 0 ? (
                <div className="alert alert-danger bg-light" role="alert">
                  <i className="fa fa-exclamation-circle me-2"></i> Sorry, this item is currently out of stock. Please check back later.
                </div>
              ) : (
                localStorage.getItem("auth-token") ? (
                  <div className="options">
                    <button className="option1" onClick={() => handleAddToCart(product)}>
                      Add to Cart
                    </button>
                    <button className="option2" onClick={() => handleAddToCart(product, true)}>
                      Buy Now
                    </button>
                  </div>
                ) : (
                  <div>
                    <p> Login to Purchase the product</p>
                    <button onClick={() => {navigate("/login") }}> Login </button>
                  </div>
                )
              )}

            </div>
          </main>
        </div>
      </div>
    </section>
    <section className="py-4">
      <div className="container">
        <div className="row gx-4">
          <div className="col mb-4">
            <div className="border rounded-2 px-3 py-2 bg-white">
         
          
              <div className='specifications-container'>
                <h3 style={{borderBottom: "2px dashed rgb(170 170 170)", paddingBottom: "5px"}}> Specifications </h3>
                {specifications.map((spec, index) => (
                  <div key={index}>
                    <h6>{spec.name}: <span style={{fontWeight: "400"}}>{spec.value}</span></h6>
                    
                  </div>
                  ))}
                </div>
            </div>
            {product && product._id && (
              <>
                <ProductReview productId={product._id} />
                <ProductReviewList productId={product._id} />
              </>
            )}
          </div>
        </div>
      </div>
    </section>
    </>
  );
}