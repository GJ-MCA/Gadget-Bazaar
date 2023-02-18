import React from 'react'
import {
	Link,
} from "react-router-dom";
export const Header = () => {
	return (
		<>
			{/*  <!-- header section starts --> */}
			<header className="header_section">
				<div className="container">
					<nav className="navbar navbar-expand-lg custom_nav-container ">
						<Link className="navbar-brand" to="/"><img width="150" src="assets/img/logo.png" alt="#" /></Link>
						<button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
							<span className=""> </span>
						</button>
						<div className="collapse navbar-collapse" id="navbarSupportedContent">
							<ul className="navbar-nav">
								<li className="nav-item active">
									<Link className="nav-link" to="/">Home <span className="sr-only">(current)</span></Link>
								</li>
								<li className="nav-item dropdown">
									<Link className="nav-link dropdown-toggle" to="#" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="true">
										<span className="nav-label">Pages <span className="caret"></span> </span></Link>
									<ul className="dropdown-menu">
										<li><Link to="/about">About</Link></li>
										<li><Link to="testimonial.html">Testimonial</Link></li>
									</ul>
								</li>
								<li className="nav-item">
									<Link className="nav-link" to="product.html">Products</Link>
								</li>
								<li className="nav-item">
									<Link className="nav-link" to="blog_list.html">Blog</Link>
								</li>
								<li className="nav-item">
									<Link className="nav-link" to="contact.html">Contact</Link>
								</li>
								<li className="nav-item">
									<Link className="nav-link cart" to="#">
								    <i className="fa fa-shopping-cart"></i>
									</Link>
								</li>
								<form className="form-inline">
									<button className="btn  my-2 my-sm-0 nav_search-btn" type="submit">
										<i className="fa fa-search" aria-hidden="true"></i>
									</button>
								</form>
							</ul>
						</div>
					</nav>
				</div>
			</header>
			{/* <!-- end header section --> */}
		</>
	)
}
