import React, {useEffect, useState, useMemo, useContext} from 'react';
import Swal from 'sweetalert2';
import fetchCartItems, {updateCart, deleteCartItem} from '../../helpers/cartHelper';
import { GadgetBazaarContext } from '../../context/GadgetBazaarContext';
import { Link } from 'react-router-dom';
/* const config = require("../../config/config"); */
const PUBLIC_CSS_DIR = `${process.env.PUBLIC_URL}/assets/css`;
export const ShoppingCart = () => {
    const [cartItems, setCartItems] = useState([]);
    
	const {setCartCount } = useContext(GadgetBazaarContext);
    const cartTotal = useMemo(
        () =>
          cartItems.reduce(
            (total, cartItem) =>
              total + parseFloat(cartItem.product_id.price) * cartItem.quantity,
            0
          ),
        [cartItems]
      );
      
      const totalQty = useMemo(() => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
      }, [cartItems]);
      useEffect(() => {
        const token = localStorage.getItem('auth-token');
        fetchCartItems(token).then((data) => {
          setCartItems(data);
        });
        setCartCount(totalQty);
      }, [totalQty, setCartCount]);
    const handleUpdateCartItemQuantity = async (productId, newQuantity) => {
        // Check if new quantity is less than 1
        if (newQuantity < 1) {
            newQuantity = 1;
        }
        const token = localStorage.getItem('auth-token');
        await updateCart(token, productId, newQuantity, setCartItems, setCartCount, totalQty);
      };
      const handleDeleteClick = async (productId) => {
        const confirmed = await Swal.fire({
          title: 'Are you sure?',
          text: 'This item will be removed from your cart.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Yes, remove it!'
        });
      
        if (confirmed.isConfirmed) {
        const token = localStorage.getItem('auth-token');
          await deleteCartItem(token,productId);
          Swal.fire({
            title: 'Removed!',
            text: 'The item has been removed from your cart.',
            icon: 'success'
          });
          fetchCartItems(token).then((data) => {
            setCartItems(data);
          });
          setCartCount(totalQty);
        }else{
            Swal.fire({
                title: 'Not Removed!',
                text: 'The item is not removed from your cart.',
                icon: 'info'
              });
        }
      };
      
      
       
  return (
    <>
     <link rel="stylesheet" href={`${PUBLIC_CSS_DIR}/shopping_cart.css`} />

        <section className="h-100 h-custom" style={{ backgroundColor: 'rgb(255, 131, 131)' }}>
        <div className="container py-5 h-100">
            <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-12">
                <div className="card card-registration card-registration-2" style={{ borderRadius: '15px' }}>
                <div className="card-body p-0">
                    <div className="row g-0">
                        <div className="col-lg-8">
                            <div className="p-5">
                                <div className="d-flex justify-content-between align-items-center mb-5">
                                    <h1 className="fw-bold mb-0 text-black">Shopping Cart</h1>
                                </div>
                                <hr className="my-4"/>
                                {cartItems.length === 0 ? (
                                    <p>No items in cart</p>
                                ) : (cartItems.map((cartItem) => (
                                    <div className="row mb-4 d-flex justify-content-between align-items-center" key={cartItem._id}>
                                        <div className="col-md-2 col-lg-2 col-xl-2">
                                        <img src={cartItem.product_id.image} className="img-fluid rounded-3" alt={cartItem.product_id.name}/>
                                        </div>
                                        <div className="col-md-3 col-lg-3 col-xl-3">
                                        <h6 className="text-muted">Category</h6>
                                        <h6 className="text-black mb-0">{cartItem.product_id.name}</h6>
                                        </div>
                                        <div className="col-md-3 col-lg-3 col-xl-2 d-flex">
                                        <button className="btn px-2"
                                            onClick={() => handleUpdateCartItemQuantity(cartItem.product_id, cartItem.quantity - 1)}>
                                            <i className="fa fa-minus"></i>

                                        </button>
                                        <input id="cart_product_qty" min="0" name="quantity" value={cartItem.quantity} type="text" onChange={(e) => handleUpdateCartItemQuantity(cartItem.product_id, e.target.value)} pattern="[0-9]*" className="form-control form-control-sm input-qty"/>

                                        <button className="btn px-2"
                                        onClick={() => handleUpdateCartItemQuantity(cartItem.product_id, cartItem.quantity + 1)}>
                                            <i className="fa fa-plus"></i>

                                        </button>
                                        </div>
                                        <div className="col-md-3 col-lg-2 col-xl-2 offset-lg-1">
                                        <h6 className="mb-0 price"> &#8377;{cartItem.product_id.price}</h6>
                                        </div>
                                        <div className="col-md-1 col-lg-1 col-xl-1 text-end">
                                        <button className="btn btn-link text-muted" onClick={() => handleDeleteClick(cartItem.product_id)}>

                                            <i className="fa fa-times"></i>
                                        </button>
                                        </div>
                                    </div>
                                ))
                                )}
                                <hr className="my-4"/>
                                <div className="pt-5">
                                    <h6 className="mb-0">
                                        <Link to="/products" className="text-body">
                                            <i className="fa fa-long-arrow-left mr-2"></i>
                                            Back to Shop
                                        </Link>
                                    </h6>
                                </div>
                            </div>
                        </div>

                        {cartItems.length > 0 &&
                            <div className="col-lg-4 bg-grey">
                                <div className="p-5">
                                <h3 className="fw-bold mb-5 mt-2 pt-1">Summary</h3>
                                <hr className="my-4"/>
                                <div className="d-flex justify-content-between mb-4">
                                    <h5 className="text-uppercase">items: {cartItems.length}</h5>
                                    <h5>&#8377;{cartTotal.toFixed(2)}</h5>
                                </div>
                                <h5 className="text-uppercase mb-3">Shipping</h5>
                                <div className="mb-4 pb-2">
                                    <select className="select">
                                    <option value="1">Standard-Delivery- €5.00</option>
                                    <option value="2">Two</option>
                                    <option value="3">Three</option>
                                    <option value="4">Four</option>
                                    </select>
                                </div>
                                <h5 className="text-uppercase mb-3">Coupon code</h5>
                                <div className="mb-5">
                                    <div className="form-outline">
                                    <input type="text" id="coupon_code" className="form-control form-control-lg" />
                                    <label className="form-label" htmlFor="coupon_code">Enter your code</label>
                                    </div>
                                </div>
                                <hr className="my-4"/>
                                <div className="d-flex justify-content-between mb-5">
                                    <h5 className="text-uppercase">Total price</h5>
                                    <h5>€ 137.00</h5>
                                </div>
                                <button type="button" className="btn btn-dark btn-block btn-lg" data-mdb-ripple-color="dark">Checkout</button>
                                </div>
                            </div>
                            }

                    </div>
                </div>
                </div>
            </div>
            </div>
        </div>
    </section>
    </>
  )
}

