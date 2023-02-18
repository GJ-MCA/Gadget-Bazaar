import React from 'react'

export const Home = () => {
  return (
    <> 
	<div className="hero_area">
         {/* <!-- slider section --> */}
         <section className="slider_section ">
            <div className="slider_bg_box">
               <img src="assets/img/slider-bg.jpg" alt=""/>
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
                                    Sale 20% Off
                                    </span>
                                    <br/>
                                    On Everything
                                 </h1>
                                 <p>
                                    Explicabo esse amet tempora quibusdam laudantium, laborum eaque magnam fugiat hic? Esse dicta aliquid error repudiandae earum suscipit fugiat molestias, veniam, vel architecto veritatis delectus repellat modi impedit sequi.
                                 </p>
                                 <div className="btn-box">
                                    <a href="" className="btn1">
                                    Shop Now
                                    </a>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
                  <div className="carousel-item ">
                     <div className="container ">
                        <div className="row">
                           <div className="col-md-7 col-lg-6 ">
                              <div className="detail-box">
                                 <h1>
                                    <span>
                                    Sale 20% Off
                                    </span>
                                    <br/>
                                    On Everything
                                 </h1>
                                 <p>
                                    Explicabo esse amet tempora quibusdam laudantium, laborum eaque magnam fugiat hic? Esse dicta aliquid error repudiandae earum suscipit fugiat molestias, veniam, vel architecto veritatis delectus repellat modi impedit sequi.
                                 </p>
                                 <div className="btn-box">
                                    <a href="" className="btn1">
                                    Shop Now
                                    </a>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
                  <div className="carousel-item">
                     <div className="container ">
                        <div className="row">
                           <div className="col-md-7 col-lg-6 ">
                              <div className="detail-box">
                                 <h1>
                                    <span>
                                    Sale 20% Off
                                    </span>
                                    <br/>
                                    On Everything
                                 </h1>
                                 <p>
                                    Explicabo esse amet tempora quibusdam laudantium, laborum eaque magnam fugiat hic? Esse dicta aliquid error repudiandae earum suscipit fugiat molestias, veniam, vel architecto veritatis delectus repellat modi impedit sequi.
                                 </p>
                                 <div className="btn-box">
                                    <a href="" className="btn1">
                                    Shop Now
                                    </a>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
               <div className="container">
                  <ol className="carousel-indicators">
                     <li data-target="#customCarousel1" data-slide-to="0" className="active"></li>
                     <li data-target="#customCarousel1" data-slide-to="1"></li>
                     <li data-target="#customCarousel1" data-slide-to="2"></li>
                  </ol>
               </div>
            </div>
         </section>
         <form method="POST" action="http://localhost:5000/gadgetbazaar/admin/products/add" encType="application/x-www-form-urlencoded">
               <label htmlFor="name">Name:</label>
               <input type="text" name="name" required/>
               <b/>
               <label htmlFor="desc">Description:</label>
               <input type="text" name="desc" required/>
               <br/>
               <label htmlFor="sku">SKU:</label>
               <input type="text" name="sku" required/>
               <br/>
               <label htmlFor="category">Category:</label>
               <input type="text" name="category" required/>
               <br/>
               <label htmlFor="price">Price:</label>
               <input type="number" name="price" required/>
               <br/>
               <button type="submit">Add Product</button>
            </form>

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
                           variations of passages of Lorem Ipsum available
                        </p>
                     </div>
                  </div>
               </div>
               <div className="col-md-4">
                  <div className="box ">
                     <div className="img-box">
                     <img className="svg-img" src="/assets/img/svg/free-shipping.svg" alt="Free Shipping"/>
                     </div>
                     <div className="detail-box">
                        <h5>
                           Free Shiping
                        </h5>
                        <p>
                           variations of passages of Lorem Ipsum available
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
                           variations of passages of Lorem Ipsum available
                        </p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>
      {/* <!-- end why section --> */}
      
      {/* <!-- arrival section --> */}
      <section className="arrival_section">
         <div className="container">
            <div className="box">
               <div className="arrival_bg_box">
                  <img src="assets/img/arrival-bg.png" alt=""/>
               </div>
               <div className="row">
                  <div className="col-md-6 ml-auto">
                     <div className="heading_container remove_line_bt">
                        <h2>
                           #NewArrivals
                        </h2>
                     </div>
                     <p style={{marginRight: 20 + 'px',marginBottom: 30 + 'px'}}>
                        Vitae fugiat laboriosam officia perferendis provident aliquid voluptatibus dolorem, fugit ullam sit earum id eaque nisi hic? Tenetur commodi, nisi rem vel, ea eaque ab ipsa, autem similique ex unde!
                     </p>
                     <a href="">
                     Shop Now
                     </a>
                  </div>
               </div>
            </div>
         </div>
      </section>
      {/* <!-- end arrival section --> */}
      
      {/* <!-- product section --> */}
      <section className="product_section layout_padding">
         <div className="container">
            <div className="heading_container heading_center">
               <h2>
                  Our <span>products</span>
               </h2>
            </div>
            <div className="row">
               <div className="col-sm-6 col-md-4 col-lg-4">
                  <div className="box">
                     <div className="option_container">
                        <div className="options">
                           <a href="" className="option1">
                           Men's Shirt
                           </a>
                           <a href="" className="option2">
                           Buy Now
                           </a>
                        </div>
                     </div>
                     <div className="img-box">
                        <img src="assets/img/p1.png" alt=""/>
                     </div>
                     <div className="detail-box">
                        <h5>
                           Men's Shirt
                        </h5>
                        <h6>
                           $75
                        </h6>
                     </div>
                  </div>
               </div>
               <div className="col-sm-6 col-md-4 col-lg-4">
                  <div className="box">
                     <div className="option_container">
                        <div className="options">
                           <a href="" className="option1">
                           Add To Cart
                           </a>
                           <a href="" className="option2">
                           Buy Now
                           </a>
                        </div>
                     </div>
                     <div className="img-box">
                        <img src="assets/img/p2.png" alt=""/>
                     </div>
                     <div className="detail-box">
                        <h5>
                           Men's Shirt
                        </h5>
                        <h6>
                           $80
                        </h6>
                     </div>
                  </div>
               </div>
               <div className="col-sm-6 col-md-4 col-lg-4">
                  <div className="box">
                     <div className="option_container">
                        <div className="options">
                           <a href="" className="option1">
                           Add To Cart
                           </a>
                           <a href="" className="option2">
                           Buy Now
                           </a>
                        </div>
                     </div>
                     <div className="img-box">
                        <img src="assets/img/p3.png" alt=""/>
                     </div>
                     <div className="detail-box">
                        <h5>
                           Women's Dress
                        </h5>
                        <h6>
                           $68
                        </h6>
                     </div>
                  </div>
               </div>
               <div className="col-sm-6 col-md-4 col-lg-4">
                  <div className="box">
                     <div className="option_container">
                        <div className="options">
                           <a href="" className="option1">
                           Add To Cart
                           </a>
                           <a href="" className="option2">
                           Buy Now
                           </a>
                        </div>
                     </div>
                     <div className="img-box">
                        <img src="assets/img/p4.png" alt=""/>
                     </div>
                     <div className="detail-box">
                        <h5>
                           Women's Dress
                        </h5>
                        <h6>
                           $70
                        </h6>
                     </div>
                  </div>
               </div>
               <div className="col-sm-6 col-md-4 col-lg-4">
                  <div className="box">
                     <div className="option_container">
                        <div className="options">
                           <a href="" className="option1">
                           Add To Cart
                           </a>
                           <a href="" className="option2">
                           Buy Now
                           </a>
                        </div>
                     </div>
                     <div className="img-box">
                        <img src="assets/img/p5.png" alt=""/>
                     </div>
                     <div className="detail-box">
                        <h5>
                           Women's Dress
                        </h5>
                        <h6>
                           $75
                        </h6>
                     </div>
                  </div>
               </div>
               <div className="col-sm-6 col-md-4 col-lg-4">
                  <div className="box">
                     <div className="option_container">
                        <div className="options">
                           <a href="" className="option1">
                           Add To Cart
                           </a>
                           <a href="" className="option2">
                           Buy Now
                           </a>
                        </div>
                     </div>
                     <div className="img-box">
                        <img src="assets/img/p6.png" alt=""/>
                     </div>
                     <div className="detail-box">
                        <h5>
                           Women's Dress
                        </h5>
                        <h6>
                           $58
                        </h6>
                     </div>
                  </div>
               </div>
               <div className="col-sm-6 col-md-4 col-lg-4">
                  <div className="box">
                     <div className="option_container">
                        <div className="options">
                           <a href="" className="option1">
                           Add To Cart
                           </a>
                           <a href="" className="option2">
                           Buy Now
                           </a>
                        </div>
                     </div>
                     <div className="img-box">
                        <img src="assets/img/p7.png" alt=""/>
                     </div>
                     <div className="detail-box">
                        <h5>
                           Women's Dress
                        </h5>
                        <h6>
                           $80
                        </h6>
                     </div>
                  </div>
               </div>
               <div className="col-sm-6 col-md-4 col-lg-4">
                  <div className="box">
                     <div className="option_container">
                        <div className="options">
                           <a href="" className="option1">
                           Add To Cart
                           </a>
                           <a href="" className="option2">
                           Buy Now
                           </a>
                        </div>
                     </div>
                     <div className="img-box">
                        <img src="assets/img/p8.png" alt=""/>
                     </div>
                     <div className="detail-box">
                        <h5>
                           Men's Shirt
                        </h5>
                        <h6>
                           $65
                        </h6>
                     </div>
                  </div>
               </div>
               <div className="col-sm-6 col-md-4 col-lg-4">
                  <div className="box">
                     <div className="option_container">
                        <div className="options">
                           <a href="" className="option1">
                           Add To Cart
                           </a>
                           <a href="" className="option2">
                           Buy Now
                           </a>
                        </div>
                     </div>
                     <div className="img-box">
                        <img src="assets/img/p9.png" alt=""/>
                     </div>
                     <div className="detail-box">
                        <h5>
                           Men's Shirt
                        </h5>
                        <h6>
                           $65
                        </h6>
                     </div>
                  </div>
               </div>
               <div className="col-sm-6 col-md-4 col-lg-4">
                  <div className="box">
                     <div className="option_container">
                        <div className="options">
                           <a href="" className="option1">
                           Add To Cart
                           </a>
                           <a href="" className="option2">
                           Buy Now
                           </a>
                        </div>
                     </div>
                     <div className="img-box">
                        <img src="assets/img/p10.png" alt=""/>
                     </div>
                     <div className="detail-box">
                        <h5>
                           Men's Shirt
                        </h5>
                        <h6>
                           $65
                        </h6>
                     </div>
                  </div>
               </div>
               <div className="col-sm-6 col-md-4 col-lg-4">
                  <div className="box">
                     <div className="option_container">
                        <div className="options">
                           <a href="" className="option1">
                           Add To Cart
                           </a>
                           <a href="" className="option2">
                           Buy Now
                           </a>
                        </div>
                     </div>
                     <div className="img-box">
                        <img src="assets/img/p11.png" alt=""/>
                     </div>
                     <div className="detail-box">
                        <h5>
                           Men's Shirt
                        </h5>
                        <h6>
                           $65
                        </h6>
                     </div>
                  </div>
               </div>
               <div className="col-sm-6 col-md-4 col-lg-4">
                  <div className="box">
                     <div className="option_container">
                        <div className="options">
                           <a href="" className="option1">
                           Add To Cart
                           </a>
                           <a href="" className="option2">
                           Buy Now
                           </a>
                        </div>
                     </div>
                     <div className="img-box">
                        <img src="assets/img/p12.png" alt=""/>
                     </div>
                     <div className="detail-box">
                        <h5>
                           Women's Dress
                        </h5>
                        <h6>
                           $65
                        </h6>
                     </div>
                  </div>
               </div>
            </div>
            <div className="btn-box">
               <a href="">
               View All products
               </a>
            </div>
         </div>
      </section>
      {/* <!-- end product section --> */}

      {/* <!-- subscribe section --> */}
      <section className="subscribe_section">
         <div className="container-fuild">
            <div className="box">
               <div className="row">
                  <div className="col-md-6 offset-md-3">
                     <div className="subscribe_form ">
                        <div className="heading_container heading_center">
                           <h3>Subscribe To Get Discount Offers</h3>
                        </div>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor</p>
                        <form action="">
                           <input type="email" placeholder="Enter your email"/>
                           <button>
                           subscribe
                           </button>
                        </form>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>
      {/* <!-- end subscribe section --> */}
      {/* <!-- client section --> */}
      <section className="client_section layout_padding">
         <div className="container">
            <div className="heading_container heading_center">
               <h2>
                  Customer's Testimonial
               </h2>
            </div>
            <div id="carouselExample3Controls" className="carousel slide" data-ride="carousel">
               <div className="carousel-inner">
                  <div className="carousel-item active">
                     <div className="box col-lg-10 mx-auto">
                        <div className="img_container">
                           <div className="img-box">
                              <div className="img_box-inner">
                                 <img src="assets/img/client.jpg" alt=""/>
                              </div>
                           </div>
                        </div>
                        <div className="detail-box">
                           <h5>
                              Anna Trevor
                           </h5>
                           <h6>
                              Customer
                           </h6>
                           <p>
                              Dignissimos reprehenderit repellendus nobis error quibusdam? Atque animi sint unde quis reprehenderit, et, perspiciatis, debitis totam est deserunt eius officiis ipsum ducimus ad labore modi voluptatibus accusantium sapiente nam! Quaerat.
                           </p>
                        </div>
                     </div>
                  </div>
                  <div className="carousel-item">
                     <div className="box col-lg-10 mx-auto">
                        <div className="img_container">
                           <div className="img-box">
                              <div className="img_box-inner">
                                 <img src="assets/img/client.jpg" alt=""/>
                              </div>
                           </div>
                        </div>
                        <div className="detail-box">
                           <h5>
                              Anna Trevor
                           </h5>
                           <h6>
                              Customer
                           </h6>
                           <p>
                              Dignissimos reprehenderit repellendus nobis error quibusdam? Atque animi sint unde quis reprehenderit, et, perspiciatis, debitis totam est deserunt eius officiis ipsum ducimus ad labore modi voluptatibus accusantium sapiente nam! Quaerat.
                           </p>
                        </div>
                     </div>
                  </div>
                  <div className="carousel-item">
                     <div className="box col-lg-10 mx-auto">
                        <div className="img_container">
                           <div className="img-box">
                              <div className="img_box-inner">
                                 <img src="assets/img/client.jpg" alt=""/>
                              </div>
                           </div>
                        </div>
                        <div className="detail-box">
                           <h5>
                              Anna Trevor
                           </h5>
                           <h6>
                              Customer
                           </h6>
                           <p>
                              Dignissimos reprehenderit repellendus nobis error quibusdam? Atque animi sint unde quis reprehenderit, et, perspiciatis, debitis totam est deserunt eius officiis ipsum ducimus ad labore modi voluptatibus accusantium sapiente nam! Quaerat.
                           </p>
                        </div>
                     </div>
                  </div>
               </div>
               <div className="carousel_btn_box">
                  <a className="carousel-control-prev" href="#carouselExample3Controls" role="button" data-slide="prev">
                  <i className="fa fa-long-arrow-left" aria-hidden="true"></i>
                  <span className="sr-only">Previous</span>
                  </a>
                  <a className="carousel-control-next" href="#carouselExample3Controls" role="button" data-slide="next">
                  <i className="fa fa-long-arrow-right" aria-hidden="true"></i>
                  <span className="sr-only">Next</span>
                  </a>
               </div>
            </div>
         </div>
      </section>
      {/* <!-- end client section --> */}
    </>
  )
}