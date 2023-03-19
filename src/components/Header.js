	import React, { useState, useEffect } from 'react'
	import {
		Link, useLocation
	} from "react-router-dom";
	const config = require("../config/config")
	export const Header = () => {
	
		const [user, setUser] = useState(null);
		const location = useLocation();
		useEffect(() => {
			// Check if the user is logged in and set the user state accordingly
			const token = localStorage.getItem('auth-token');
			if (token) {
				// Make an API call to get the user's details
				fetch(`${config.authAPIUrl}/getuser`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'auth-token': `Bearer ${token}`
				},
				})
				.then(response => {
				if (response.ok) {
					return response.json();
				}
				throw new Error('Network response was not ok');
				})
				.then(data => {
					setUser(data);
				})
				.catch(error => {
				console.error('There was a problem with the fetch operation:', error);
				});
			}else{
				setUser(null);		
			}
			
		}, [user]);
	
		const handleLogout = () => {
		console.log('Logging out...');
		// Remove the token from local storage to log the user out
		setUser(null);
		localStorage.removeItem('auth-token');
	 	};
	  
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
									<li className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
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
									<li className={`nav-item ${location.pathname === '/products' ? 'active' : ''}`}>
										<Link className="nav-link" to="/products">Products</Link>
									</li>
									<li className="nav-item">
										<Link className="nav-link" to="contact.html">Contact</Link>
									</li>
									<li className={`nav-item ${location.pathname === '/about' ? 'active' : ''}`}>
										<Link className="nav-link" to="about">About Us</Link>
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
									{user ? (
										<>
											<li className={`nav-item ${location.pathname === '/profile' ? 'active' : ''}`}>
											<Link className="nav-link" to="/profile">
												{user.name}
											</Link>
											</li>
											<li className="nav-item">
											<button className="nav-link" onClick={handleLogout}>
												Logout
											</button>
											</li>
										</>
										) : (
										<>
											<li className={`nav-item ${location.pathname === '/login' ? 'active' : ''}`}>
											<Link className="nav-link" to="/login">
												Login
											</Link>
											</li>
											<li className={`nav-item ${location.pathname === '/register' ? 'active' : ''}`}>
											<Link className="nav-link" to="/register">
												Register
											</Link>
											</li>
										</>
										)}

								</ul>
							</div>
						</nav>
					</div>
				</header>
				{/* <!-- end header section --> */}
			</>
		)
	}
