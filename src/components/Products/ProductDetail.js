import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GadgetBazaarContext } from '../../context/GadgetBazaarContext';
import Slider from "react-slick";

const config = require("../../config/config");

export const ProductDetail = () => {
  
  const { setCartCount } = useContext(GadgetBazaarContext);
  const [product, setProduct] = useState({});
  const [activeTab, setActiveTab] = useState(0);
  const { sku } = useParams();
  const navigate = useNavigate();
  const cartAddUrl = `${config.orderAPIUrl}/cart/add`;
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${config.baseUrl}/products/show/${sku}`);
        if (!response.ok) {
          throw new Error('Unable to fetch product');
        }
        const productData = await response.json();
        console.log(productData[0])
        setProduct(productData[0]);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProduct();
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
  const handleTabClick = (index) => {
    setActiveTab(index);
  };
  
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };
  const tabs = [
    {
      title: "Tab 1",
      content: "Tab 1 content",
    },
    {
      title: "Tab 2",
      content: "Tab 2 content",
    },
    {
      title: "Tab 3",
      content: "Tab 3 content",
    },
  ];
  
  return (
    
    <>
    <link rel="stylesheet" type="text/css" charSet="UTF-8" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css" /> 
    <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css" />
    <section className="py-5 product-detail-section">

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
                <div className="text-warning mb-1 me-2">
                  <i className="fa fa-star"></i>
                  <i className="fa fa-star"></i>
                  <i className="fa fa-star"></i>
                  <i className="fa fa-star"></i>
                  <i className="fas fa-star-half-alt"></i>
                  <span className="ms-1">
                    4.5
                  </span>
                </div>
                <span className="text-muted"><i className="fas fa-shopping-basket fa-sm mx-1"></i>154 orders</span>
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
              <div className="options">
                <button className="option1" onClick={() => handleAddToCart(product)}>
                  Add to Cart
                </button>
                <button className="option2" onClick={() => handleAddToCart(product, true)}>
                  Buy Now
                </button>
              </div>
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
            <ul className="nav nav-tabs mb-3 custom-nav-tabs" id="ex1" role="tablist">
              {tabs.map((tab, index) => (
                <li className="nav-item" role="presentation" key={index}>
                  <button
                    className={`nav-link${activeTab === index ? " active" : ""}`}
                    onClick={() => handleTabClick(index)}
                  >
                    {tab.title}
                  </button>
                </li>
              ))}
            </ul>
            <div className="tab-content" id="ex1-content">
              {tabs.map((tab, index) => (
                <div
                  className={`tab-pane fade${activeTab === index ? " show active" : ""}`}
                  id={`ex1-tabs-${index}`}
                  role="tabpanel"
                  aria-labelledby={`ex1-tab-${index}`}
                  key={index}
                >
                  {tab.content}
                </div>
              ))}
            </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  );
}