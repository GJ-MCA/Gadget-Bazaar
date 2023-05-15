import React, { useEffect, useState, useContext} from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { GadgetBazaarContext } from '../../../context/GadgetBazaarContext';
import { updateLoader } from '../../../helpers/generalHelper';
const config = require("../../../config/config")
function CategoryProducts() {
  const [categoryName, setCategoryName] = useState('');
  const [products, setProducts] = useState([]);
  const { setCartCount } = useContext(GadgetBazaarContext);
  const cartAddUrl = `${config.orderAPIUrl}/cart/add`;
  const { name } = useParams();
  const productsToDisplay = 8;
  const navigate = useNavigate();
  const searchProducts = async (name) => {
    try {
      const response = await fetch(`${config.productBaseAPIUrl}/categories/${name}`);
      
      if (!response.ok) {
        throw new Error('Unable to get category products');
      }
      const products = await response.json();
      return products;
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    updateLoader(true);
    setCategoryName(name);
    searchProducts(name)
    .then((products) => {
      console.log(products)
      setProducts(products);
    })
    .catch((error) => {
      console.error(error);
    });
    updateLoader(false);
  },[name])
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
  
  return (
    <>
      {name ? (
        <section className="product_section layout_padding search_results">
        <div className="container">
          <div className="heading_container heading_center">
            <h2>
              Products in <span>"{name}"</span> Category
            </h2>
          </div>
          {products && products.length === 0 ? (
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
                          <h6>
                            {product.description}
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
      ): 
      <>
      <div className="text-center lead">No Category with {name} found</div>
      </>
      }
    </>
  );
}

export default CategoryProducts;
