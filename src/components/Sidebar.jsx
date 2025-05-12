import React from "react";
import { useNavigate } from "react-router-dom";
import { ClipboardListIcon, ShoppingCartIcon, CurrencyDollarIcon } from "@heroicons/react/outline"; // Added CurrencyDollarIcon import
import { Outlet } from "react-router-dom";

const Sidebar = () => {
    const navigate = useNavigate(); // Hook for navigation

    return (
        <div className="flex">
            <div className="w-64 h-screen bg-gray-100 p-4">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Admin Dashboard</h2>
                <ul className="space-y-4">
                    <li
                        className="flex items-center space-x-3 p-2 rounded-md cursor-pointer hover:bg-gray-200"
                        onClick={() => navigate("/admin")}
                    >
                        <ClipboardListIcon className="h-6 w-6 text-gray-700" />
                        <span className="font-medium text-gray-800">Orders Placed</span>
                    </li>
                    <li
                        className="flex items-center space-x-3 p-2 rounded-md cursor-pointer hover:bg-gray-200"
                        onClick={() => navigate("/products")}
                    >
                        <ShoppingCartIcon className="h-6 w-6 text-gray-700" />
                        <span className="font-medium text-gray-800">Manage Products</span>
                    </li>
                    <li
                        className="flex items-center space-x-3 p-2 raounded-md cursor-pointer hover:bg-gray-200"
                        onClick={() => navigate("/analysis")}
                    >
                        <ShoppingCartIcon className="h-6 w-6 text-gray-700" />
                        <span className="font-medium text-gray-800">Analytics</span>
                    </li>
                     <li
                        className="flex items-center space-x-3 p-2 rounded-md cursor-pointer hover:bg-gray-200"
                        onClick={() => navigate("/billing")}
                    >
                        <CurrencyDollarIcon className="h-6 w-6 text-gray-700" />
                        <span className="font-medium text-gray-800">Billing</span>
                    </li>
                </ul>
            </div>
            <div className="w-full">
                <Outlet />
            </div>
        </div>
    );
};

export default Sidebar;