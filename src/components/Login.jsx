import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:5000/login", { email, password });

      if (res.data.token && res.data.role) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.role);
        localStorage.setItem("email", email);
        localStorage.setItem("name", res.data.name);
        localStorage.setItem("phone", res.data.phone);
        alert("Login Successful");
        console.log("Stored Data:", {
        token: res.data.token,
        role: res.data.role,
        email: email,
        name: res.data.name,
        phone: res.data.phone,
      });
        

        if (res.data.role === "admin") {
          navigate("/admin");
        } else if (res.data.role === "customer") {
          navigate("/customer-dashboard");
        } else {
          navigate("/");
        }
      } else {
        setError("Invalid response from server");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      localStorage.setItem("email", user.email);
      localStorage.setItem("name", user.displayName);
      localStorage.setItem("photoURL", user.photoURL);
      localStorage.setItem("role", "customer");

      alert("Google Sign-In successful!");
      navigate("/customer-dashboard");
    } catch (error) {
      setError("Google Sign-In failed: " + error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-200 via-white to-green-200 animate-fadeIn">
      <div className="w-full max-w-7xl bg-white shadow-xl hover:shadow-2xl rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-2 transition-shadow duration-300 ease-in-out">
        
        {/* Left Side Illustration */}
        <div className="bg-white flex flex-col justify-center items-center p-10 border-r hover:bg-green-50 transition-all duration-300 ease-in-out">
          <img
            src="https://www.way2smile.com/blog/wp-content/uploads/2019/09/quick-and-easy-purchase.png"
            alt="Login Illustration"
            className="w-full max-w-sm animate-glow-float"
          />
          <h2 className="text-3xl font-bold text-green-800 mt-4">Welcome to Porto</h2>
          <p className="text-gray-600 text-center mt-2 px-6">
            Smart and easy crop disease prediction for farmers
          </p>
        </div>

        {/* Right Side Login Form */}
        <div className="bg-green-100 flex flex-col justify-center p-12 animate-slideInRight">
          <h2 className="text-3xl font-semibold text-green-800 mb-6 text-center">Login to Your Account</h2>

          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Google Login */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-2 py-2 border border-gray-300 bg-white rounded-md text-gray-700 hover:shadow-lg transform hover:scale-105 transition-all"
            >
              <img src="https://img.icons8.com/color/24/google-logo.png" alt="Google" />
              Continue with Google
            </button>

            {/* Email Field */}
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-700 outline-none transition-all"
              required
            />

            {/* Password Field */}
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-700 outline-none transition-all"
              required
            />

            <div className="flex justify-between items-center text-sm text-gray-600">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                Keep me signed in
              </label>
              <a href="/forgot-password" className="text-green-700 hover:underline">
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-green-700 hover:bg-green-800 text-white py-2 rounded-md font-semibold transition-all transform hover:scale-105"
            >
              Log In
            </button>
          </form>

          <p className="text-sm text-center text-gray-600 mt-6">
            Not a member?{" "}
            <a href="/register" className="text-green-800 font-medium hover:underline">
              Create an account
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
