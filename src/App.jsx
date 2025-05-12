import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Admin from "./components/Admin";
import ProductManagement from "./components/ProductManagement";
import Analysis from "./components/Analysis";
import Home from "./components/Home";
import About from "./components/About";
import Contact from "./components/Contact";
import Login from "./components/Login";
import Register from "./components/Register";
import CustomerDashboard from "./components/CustomerDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Orders from "./components/Orders"
import Cart from "./components/Cart";
import Profile from "./components/Profile";
import ProductList from "./components/ProductList";
import Chatbox from "./components/Chatbox";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import SearchResults from "./components/SearchResults";
import BillingPage from "./components/BillingPage";

const App = () => {
  const [cartItems, setCartItems] = useState([]);

  // Get userEmail from localStorage (assumes it’s stored after login)
  const userEmail = localStorage.getItem("userEmail");

  const addToCart = (product) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.product_id === product.product_id);
      if (existingItem) {
        return prev.map((item) =>
          item.product_id === product.product_id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} /> 
        <Route path="search" element={<SearchResults />} />

        {/* Cart/Profile outside dashboard for fallback or direct access */}
        <Route path="cart" element={<Cart userEmail={userEmail} />} />
        <Route path="profile" element={<Profile />} />

        {/* Admin Routes */}
        <Route
          path="admin"
          element={<ProtectedRoute role="admin" element={<Admin />} />}
        />
        <Route
          path="products"
          element={<ProtectedRoute role="admin" element={<ProductManagement />} />}
        />
        <Route
          path="analysis"
          element={<ProtectedRoute role="admin" element={<Analysis />} />}
        />
        <Route 
        path="/billing"
         element={<ProtectedRoute role="admin" element={<BillingPage />} />}/>
        {/* Customer Dashboard - with nested routes */}
        <Route
          path="customer-dashboard"
          element={
            <ProtectedRoute
              role="customer"
              element={<CustomerDashboard addToCart={addToCart} cartItems={cartItems} />}
            />
          }
        >
          {/* Default route inside dashboard - ProductList */}
          <Route index element={<ProductList addToCart={addToCart} />} />

          {/* Nested customer routes */}
          <Route path="cart" element={<Cart userEmail={userEmail} />} />
          <Route path="profile" element={<Profile />} />
          <Route path="orders" element={<Orders/>}/>
          <Route path="chat" element={<Chatbox/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
