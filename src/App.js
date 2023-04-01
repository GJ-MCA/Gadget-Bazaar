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
        element: <AdminDashboard />,
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