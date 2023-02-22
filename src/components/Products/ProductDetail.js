import React, { useState, useEffect } from 'react';

function ProductDetail({ match }) {
  const [product, setProduct] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const productId = match.params.id;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/gadgetbazaar/products/show/${productId}`);
        if (!response.ok) {
          throw new Error('Unable to fetch product');
        }
        const productData = await response.json();
        setProduct(productData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProduct();
  }, [productId]);

  const handleAddToCart = async () => {
    const item = {
      productId: product._id,
      name: product.name,
      image: product.image,
      price: product.price,
      quantity: quantity
    };
    try {
      const response = await fetch('/gadgetbazaar/order/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
      });
      if (!response.ok) {
        throw new Error('Unable to add item to cart');
      }
      setIsAdded(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleQuantityChange = (event) => {
    setQuantity(event.target.value);
  };

  return (
    <div>
      <h1>{product.name}</h1>
      <img src={product.image} alt={product.name} />
      <p>{product.description}</p>
      <p>Price: ${product.price}</p>
      <label>
        Quantity:{' '}
        <input type="number" value={quantity} min="1" max="10" onChange={handleQuantityChange} />
      </label>
      <button onClick={handleAddToCart}>Add to Cart</button>
      {isAdded && <p>Item added to cart</p>}
    </div>
  );
}

export default ProductDetail;
