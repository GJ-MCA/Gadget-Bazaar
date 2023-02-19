import React, { useState, useEffect } from 'react';
const config = require("../../config/config")

function ProductList() {
  const [products, setProducts] = useState([]);
  const getAllProductsUrl = `${config.baseUrl}/gadgetbazaar/products/showall`;
  const cartAddUrl = `${config.baseUrl}/gadgetbazaar/order/cart/add`;
  const buyNowUrl = `${config.baseUrl}/gadgetbazaar/order/buy-now`;
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
      productId: product._id,
      name: product.name,
      image: product.image,
      price: product.price,
      quantity: 1
    };
    try {
      const response = await fetch(cartAddUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
      });
      if (!response.ok) {
        throw new Error('Unable to add item to cart');
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
      const response = await fetch(buyNowUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
      });
      if (!response.ok) {
        throw new Error('Unable to add item to cart');
      }
      window.location.href = "/gadgetbazaar/order/checkout";
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
          <div className="row">
            {products.slice(0, productsToDisplay).map(product => (
              <div className="col-sm-6 col-md-4 col-lg-4" key={product._id}>
                <div className="box">
                  <div className="option_container">
                    <div className="options">
                      <button className="option1" onClick={() => handleAddToCart(product)}>
                        Add to Cart
                      </button>
                      <button className="option2" onClick={() => handleBuyNow(product)}>
                        Buy Now
                      </button>
                    </div>
                  </div>
                  <div className="img-box">
                    <img src={product.image} alt={product.name} />
                  </div>
                  <div className="detail-box">
                    <h5>{product.name}</h5>
                    <h6>&#8377;{product.price}</h6>
                  </div>
                  <div className="description">
                    <span>SKU: {product.sku}</span> <br />
                    {product.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default ProductList;
