import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

const CustomerDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
const handleSearch = (e) => {
  e.preventDefault();
  if (searchTerm.trim() !== "") {
    navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-green-50 to-green-100 font-sans">
      
      {/* Search Box - Prominent on Top */}
      <div className="bg-white py-6 shadow-md sticky top-0 z-50 flex flex-col items-center gap-4">
        <h1 className="text-3xl font-bold text-green-700">🛒 SuperMarket</h1>
        
      </div>

      {/* Navigation Bar */}
      <nav className="bg-green-600 text-white py-4 px-6 flex justify-center shadow-md sticky top-[104px] z-40">
        <ul className="flex gap-10 text-lg font-medium">
          <li>
            <NavLink
              to="orders"
              className={({ isActive }) =>
                isActive ? "text-yellow-300 font-bold underline" : "hover:text-yellow-300"
              }
            >
              📦 Orders
            </NavLink>
          </li>
          <li>
            <NavLink
              to="cart"
              className={({ isActive }) =>
                isActive ? "text-yellow-300 font-bold underline" : "hover:text-yellow-300"
              }
            >
              🛒 Cart
            </NavLink>
          </li>
          <li>
            <NavLink
              to="profile"
              className={({ isActive }) =>
                isActive ? "text-yellow-300 font-bold underline" : "hover:text-yellow-300"
              }
            >
              👤 Profile
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "text-yellow-300 font-bold underline" : "hover:text-yellow-300"
              }
            >
              🏠 Dashboard
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* Main Content */}
      <main className="p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default CustomerDashboard;
