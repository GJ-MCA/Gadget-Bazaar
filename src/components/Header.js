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
						<a className="navbar-brand" href="index.html"><img width="150" src="assets/img/logo.png" alt="#" /></a>
						<button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
							<span className=""> </span>
						</button>
						<div className="collapse navbar-collapse" id="navbarSupportedContent">
							<ul className="navbar-nav">
								<li className="nav-item active">
									<a className="nav-link" href="index.html">Home <span className="sr-only">(current)</span></a>
								</li>
								<li className="nav-item dropdown">
									<a className="nav-link dropdown-toggle" href="#" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="true">
										<span className="nav-label">Pages <span className="caret"></span> </span></a>
									<ul className="dropdown-menu">
										<li><a href="about.html">About</a></li>
										<li><a href="testimonial.html">Testimonial</a></li>
									</ul>
								</li>
								<li className="nav-item">
									<a className="nav-link" href="product.html">Products</a>
								</li>
								<li className="nav-item">
									<a className="nav-link" href="blog_list.html">Blog</a>
								</li>
								<li className="nav-item">
									<a className="nav-link" href="contact.html">Contact</a>
								</li>
								<li className="nav-item">
									<a className="nav-link" href="#">
								    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0"
      y="0"
      enableBackground="new 0 0 456.029 456.029"
      version="1.1"
      viewBox="0 0 456.029 456.029"
      xmlSpace="preserve"
    >
      <path d="M345.6 338.862c-29.184 0-53.248 23.552-53.248 53.248 0 29.184 23.552 53.248 53.248 53.248 29.184 0 53.248-23.552 53.248-53.248-.512-29.184-24.064-53.248-53.248-53.248zM439.296 84.91c-1.024 0-2.56-.512-4.096-.512H112.64l-5.12-34.304C104.448 27.566 84.992 10.67 61.952 10.67H20.48C9.216 10.67 0 19.886 0 31.15c0 11.264 9.216 20.48 20.48 20.48h41.472c2.56 0 4.608 2.048 5.12 4.608l31.744 216.064c4.096 27.136 27.648 47.616 55.296 47.616h212.992c26.624 0 49.664-18.944 55.296-45.056l33.28-166.4c2.048-10.752-5.12-21.504-16.384-23.552zM215.04 389.55c-1.024-28.16-24.576-50.688-52.736-50.688-29.696 1.536-52.224 26.112-51.2 55.296 1.024 28.16 24.064 50.688 52.224 50.688h1.024c29.184-1.536 52.224-26.112 50.688-55.296z"></path>
    </svg>
									</a>
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
