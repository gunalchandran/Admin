import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const userEmail = localStorage.getItem("email");
  const userName = localStorage.getItem("userName") || "Guest";
  const userPhone = localStorage.getItem("userPhone") || "";

  const fetchCart = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/cart?email=${userEmail}`);
      setCartItems(res.data);
    } catch (err) {
      console.error("Error fetching cart:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userEmail) fetchCart();
  }, [userEmail]);

  const updateQuantity = async (itemId, newQuantity) => {
    try {
      if (newQuantity < 1) return;
      await axios.put(`http://localhost:5000/cart/${itemId}`, { quantity: newQuantity });
      fetchCart();
    } catch (err) {
      console.error("Error updating quantity:", err);
    }
  };

  const removeItem = async (itemId) => {
    try {
      await axios.delete(`http://localhost:5000/cart/${itemId}`);
      fetchCart();
    } catch (err) {
      console.error("Error removing item:", err);
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete(`http://localhost:5000/cart?email=${userEmail}`);
      fetchCart();
    } catch (err) {
      console.error("Error clearing cart:", err);
    }
  };

  const total = cartItems.reduce((sum, item) => sum + (item.total_price || 0), 0);

  const handleBuyAll = async () => {
    const method = window.prompt(
      "Choose payment method:\nType 'cod' for Cash on Delivery or 'razorpay' for Razorpay"
    );

    if (!method || !["cod", "razorpay"].includes(method.toLowerCase())) {
      alert("Invalid payment method.");
      return;
    }

    const now = new Date();
    const orderDate = now.toISOString().split("T")[0];
    const orderTime = now.toLocaleTimeString();

    const orders = cartItems.map((item) => {
      const deliveryTime = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        Math.floor(Math.random() * (20 - 9 + 1)) + 9,
        Math.floor(Math.random() * 60)
      );

      return {
        email: userEmail,
        name: userName,
        phone: userPhone,
        product_id: item.product_id || item._id,
        product_name: item.product_name,
        quantity: item.quantity,
        order_date: orderDate,
        order_time: orderTime,
        delivery_time: deliveryTime.toLocaleTimeString(),
        payment_method: method.toUpperCase(),
        payment_status: method.toLowerCase() === "cod" ? "No" : "Yes",
        delivery_status: "Pending",
      };
    });

    if (method.toLowerCase() === "cod") {
      try {
        await axios.post("http://localhost:5000/orders/bulk", { orders });
        alert("Order placed successfully with Cash on Delivery!");
        clearCart();
      } catch (err) {
        console.error("Error placing COD order:", err);
        alert("Failed to complete the order.");
      }
    } else {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      document.body.appendChild(script);

      script.onload = async () => {
        try {
          const { data: order } = await axios.post("http://localhost:5000/create-order", {
            amount: total * 100, // in paisa
          });

          const options = {
            key: "YOUR_RAZORPAY_KEY_ID",
            amount: order.amount,
            currency: "INR",
            name: "Your Shop",
            description: "Order Payment",
            order_id: order.id,
            handler: async function (response) {
              try {
                await axios.post("http://localhost:5000/orders/bulk", { orders });
                alert("Payment successful and order placed!");
                clearCart();
              } catch (error) {
                console.error("Order storing failed:", error);
                alert("Payment succeeded, but order storing failed.");
              }
            },
            prefill: {
              name: userName,
              email: userEmail,
              contact: userPhone,
            },
            theme: {
              color: "#3399cc",
            },
          };

          const rzp = new window.Razorpay(options);
          rzp.open();
        } catch (error) {
          console.error("Error initializing Razorpay:", error);
          alert("Something went wrong with Razorpay.");
        }
      };
    }
  };

  if (loading) return <p className="text-center mt-10">Loading cart...</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto mt-10 bg-gradient-to-br from-white via-gray-50 to-white shadow-xl rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate("/customer-dashboard")}
          className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded text-black"
        >
          ← Back to Dashboard
        </button>
        <h2 className="text-2xl font-bold text-center text-gray-700 flex-1">🛒 Your Cart</h2>
      </div>

      {cartItems.length === 0 ? (
        <p className="text-center text-lg text-gray-600">Your cart is empty</p>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cartItems.map((item) => (
              <div key={item._id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition duration-300">
                <div className="flex flex-col items-center gap-3">
                  <img
                    src={
                      item.image_url
                        ? item.image_url
                        : item.image?.startsWith("http")
                        ? item.image
                        : `http://localhost:5000/${item.image}`
                    }
                    alt={item.product_name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/default-image.png";
                    }}
                    className="w-28 h-28 object-cover rounded"
                  />
                  <div className="text-center">
                    <h3 className="font-semibold text-lg text-gray-800">{item.product_name}</h3>
                    <p className="text-gray-600">Qty: {item.quantity}</p>
                    <p className="text-gray-600">Price: ₹{item.price}</p>
                    <p className="text-gray-700 font-medium">
                      Subtotal: ₹{item.total_price.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded"
                    >
                      ➕
                    </button>
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className={`px-2 py-1 rounded text-white ${
                        item.quantity <= 1 ? "bg-gray-400" : "bg-yellow-500 hover:bg-yellow-600"
                      }`}
                    >
                      ➖
                    </button>
                    <button
                      onClick={() => removeItem(item._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-right">
            <div className="text-xl font-bold text-gray-800">Total: ₹{total.toFixed(2)}</div>
            <div className="mt-4 flex justify-end gap-4">
              <button
                onClick={clearCart}
                className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded"
              >
                Clear Cart
              </button>
              <button
                onClick={handleBuyAll}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
              >
                Buy All
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
