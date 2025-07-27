import React from 'react'
import { Link } from 'react-router-dom'

export const Footer = () => {
  return (
    <>
	{/* <!-- footer start --> */}
      <footer>
         <div className="container">
            <div className="row">
               <div className="col-md-4">
                   <div className="full">
                      <div className="logo_footer">
                        <Link to="/"><img width="210" src="/assets/img/logo.png" alt="Gadget Bazaar" /></Link>
                      </div>
                      <div className="information_f">
                        <p><strong>ADDRESS:</strong> XX-XX XXXX, Dummy Address Road, Dummy City - XXXXXX</p>
                        <p><strong>TELEPHONE:</strong> +91 XX XX XX XXXX</p>
                        <p><strong>EMAIL:</strong> contact@example.com</p>
                      </div>
                   </div>
               </div>
               <div className="col-md-8">
                  <div className="row">
                  <div className="col-md-7">
                     <div className="row">
                        <div className="col-md-6">
                     <div className="widget_menu">
                        <h3>Menu</h3>
                        <ul>
                           <li><Link to="/">Home</Link></li>
                           <li><Link to="/about">About</Link></li>
                           <li><Link to="/contact">Contact</Link></li>
                        </ul>
                     </div>
                  </div>
                  <div className="col-md-6">
                     <div className="widget_menu">
                        <h3>Account</h3>
                        <ul>
                           <li><Link to="/my-account">Account</Link></li>
                        </ul>
                     </div>
                  </div>
                     </div>
                  </div>     
                  </div>
               </div>
            </div>
         </div>
      </footer>
      {/* <!-- footer end --> */}
      <div className="cpy_">
         <p className="mx-auto">© {new Date().getFullYear()} All Rights Reserved By <Link to="/">Gadget Bazaar</Link></p>
         <p className="mx-auto" style={{marginTop: "10px", fontSize: "0.9em", color: "#999"}}>
           This is a college project and not a real e-commerce website. All content is for demonstration purposes only.
         </p>
      </div>
    </>
  )
}
