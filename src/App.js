import React from 'react'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Root from './routes/root';
import {Home} from './components/Home'
import {About} from './components/About'
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ForgotPassword from './components/Auth/ForgotPassword';
import ProductList from './components/Products/ProductList';
import { CartProvider } from './context/GadgetBazaarContext';
import { ShoppingCart } from './components/Order/ShoppingCart';
import NotFound from './components/NotFound';
import Contact from './components/Contact';
import AdminLogin from './components/Admin/Auth/AdminLogin';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { Checkout } from './components/Order/Checkout';
const AdminLayout = ({ children }) => {
  return (
    <>
      <div className="wrapper ">
        <div className="sidebar" data-color="white" data-active-color="danger">
          <div className="logo">
            <a href="https://www.creative-tim.com" className="simple-text logo-mini">
              <div className="logo-image-small">
                <img src={`${process.env.PUBLIC_URL}/assets/admin_assets/img/logo-small.png`}/>
              </div>
            </a>
            <a href="https://www.creative-tim.com" className="simple-text logo-normal">
              Creative Tim
              <div className="logo-image-big">
                <img src={`${process.env.PUBLIC_URL}/assets/admin_assets/img/logo-big.png`}/>
              </div>
            </a>
          </div>
          <div className="sidebar-wrapper">
            <ul className="nav">
              <li className="active ">
                <a href="./dashboard.html">
                  <i className="nc-icon nc-bank"></i>
                  <p>Dashboard</p>
                </a>
              </li>
              <li>
                <a href="./icons.html">
                  <i className="nc-icon nc-diamond"></i>
                  <p>Icons</p>
                </a>
              </li>
              <li>
                <a href="./map.html">
                  <i className="nc-icon nc-pin-3"></i>
                  <p>Maps</p>
                </a>
              </li>
              <li>
                <a href="./notifications.html">
                  <i className="nc-icon nc-bell-55"></i>
                  <p>Notifications</p>
                </a>
              </li>
              <li>
                <a href="./user.html">
                  <i className="nc-icon nc-single-02"></i>
                  <p>User Profile</p>
                </a>
              </li>
              <li>
                <a href="./tables.html">
                  <i className="nc-icon nc-tile-56"></i>
                  <p>Table List</p>
                </a>
              </li>
              <li>
                <a href="./typography.html">
                  <i className="nc-icon nc-caps-small"></i>
                  <p>Typography</p>
                </a>
              </li>
              <li className="active-pro">
                <a href="./upgrade.html">
                  <i className="nc-icon nc-spaceship"></i>
                  <p>Upgrade to PRO</p>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="main-panel" style={{height: '100vh',paddingLeft: '20px', paddingRight: '20px'}}>
          <nav className="navbar navbar-expand-lg navbar-absolute fixed-top navbar-transparent">
            <div className="container-fluid">
              <div className="navbar-wrapper">
                <div className="navbar-toggle">
                  <button type="button" className="navbar-toggler">
                    <span className="navbar-toggler-bar bar1"></span>
                    <span className="navbar-toggler-bar bar2"></span>
                    <span className="navbar-toggler-bar bar3"></span>
                  </button>
                </div>
                <a className="navbar-brand" href="javascript:;">Paper Dashboard 2</a>
              </div>
              <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navigation" aria-controls="navigation-index" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-bar navbar-kebab"></span>
                <span className="navbar-toggler-bar navbar-kebab"></span>
                <span className="navbar-toggler-bar navbar-kebab"></span>
              </button>
              <div className="collapse navbar-collapse justify-content-end" id="navigation">
                <ul className="navbar-nav">
                  <li className="nav-item">
                    <a className="nav-link btn-magnify" href="javascript:;">
                      <i className="nc-icon nc-layout-11"></i>
                      <p>
                        <span className="d-lg-none d-md-block">Stats</span>
                      </p>
                    </a>
                  </li>
                  <li className="nav-item btn-rotate dropdown">
                    <a className="nav-link dropdown-toggle" href="http://example.com" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      <i className="nc-icon nc-bell-55"></i>
                      <p>
                        <span className="d-lg-none d-md-block">Some Actions</span>
                      </p>
                    </a>
                    <div className="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdownMenuLink">
                      <a className="dropdown-item" href="#">Action</a>
                      <a className="dropdown-item" href="#">Another action</a>
                      <a className="dropdown-item" href="#">Something else here</a>
                    </div>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link btn-rotate" href="javascript:;">
                      <i className="nc-icon nc-settings-gear-65"></i>
                      <p>
                        <span className="d-lg-none d-md-block">Account</span>
                      </p>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
          <main style={{marginTop: '80px'}}>
            {children}
          </main>
          <footer className="footer footer-black  footer-white " style={{ bottom: 0, position: 'absolute', width: '100%' }}>
            <div className="container-fluid">
              <div className="row">
                <div className="credits ml-auto">
                  <span className="copyright">
                    © <span id='cr_year'>
                      2023 &nbsp;
                      </span> 
                     made with <i className="fa fa-heart heart"></i> by Gadgetbazaar
                  </span>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
      <link href="https://fonts.googleapis.com/css?family=Montserrat:400,700,200" rel="stylesheet" />
      <link href="https://maxcdn.bootstrapcdn.com/font-awesome/latest/css/font-awesome.min.css" rel="stylesheet"/>
      <link href={`${process.env.PUBLIC_URL}/assets/admin_assets/css/bootstrap.min.css" rel="stylesheet`} />
      <link href={`${process.env.PUBLIC_URL}/assets/admin_assets/css/paper-dashboard.css?v=2.0.1`} rel="stylesheet" />
      <link href={`${process.env.PUBLIC_URL}/assets/admin_assets/demo/demo.css`} rel="stylesheet" />
      <script src={`${process.env.PUBLIC_URL}/assets/admin_assets/js/core/popper.min.js`}></script>
      <script src={`${process.env.PUBLIC_URL}/assets/admin_assets/js/core/bootstrap.min.js`}></script>
      <script src={`${process.env.PUBLIC_URL}/assets/admin_assets/js/plugins/perfect-scrollbar.jquery.min.js`}></script>
      <script src={`${process.env.PUBLIC_URL}/assets/admin_assets/js/plugins/chartjs.min.js`}></script>
      <script src={`${process.env.PUBLIC_URL}/assets/admin_assets/js/plugins/bootstrap-notify.js`}></script>
      <script src={`${process.env.PUBLIC_URL}/assets/admin_assets/js/paper-dashboard.min.js?v=2.0.1`} type="text/javascript"></script>
      <script src={`${process.env.PUBLIC_URL}/assets/admin_assets/demo/demo.js`}></script>
    </>
  );
};
const isLoggedIn = localStorage.getItem('auth-token');
const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/about',
        element: <About />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/register',
        element: <Register />,
      },
      {
        path: '/forgotpassword',
        element: <ForgotPassword />,
      },
      {
        path: '/products',
        element: <ProductList />,
      },
      {
        path: '/cart',
        element: <ShoppingCart />,
        // Check if user is logged in before rendering the component
      },
      {
        path: '/checkout',
        element: <Checkout />,
      },
      {
        path: '/contact',
        element: <Contact />,
      },
      {
        path: '/gadgetbazaar/admin/auth',
        element: <AdminLogin />,
      },
      {
        path: '/gadgetbazaar/admin/dashboard',
        element: <AdminLayout> <AdminDashboard /> </AdminLayout>,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);


export const App = () => {
  return (
    <CartProvider>
    <RouterProvider router={router} />
    </CartProvider>
  )
}

export default App;