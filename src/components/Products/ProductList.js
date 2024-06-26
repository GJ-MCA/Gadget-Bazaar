import React, { useState, useEffect, useContext } from 'react';
import { GadgetBazaarContext } from '../../context/GadgetBazaarContext';
import { Link, useNavigate } from 'react-router-dom';
import { updateLoader } from '../../helpers/generalHelper';
import { setPageTitle } from '../../helpers/titleHelper';
const config = require("../../config/config")

export const ProductList = () => {
  const [products, setProducts] = useState([]);
  const { setCartCount } = useContext(GadgetBazaarContext);
  const getAllProductsUrl = `${config.baseUrl}/products/showall`;
  const cartAddUrl = `${config.orderAPIUrl}/cart/add`;
  const [productsToDisplay, setProductsToDisplay] = useState(3);
  const [totalProducts, setTotalProducts] = useState(0);

  const navigate = useNavigate();
  useEffect(() => {
    updateLoader(true)
    fetch(getAllProductsUrl)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Network response was not ok.');
        }
      })
      .then(data => {
        setProducts(data);
        setTotalProducts(data.length)
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });
      updateLoader(false)
  },[getAllProductsUrl]);
  const showNotification = () =>{
    console.log("Show notification called")
    var x = document.getElementById("snackbar");

    // Add the "show" class to DIV
    x.className = "show";
  
    // After 3 seconds, remove the show class from DIV
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
  }
  const handleAddToCart = async (product, single_product=false) => {
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
  const handleLoadMoreProductsClick = ()=>{
    if(productsToDisplay < totalProducts){
      if((productsToDisplay * 2) < totalProducts){
        setProductsToDisplay(productsToDisplay * 2)
      }else{
        setProductsToDisplay(totalProducts)
      }
    }
  }
  return (
    <>
    {console.log(config.productListPagePreUrl)}
    {console.log(window.location.href)}
    {setPageTitle(`${window.location.href.includes("products") ? "Products" : "Home"}`)}
      <section className="product_section layout_padding">
        <div className="container">
          <div className="heading_container heading_center">
            <h2>
              Our <span>products</span>
            </h2>
          </div>
          {products.length === 0 ? (
            <div className="text-center lead">No products available</div>
          ) : (
              <>
                <div id="snackbar" className="alert alert-success">
                  Product added to cart!
                </div>
                <div className="row">
                  {products.slice(0, productsToDisplay).map(product => (
                    <div className="col-sm-6 col-md-4 col-lg-4" key={product._id}>
                      <div className="box">
                        <div className="option_container">
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
                          <Link to={config.pdpPagePreUrl+product.sku} className='option3 pdp-page-btn d-block text-center'>
                                View Product
                              </Link>
                        </div>
                      ) : (
                        <div className='text-center' style={{backgroundColor: "#ffd1d1", padding: "15px", borderRadius: "20px"}}>
                
                          <Link to={config.pdpPagePreUrl+product.sku} className='option3 pdp-page-btn d-block text-center' style={{margin: "auto"}}>
                                View Product
                              </Link>
                          <p style={{marginBottom: "0"}}> OR </p>
                          <p style={{marginBottom: "0"}}> Login to Purchase the product</p>
                          <button onClick={() => {navigate("/login") }} className='pdp-page-btn'> Login </button>
                        </div>
                      )
                    )}
                        </div>

                        <div className="img-box">
                          <img src={product.images.length > 0 ? product.images[0]: "/assets/img/logo.png"} alt={product.name} />
                        </div>
                        <div className="detail-box">
                          
                          <h5>{product.name}</h5>
                          <h6>&#8377;{product.price}</h6>
                        </div>
                        {product.quantity <= 0 ? (
                          <span className="badge badge-danger text-uppercase">Out of stock</span>
                        ) : (
                          <span className="badge badge-success text-uppercase">In Stock</span>
                        )}
                         <div className='product-desc mt-2'>
                         <h6>{product.description.slice(0, 120)}{product.description.length > 120 ? '...' : ''}</h6>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {productsToDisplay && totalProducts && productsToDisplay < totalProducts &&(

                  <div className='text-center mt-5 mb-2'>
                    <button type='button' onClick={handleLoadMoreProductsClick} style={{padding: "10px"}}> Load More Products </button>
                  </div>
                )}
              </>
          )}
        </div>
      </section>
    </>
  );
}
