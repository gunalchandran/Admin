import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";

const Admin = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const password = "admin"; // Hardcoded for simplicity
        const orderRes = await axios.get(`http://localhost:5000/order-history?password=${password}`);

        console.log("Orders:", orderRes.data);
        setOrders(orderRes.data);
      } catch (error) {
        setError("Error fetching data");
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const updateOrderStatus = async (orderId, paymentStatus, deliveryStatus) => {
    try {
      // Send the update request to the server
      await axios.put(`http://localhost:5000/orders/${orderId}`, {
        payment_status: paymentStatus, // Keep the current payment status
        delivery_status: deliveryStatus, // Update only the delivery status
      });
  
      // Update the local state
      setOrders(orders.map(order =>
        order._id === orderId
          ? { ...order, payment_status: paymentStatus, delivery_status: deliveryStatus }
          : order
      ));
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="p-6 w-full">
        <h1 className="text-2xl font-bold text-gray-700">Grocery Store Admin Dashboard</h1>

        {/* Orders Section */}
        <h2 className="text-xl font-semibold mt-6">Orders</h2>
        {loading ? (
          <p>Loading orders...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <table className="w-full bg-white shadow-md rounded my-4">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="py-2 px-4">Customer</th>
                <th className="py-2 px-4">Email</th>
                <th className="py-2 px-4">Phone</th>
                <th className="py-2 px-4">Product</th>
                <th className="py-2 px-4">Quantity</th>
                <th className="py-2 px-4">Total Amount</th>
                <th className="py-2 px-4">Payment Method</th>
                <th className="py-2 px-4">Payment Status</th>
                <th className="py-2 px-4">Delivery Status</th>
                <th className="py-2 px-4">Address</th> {/* ✅ New Column */}
                <th className="py-2 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-t">
                  <td className="py-2 px-4">{order.name}</td>
                  <td className="py-2 px-4">{order.email}</td>
              
                  <td className="py-2 px-4">{order.product_name}</td>
                  <td className="py-2 px-4">{order.quantity}</td>
                  <td className="py-2 px-4">${order.total_price}</td>
                  <td className="py-2 px-4">{order.payment_method}</td>
                  <td className="py-2 px-4">
                    {order.payment_status === "Yes" ? (
                      <span className="text-green-500">Paid</span>
                    ) : (
                      <span className="text-red-500">Unpaid</span>
                    )}
                  </td>
                  <td className="py-2 px-4">
                    {order.delivery_status === "Delivered" ? (
                      <span className="text-green-500">Delivered</span>
                    ) : (
                      <span className="text-yellow-500">Pending</span>
                    )}
                  </td>
                  <td className="py-2 px-4">{order.address || "N/A"}</td> {/* ✅ Address field */}
                  <td className="py-2 px-4 flex space-x-2">
  {order.payment_status === "No" && (
    <button
      className="bg-green-500 text-white py-1 px-4 rounded-md"
      onClick={() => updateOrderStatus(order._id, "Yes", order.delivery_status)}
    >
      Mark as Paid
    </button>
  )}
  {order.delivery_status === "Pending" && (
    <button
      className="bg-blue-500 text-white py-1 px-4 rounded-md"
      onClick={() => updateOrderStatus(order._id, order.payment_status, "Delivered")}
    >
      Mark as Delivered
    </button>
  )}
</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Admin;
