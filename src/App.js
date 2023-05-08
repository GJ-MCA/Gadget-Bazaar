import React from 'react'
import {
  createBrowserRouter,
  Link,
  RouterProvider,
} from "react-router-dom";
import Root from './routes/root';
import {Home} from './components/Home'
import {About} from './components/About'
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ForgotPassword from './components/Auth/ForgotPassword';
import {ProductList} from './components/Products/ProductList';
import { CartProvider } from './context/GadgetBazaarContext';
import { ShoppingCart } from './components/Order/ShoppingCart';
import NotFound from './components/NotFound';
import Contact from './components/Contact';
import AdminLogin from './components/Admin/Auth/AdminLogin';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { Checkout } from './components/Order/Checkout';
import { OrderConfirmation } from './components/Order/OrderConfirmation';
import { PaymentSuccess } from './components/Payment/PaymentSuccess';
import { PaymentFailed } from './components/Payment/PaymentFailed';
import MyOrders from './components/Dashboard/MyOrders';
import Profile from './components/Dashboard/Profile';
import {ProductDetail} from './components/Products/ProductDetail';
import MyOrderItems from './components/Dashboard/MyOrderItems';
import { MyAccount } from './components/Dashboard/MyAccount';
import AdminForgotPassword from './components/Admin/Auth/AdminForgotPassword';
import AdminResetPassword from './components/Admin/Auth/AdminResetPassword';
import ResetPassword from './components/Auth/ResetPassword';
import { adminBaseUrl, adminDashboardUrl } from './config/config';
import Reports from './components/Admin/Reports/Reports';
import AdminProducts from './components/Admin/Products/AdminProducts';
import BrandList from './components/Admin/Products/Brands/BrandList';
import EditBrand from './components/Admin/Products/Brands/EditBrand';
import AddBrand from './components/Admin/Products/Brands/AddBrand';
import {
  adminFrontBasePostFix,
  adminFrontLoginPostFix,
  adminFrontForgotPasswordPostFix,
  adminFrontResetPasswordPostFix,
  adminFrontDashboardPostFix,
  adminFrontProductsPostFix,
  adminFrontBrandsPostFix,
  adminFrontReportsPostFix,
  adminFrontSpecificationsPostFix,
} from './helpers/adminHelper';
import SpecificationList from './components/Admin/Products/Specifications/SpecificationList';
import EditSpecification from './components/Admin/Products/Specifications/EditSpecification';
import AddSpecification from './components/Admin/Products/Specifications/AddSpecification';
import AddProduct from './components/Admin/Products/AddProduct';
const AdminLayout = ({ children }) => {
  return (
    <>
      <div className="wrapper ">
        <div className="sidebar" data-color="white" data-active-color="danger">
          <div className="logo" style={{width: "200px"}}>
              <div className="logo-image-small d-flex align-items-center">
                <Link to={adminDashboardUrl}>
                  <img src={`${process.env.PUBLIC_URL}/assets/img/logo.png`}/>  
                </Link>
              </div>
          </div>
          <div className="sidebar-wrapper">
            <ul className="nav">
              <li className={window.location.href === adminDashboardUrl ? "active" : ""}>
                <Link to={adminDashboardUrl}>
                  <i className="nc-icon nc-bank"></i>
                  <p>Dashboard</p>
                </Link>
              </li>
              <li className={window.location.href === adminDashboardUrl+"/products" ? "active" : ""}>
                <Link to={adminDashboardUrl+"/products"}>
                  <i className="nc-icon nc-box"></i>
                  <p>Products</p>
                </Link>
              </li>
              <li className={window.location.href === adminDashboardUrl+"/brands" ? "active" : ""}>
                <Link to={adminDashboardUrl+"/brands"}>
                  <i className="nc-icon nc-tag-content"></i>
                  <p>Brands</p>
                </Link>
              </li>
              <li className={window.location.href === adminDashboardUrl+"/specifications" ? "active" : ""}>
                <Link to={adminDashboardUrl+"/specifications"}>
                  <i className="nc-icon nc-settings-gear-65"></i>
                  <p>Specifications</p>
                </Link>
              </li>
              <li className={window.location.href === adminDashboardUrl+"/users" ? "active" : ""}>
                <Link to={adminDashboardUrl+"/users"}>
                  <i className="nc-icon nc-single-02"></i>
                  <p>Users</p>
                </Link>
              </li>
              <li className={window.location.href === adminDashboardUrl+"/reports" ? "active" : ""}>
                <Link to={adminDashboardUrl+"/reports"}>
                  <i className="nc-icon nc-chart-bar-32"></i>
                  <p>Reports</p>
                </Link>
              </li>
              <li className={window.location.href === adminDashboardUrl+"/profile" ? "active" : ""}>
                <Link to={adminDashboardUrl+"/profile"}>
                  <i className="nc-icon nc-badge"></i>
                  <p>Profile</p>
                </Link>
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
                <Link className="navbar-brand" to={adminFrontDashboardPostFix}>GadgetBazaar Admin Panel</Link>
              </div>
              <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navigation" aria-controls="navigation-index" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-bar navbar-kebab"></span>
                <span className="navbar-toggler-bar navbar-kebab"></span>
                <span className="navbar-toggler-bar navbar-kebab"></span>
              </button>
          
            </div>
          </nav>
          <main style={{marginTop: '80px'}}>
            {children}
          </main>
          <footer className="footer footer-black  footer-white " style={{ bottom: "auto", position: 'absolute', width: '100%' }}>
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
        path: '/forgot-password',
        element: <ForgotPassword />,
      },
      {
        path: '/resetpassword/:token',
        element: <ResetPassword />,
      },
      {
        path: '/products',
        element: <ProductList />,
      },
      {
        path: '/product/:sku',
        element: <ProductDetail />,
      },
      {
        path: '/cart',
        element: <ShoppingCart />,
      },
      {
        path: '/checkout',
        element: <Checkout />,
      },
      {
        path: '/order-confirmation',
        element: <OrderConfirmation />,
      },
      {
        path: '/payment-success',
        element: <PaymentSuccess />,
      },
      {
        path: '/payment-failed',
        element: <PaymentFailed />,
      },
      {
        path: '/my-orders',
        element: <MyOrders/>,
      },
      {
        path: '/my-orders/:order_reference_code',
        element: <MyOrderItems />,
      },
      {
        path: '/my-account',
        element: <MyAccount/>,
      },
      {
        path: '/profile',
        element: <Profile/>,
      },
      {
        path: '/contact',
        element: <Contact />,
      },
      {
        path: adminFrontLoginPostFix,
        element: <AdminLogin />,
      },
      {
        path: adminFrontForgotPasswordPostFix,
        element: <AdminForgotPassword />,
      },
      {
        path: `${adminFrontResetPasswordPostFix}/:token`,
        element: <AdminResetPassword />,
      },
      {
        path: adminFrontDashboardPostFix,
        element: <AdminLayout> <AdminDashboard /> </AdminLayout>,
      },
      {
        path: adminFrontProductsPostFix,
        element: <AdminLayout> <AdminProducts /> </AdminLayout>,
      },
      {
        path: adminFrontProductsPostFix + "/add",
        element: <AdminLayout> <AddProduct /> </AdminLayout>,
      },
      {
        path: adminFrontBrandsPostFix,
        element: <AdminLayout> <BrandList /> </AdminLayout>,
      },
      {
        path: `${adminFrontBrandsPostFix}/edit/:id`,
        element: <AdminLayout> <EditBrand/> </AdminLayout>,
      },
      {
        path: `${adminFrontBrandsPostFix}/add`,
        element: <AdminLayout> <AddBrand/> </AdminLayout>,
      },
      {
        path: adminFrontSpecificationsPostFix,
        element: <AdminLayout> <SpecificationList /> </AdminLayout>,
      },
      {
        path: `${adminFrontSpecificationsPostFix}/edit/:id`,
        element: <AdminLayout> <EditSpecification/> </AdminLayout>,
      },
      {
        path: `${adminFrontSpecificationsPostFix}/add`,
        element: <AdminLayout> <AddSpecification/> </AdminLayout>,
      },
      {
        path: adminFrontReportsPostFix,
        element: <AdminLayout> <Reports /> </AdminLayout>,
      },
      {
        path: `${adminFrontDashboardPostFix}/*`,
        element: <AdminLayout> <NotFound/> </AdminLayout>,
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