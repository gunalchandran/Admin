import React from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Info, Phone } from "lucide-react"; // icons (optional)

const Navbar = () => {
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate("/login"); // Force login first
  };

  return (
    <nav className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 shadow-md px-6 py-4 flex justify-between items-center rounded-b-2xl">
      <h1 className="text-2xl font-extrabold text-white tracking-wider flex items-center gap-2">
        🛍️ Christal Mart
      </h1>
      <div className="flex gap-6">
        <button
          onClick={handleNavigation}
          className="text-white font-medium hover:bg-white hover:text-red-500 px-4 py-2 rounded-xl transition duration-300 flex items-center gap-2"
        >
          <ShoppingCart size={18} /> Home
        </button>
        <button
          onClick={handleNavigation}
          className="text-white font-medium hover:bg-white hover:text-red-500 px-4 py-2 rounded-xl transition duration-300 flex items-center gap-2"
        >
          <Info size={18} /> About
        </button>
        <button
          onClick={handleNavigation}
          className="text-white font-medium hover:bg-white hover:text-red-500 px-4 py-2 rounded-xl transition duration-300 flex items-center gap-2"
        >
          <Phone size={18} /> Contact
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
