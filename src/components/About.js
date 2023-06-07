import React from 'react'
import { Link } from 'react-router-dom'
import { setPageTitle } from '../helpers/titleHelper'
export const About = () => {
  return (
  <>
       {/* inner page section */}
       <section className="inner_page_head">
       {setPageTitle("About Us")}
        <div className="container_fuild">
          <div className="row">
            <div className="col-md-12">
              <div className="full">
                <h3>About us</h3>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* end inner page section */}

      {/* why section */}
      <section className="layout_padding why_section">
        <div className="container">
          <div className="row">
          <div className="col-md-12">
          <div className="heading">
                <h2>Introduction</h2>
              </div>
            <p>Welcome to GadgetBazaar, your number one source for all things tech. We're dedicated to giving you the very best of products, with a focus on quality, affordability and customer satisfaction.</p>
            <p>Founded in 2021, GadgetBazaar has come a long way from its beginnings in a small office in Ahmedabad. When we first started out, our passion for technology drove us to research and review the latest gadgets, and gave us the impetus to turn hard work and inspiration into a booming online store. We now serve customers all over the world, and are thrilled to be a part of the tech industry.</p>
            <p>We hope you enjoy our products as much as we enjoy offering them to you. If you have any questions or comments, please don't hesitate to <Link to="/contact" class="text-primary">contact us</Link>.</p>
            <p>Sincerely,<br/>The GadgetBazaar Team</p>
         </div>
            <div className="col-md-12">
              <div className="heading">
                <h2>Why Choose Us</h2>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-4">
              <div className="full why_box">
                <div className="icon text-center mb-2 mt-2">
                  <img src="/assets/img/quality.png" width={'100'} alt="Quality Products" />
                </div>
                <div className="inner text-center">
                  <h4>Quality Products</h4>
                  <p>We only offer high-quality and reliable products to our customers.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="full why_box">
                <div className="icon text-center mb-2 mt-2">
                  <img src="/assets/img/blocked.png" width={'100'} alt="Secured Transactions" />
                </div>
                <div className="inner text-center">
                  <h4>Secure Transactions</h4>
                  <p>We ensure that all transactions made on our website are safe and secure.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="full why_box">
                <div className="icon text-center mb-2 mt-2">
                  <img src="/assets/img/help-desk.png" width={'100'} alt="Customer Support" />
                </div>
                <div className="inner text-center">
                  <h4>Customer Support</h4>
                  <p>We provide excellent customer support to assist our customers in any way possible.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* end why section */}

      {/* mission section */}
      <section className="mission_section">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <div className="full">
                <div className="heading">
                  <h2>Our Mission</h2>
                </div>
                <div className="mission">
                  <ul>
                    <li><i className="fa fa-check"></i> To provide high-quality products to our customers.</li>
                    <li><i className="fa fa-check"></i> To ensure that all transactions made on our website are safe and secure.</li>
                    <li><i className="fa fa-check"></i> To provide excellent customer support to assist our customers in any way possible.</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-2">
              <div className="full">
                <img src="/assets/img/our-mission.jpg" className='mb-4' alt="#" width="500"/>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* end mission section */}

  </>
  )
}
