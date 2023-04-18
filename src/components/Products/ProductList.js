import React, { useState, useEffect, useContext } from 'react';
import { GadgetBazaarContext } from '../../context/GadgetBazaarContext';
const config = require("../../config/config")

function ProductList() {
  const [products, setProducts] = useState([]);
  const { setCartCount } = useContext(GadgetBazaarContext);
  const getAllProductsUrl = `${config.baseUrl}/products/showall`;
  const cartAddUrl = `${config.orderAPIUrl}/cart/add`;
  const buyNowUrl = `${config.orderAPIUrl}/buy-now`;
  const productsToDisplay = 8;

  useEffect(() => {
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
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });
  },[getAllProductsUrl]);

  const handleAddToCart = async (product) => {
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

  const handleBuyNow = async (product) => {
    const item = {
      productId: product._id,
      name: product.name,
      image: product.image,
      price: product.price,
      quantity: 1
    };
    try {
      // Check if the user is logged in and set the user state accordingly
			const token = localStorage.getItem('auth-token');
      if(token){
        const response = await fetch(buyNowUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': `Bearer ${token}`
          },
          body: JSON.stringify(item)
        });
        if (!response.ok) {
          throw new Error('Unable to add item to cart');
        }
        window.location.href = "/order/checkout";
      }

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
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
                    <div className="options">
                      <button className="option1" onClick={() => handleAddToCart(product)}>
                        Add to Cart
                      </button>
                      <button className="option2" onClick={() => handleBuyNow(product)}>
                        Buy Now
                      </button>
                    </div>
                )}
                </div>

                  <div className="img-box">
                    <img src={product.image} alt={product.name} />
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
                  
                  

                  <div className="description">
                    <span>SKU: {product.sku}</span> <br />
                    {product.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
          )}
        </div>
      </section>
    </>
  );
}

export default ProductList;
