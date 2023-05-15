import React, {useEffect, useMemo, useContext, useState} from 'react';
import Swal from 'sweetalert2';
import fetchCartItems, {updateCart, deleteCartItem, updateCouponCart, applyCouponCode, fetchCouponFromId, removeCouponFromCartUsingCouponCode, updateCartPrice} from '../../helpers/cartHelper';
import { GadgetBazaarContext } from '../../context/GadgetBazaarContext';
import { Link, useNavigate } from 'react-router-dom';
import { useLoginMiddleware } from '../../helpers/userHelper';
import { updateLoader } from '../../helpers/generalHelper';

const config = require("../../config/config");
const PUBLIC_CSS_DIR = `${process.env.PUBLIC_URL}/assets/css`;
export const ShoppingCart = () => {
    const loginMiddleware = useLoginMiddleware(); //used to check if user is logged in, if not then redirect to login page
	  const {setCartCount, cartItems, setCartItems, cartFinalTotal, setCartFinalTotal, couponCode, setCouponCode, couponCodeMessage, setCouponCodeMessage, isCouponCodeApplied, setIsCouponCodeApplied, couponDiscountPercentages, setCouponDiscountPercentages, couponDiscount, setCouponDiscount, discountedPrice, setDiscountedPrice, discountAmount, setDiscountAmount, cartFinalWithoutShipping, setCartFinalWithoutShipping, discountedPriceWithoutShipping, setDiscountedPriceWithoutShipping } = useContext(GadgetBazaarContext);
      const cartTotal = useMemo(
        () =>
          cartItems.reduce(
            (total, cartItem) =>
              total + parseFloat(cartItem.product_id.price) * cartItem.quantity,
            0
          ),
        [cartItems]
      );
      const [categories, setCategories] = useState({});
      const totalQty = useMemo(() => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
      }, [cartItems]);
      useEffect(() => {
        loginMiddleware();
        updateLoader(true)
        const token = localStorage.getItem('auth-token');
        fetchCartItems(token).then((data) => {
            console.log("Cartitems in useeffect of shopping cart: \n\n")
            console.log(data['cartItems'])
          setCartItems(data['cartItems']);
          setCartFinalTotal(data['cartTotalAmount'])
          setCartFinalWithoutShipping((data['cartTotalAmount'] - 40))
          console.log(data['cartItems'])
          if(data['cart']){
            let current_cart = data['cart'][0];
            if(current_cart){
                if(current_cart.coupon_code){
                    fetchCouponFromId(token, current_cart.coupon_code).then((data)=>{
                        if(data.coupon_code_found){
                            setCouponCodeMessage('Coupon code applied successfully!');
                            setIsCouponCodeApplied(true);
                            console.log("coupon data: ");
                            console.log(data.coupon_code);
                            let coupon_code_obj = data.coupon_code;
                            setCouponCode(coupon_code_obj.coupon_code); 
                            setCouponDiscountPercentages(coupon_code_obj.discount);
                            const discount = parseFloat(coupon_code_obj.discount) / 100;
                            setCouponDiscount(discount);
                            setDiscountAmount((cartFinalWithoutShipping * couponDiscount).toFixed(2));
                            const discountedamount = (cartFinalWithoutShipping - (cartFinalWithoutShipping * couponDiscount)).toFixed(2);
                            setDiscountedPriceWithoutShipping(discountedamount)
                            setDiscountedPrice((Number(discountedamount) + 40).toFixed(2));
                        }else{
                            setCouponCodeMessage(data.message);
                            setIsCouponCodeApplied(false);
                        }
                    });
                }
            }
          }
        });
        setCartCount(totalQty);
        setDiscountAmount((cartFinalWithoutShipping * couponDiscount).toFixed(2));
        const discountedamount = (cartFinalWithoutShipping - (cartFinalWithoutShipping * couponDiscount)).toFixed(2);
        setDiscountedPrice((Number(discountedamount) + 40).toFixed(2));
        const getCategoryName = async (categoryId) => {
            try {
              const response = await fetch(`${config.productBaseAPIUrl}/categories/getbyid/${categoryId}`);
              if (!response.ok) {
                throw new Error('Unable to fetch category');
              }
              const category = await response.json();
              return category.name;
            } catch (error) {
              console.error(error);
            }
          };
      
          const getCategoryNamesForCartItems = async () => {
            const categoryPromises = cartItems.map((cartItem) => getCategoryName(cartItem.product_id.category));
            const categoryNames = await Promise.all(categoryPromises);
            const categoriesObject = {};
            categoryNames.forEach((categoryName, index) => {
              const cartItem = cartItems[index];
              categoriesObject[cartItem.product_id.category] = categoryName;
            });
            setCategories(categoriesObject);
          };
      
          getCategoryNamesForCartItems();
        updateLoader(false)
      }, [totalQty, setCartCount, couponDiscount, cartFinalTotal, cartFinalWithoutShipping]);
      const handleUpdateCartItemQuantity = async (productId, newQuantity) => {
        // Check if new quantity is less than 1
        if (newQuantity < 1) {
            newQuantity = 1;
        }
        const token = localStorage.getItem('auth-token');
        let updateCartResult = await updateCart(token, productId, newQuantity, setCartItems, setCartCount, totalQty, setCartFinalTotal);
        console.log(updateCartResult)
        if(updateCartResult && !updateCartResult.success === true){
            console.log("In updatecartresult")
            if(updateCartResult.errcode){
                if(updateCartResult.errcode === "OUTOFSTOCK"){
                    alert("Item is out of stock")
                }
            }
        }
      };
      const handleQuantityChange = (event, productId) => {
        const newQuantity = parseInt(event.target.value);
        if (isNaN(newQuantity) || newQuantity < 1) {
            event.target.value = 1;
            return;
        }
        handleUpdateCartItemQuantity(productId, newQuantity);
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
          await fetchCartItems(token).then((data) => {
            setCartItems(data['cartItems']);
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
      const navigate = useNavigate();
      const handleCheckoutClick = async () => {
        if(isCouponCodeApplied){
            const token = localStorage.getItem('auth-token');
            try{
                await updateCouponCart(token, couponCode, discountedPrice);
            }catch(err){
                console.log(err);
            }
        }
        const token = localStorage.getItem('auth-token');
        await updateCartPrice(token,cartItems);
        navigate('/checkout');
      };
      const handleApplyCode = async () => {
        const token = localStorage.getItem('auth-token');
        if (!couponCode) {
            setCouponCodeMessage('Please enter a coupon code');
            return;
        }
        await applyCouponCode(token, couponCode)
        .then((data) => {
            if (data.status === 200) {
                setCouponCodeMessage('Coupon code applied successfully!');
                setIsCouponCodeApplied(true);
                console.log(data);
                setCouponDiscountPercentages(data.promotion.discount);
                const discount = parseFloat(data.promotion.discount) / 100;
                setCouponDiscount(discount);
            } else {
                setCouponCodeMessage(data.message);
                setIsCouponCodeApplied(false);
            }
        })
        .catch((error) => {
            console.error('There was a problem with the apply coupon code:', error);
        });

      };
      
      const getCouponCodeMessageClass = () => {
        console.log("Class is called")
        console.log(couponCodeMessage)
        let currentcouponcodemessage = couponCodeMessage.toLowerCase();
        if (currentcouponcodemessage.includes('successfully')) {
            console.log("Success")
            return 'alert alert-success';
        } else if (currentcouponcodemessage.includes('invalid') || currentcouponcodemessage.includes('not active') || currentcouponcodemessage.includes('expired') || currentcouponcodemessage.includes('already been used')) {
            console.log("danger")
          return 'alert alert-danger';
        } else if(currentcouponcodemessage.includes('enter')){
            console.log("info")
            return 'alert alert-info';
        } else {
            console.log("Nothing")
          return '';
        }
      };
      const handleRemoveCoupon = async() => {
        const token = localStorage.getItem('auth-token');
        await removeCouponFromCartUsingCouponCode(token, couponCode).then(async(data)=> {
            if(data.ok){
                await fetchCartItems(token).then((data) => {
                    setCartItems(data['cartItems']);
                    setCartFinalTotal(data['cartTotalAmount'])
                    setCartFinalWithoutShipping((data["cartTotalAmount"] - 40))
                    console.log(data['cartItems'])
                });
            }
        });
        setIsCouponCodeApplied(false);
        setCouponCode('');
        setDiscountAmount(0);
        setCouponDiscountPercentages(0);
        setDiscountedPrice(0);
        setDiscountedPriceWithoutShipping(0);
        setCouponDiscount(0);
        setCouponCodeMessage('');
      };

  return (
    <>
     <link rel="stylesheet" href={`${PUBLIC_CSS_DIR}/shopping_cart.css`} />

        <section className="h-100 h-custom" style={{ backgroundColor: 'rgb(255, 131, 131)',marginTop: "104px" }}>
        <div className="container py-5 h-100" style={{maxWidth: '90%'}}>
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
                                ) : (
                                    <div>
                                        <div className="row mb-4 d-flex justify-content-between align-items-center">
                                            <div className="col-md-2 col-lg-2 col-xl-2 text-left">
                                                <h6 className="text-muted">Image</h6>
                                            </div>
                                            <div className="col-md-3 col-lg-3 col-xl-2 text-center">
                                                <h6 className="text-muted">Name</h6>
                                            </div>
                                            <div className="col-md-3 col-lg-3 col-xl-2 d-flex text-center justify-content-center">
                                                <h6 className="text-muted">Quantity</h6>
                                            </div>
                                            <div className="col-md-3 col-lg-2 col-xl-2 text-center">
                                                <h6 className="text-muted">Unit Price</h6>
                                            </div>
                                            <div className="col-md-3 col-lg-2 col-xl-2 text-center">
                                                <h6 className="text-muted">Total Price</h6>
                                            </div>
                                            <div className="col-md-1 col-lg-1 col-xl-2 text-right">
                                                <h6 className="text-muted">Remove</h6>
                                            </div>
                                        </div>
                                        {cartItems.map((cartItem) => (
                                          <div className="row mb-4 d-flex justify-content-between align-items-center" key={cartItem._id}>
                                              <div className="col-md-2 col-lg-2 col-xl-2 text-left">
                                                  <img src={cartItem.product_id.images[0]} className="img-fluid rounded-3" alt={cartItem.product_id.name}/>
                                              </div>
                                              <div className="col-md-3 col-lg-3 col-xl-2 text-center">
                                                  <h6 className="text-muted">{categories[cartItem.product_id.category]}</h6>
                                                  <h6 className="text-black mb-0">
                                                    <Link to={"/product/"+cartItem.product_id.sku}>
                                                    {cartItem.product_id.name}
                                                    </Link>
                                                  </h6>
                                              </div>
                                              <div className="col-md-3 col-lg-3 col-xl-2 d-flex text-center justify-content-center">
                                                  <button className="btn px-2" onClick={() => handleUpdateCartItemQuantity(cartItem.product_id, cartItem.quantity - 1)}>
                                                      <i className="fa fa-minus"></i>
                                                  </button>
                                                  <input id="cart_product_qty" min="0" name="quantity" value={cartItem.quantity} type="text" onChange={(e) => handleQuantityChange(e, cartItem.product_id)} pattern="[0-9]*" className="form-control form-control-sm input-qty"/>
                                                  <button className="btn px-2" onClick={() => handleUpdateCartItemQuantity(cartItem.product_id, cartItem.quantity + 1)}>
                                                      <i className="fa fa-plus"></i>
                                                  </button>
                                              </div>
                                              <div className="col-md-3 col-lg-2 col-xl-2 text-center">
                                                  <h6 className="mb-0 price">&#8377;{cartItem.product_id.price}</h6>
                                              </div>
                                              <div className="col-md-3 col-lg-2 col-xl-2 text-center">
                                                  <h6 className="mb-0 price">&#8377;{cartItem.item_total}</h6>
                                              </div>
                                              <div className="col-md-1 col-lg-1 col-xl-2 text-right">
                                                  <button className="btn btn-link text-muted" onClick={() => handleDeleteClick(cartItem.product_id)}>
                                                      <i className="fa fa-times"></i>
                                                  </button>
                                              </div>
                                          </div>
                                      ))}

                                    </div>
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
                                    <p>
                                    Standard Delivery Charges: &#8377;40.00
                                    </p>
                                 {/*    {shippingMethods.map((shippingMethod) => (
                                        <p value={shippingMethod}> {shippingMethod}- &#8377;40</p>
                                    ))} */}
                                </div>
                                <h5 className="text-uppercase mb-3">Coupon code</h5>
                                <div className="mb-2">
                                    <div className="form-outline">
                                    <input
                                        type="text"
                                        id="coupon_code"
                                        className="form-control form-control-lg"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value)}
                                    />
                                    <label className="form-label" htmlFor="coupon_code">
                                        Enter your code
                                    </label>
                                    </div>
                                </div>
                                <button className="btn btn-primary btn-lg" id="apply_code" onClick={handleApplyCode}>
                                    Apply Code
                                </button>
                                {couponCodeMessage && <p className={'mt-3 ' + getCouponCodeMessageClass()}>{couponCodeMessage}</p>}
                                <hr className="my-4"/>
                                <div className="d-flex flex-column justify-content-between mb-2">
                                {isCouponCodeApplied && (
                                    <>
                                        <div className="d-flex justify-content-between mb-2">
                                        <h5 className="text-uppercase">Price Before Discount</h5>
                                        <h5 className="text-muted">&#8377;{cartFinalWithoutShipping.toFixed(2)}</h5>
                                        </div>
                                        <div className="d-flex justify-content-between mb-2">
                                        <div className="text-success">
                                            <h5 className="my-0">Coupon Code ({couponCode.toUpperCase()})</h5>
                                            <small className='text-success' style={{fontWeight: "500", fontSize: "16px"}}> ({couponDiscountPercentages}% Off) </small>
                                            <button className="btn remove-coupon pl-0" onClick={handleRemoveCoupon}>Remove</button>
                                        </div>
                                        <h5 className="text-success">- &#8377;{discountAmount}</h5>
                                        </div>
                                        <div className="d-flex justify-content-between mb-2">
                                        <h5 className="text-uppercase">Shipping Charge</h5>
                                        <h5>+ &#8377;40.00</h5>
                                        </div>
                                        <div className="d-flex justify-content-between mb-2">
                                        <h5 className="text-uppercase">Price After Discount</h5>
                                        <h5 className="text-success">&#8377;{discountedPrice}</h5>
                                        </div>
                                    </>
                                )}
                                {!isCouponCodeApplied && (
                                    <>
                                    <div className="d-flex justify-content-between mb-2">
                                        <h5 className="text-uppercase">Price</h5>
                                        <h5>&#8377;{cartFinalWithoutShipping.toFixed(2)}</h5>
                                    </div>
                                    <div className="d-flex justify-content-between mb-2">
                                        <h5 className="text-uppercase">Shipping Charges</h5>
                                        <h5>+ &#8377;40.00</h5>
                                    </div>
                                    <div className="d-flex justify-content-between mb-2">
                                        <h5 className="text-uppercase">Total price</h5>
                                        <h5>&#8377;{cartFinalTotal}</h5>
                                    </div>
                                    
                                    </>
                                )}
                                </div>
                                <button type="button" className="btn btn-dark btn-block btn-lg" data-mdb-ripple-color="dark" onClick={handleCheckoutClick}>Checkout</button>
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

