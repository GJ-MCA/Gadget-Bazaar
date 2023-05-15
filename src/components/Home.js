import React, { useState, useEffect } from 'react'
import {ProductList} from './Products/ProductList'
import { Link } from 'react-router-dom'
import { orderAPIUrl } from '../config/config';
const config = require("../config/config");

export const Home = () => {
   const [coupon, setCoupon] = useState(null);

   useEffect(() => {
     async function fetchCoupon() {
       try {
         const response = await fetch(`${orderAPIUrl}/get-active-coupon`);
         const data = await response.json();
         console.log(data)
         if(response.ok)
            setCoupon(data);
       } catch (error) {
         console.error(error);
       }
     }
 
     fetchCoupon();
   }, []);
  return (
    <> 
	<div className="hero_area">
         {/* <!-- slider section --> */}
         {coupon && (
         <section className="slider_section ">
            <div className="slider_bg_box">
               <img src="/assets/img/slider-bg.jpg" alt=""/>
            </div>
            <div id="customCarousel1" className="carousel slide" data-ride="carousel">
               <div className="carousel-inner">
                  <div className="carousel-item active">
                     <div className="container ">
                        <div className="row">
                           <div className="col-md-7 col-lg-6 ">
                              <div className="detail-box">
                                 <h1>
                                    <span>
                                    Sale {coupon && coupon.promotion_name && coupon.promotion_name}
                                    </span>
                                    <br/>
                                    On Everything
                                 </h1>
                                 <p>
                                 Ready to save on your next order? Use the code '{coupon && coupon.coupon_code && coupon.coupon_code}' to enjoy '{coupon && coupon.promotion_name && coupon.promotion_name}' on everything. Don't wait, shop now!
                                 </p>
                                 <div className="btn-box">
                                    <Link to="/products" className="btn1">
                                    Shop Now
                                    </Link>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </section>
            )}

         {/* <!-- end slider section --> */}
      </div>
      {/* <!-- why section --> */}
      <section className="why_section layout_padding">
         <div className="container">
            <div className="heading_container heading_center">
               <h2>
                  Why Shop With Us
               </h2>
            </div>
            <div className="row">
               <div className="col-md-4">
                  <div className="box ">
                     <div className="img-box">
                        <img className="svg-img" src="/assets/img/svg/fast-delivery.svg" alt="Fast Delivery"/>
                     </div>
                     <div className="detail-box">
                        <h5>
                           Fast Delivery
                        </h5>
                        <p>
                           Don't wait around for your new gadget to arrive. Our fast delivery service guarantees your order will be on your doorstep in record time, so you can start using your new device right away.
                        </p>
                     </div>
                  </div>
               </div>
               <div className="col-md-4">
                  <div className="box ">
                     <div className="img-box">
                     <img className="svg-img" src="/assets/img/svg/cart-icon-white.svg" alt="Free Shipping"/>
                     </div>
                     <div className="detail-box">
                        <h5>
                        Best Value
                        </h5>
                        <p>
                        We are committed to providing our customers with the best value for their money. Our competitive prices, combined with our fast delivery and high-quality products, make us the go-to destination for the latest tech.
                        </p>
                     </div>
                  </div>
               </div>
               <div className="col-md-4">
                  <div className="box ">
                     <div className="img-box">
                     <img className="svg-img" src="/assets/img/svg/best-quality.svg" alt="Best Quality"/>
                     </div>
                     <div className="detail-box">
                        <h5>
                           Best Quality
                        </h5>
                        <p>
                        Quality is our top priority at GadgetBazaar. We believe that our customers deserve nothing but the best, which is why we go above and beyond to ensure that every product we offer is of the highest quality.
                        </p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>
      {/* <!-- end why section --> */}
      
      {/* <!-- product section --> */}
      <ProductList/>
      {/* <!-- end product section --> */}
    </>
  )
}