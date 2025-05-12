import React, { useEffect, useState } from "react";
import axios from "axios";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [expandedProductId, setExpandedProductId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    quantity: "",
    address: "",
    payment_method: "cod",
  });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [imageModalProduct, setImageModalProduct] = useState(null);
  const [likes, setLikes] = useState({});

  useEffect(() => {
    axios
      .get("https://consultancy-backend-9y9a.onrender.com/products")
      .then((res) => {
        setProducts(res.data);
        const initialLikes = {};
        res.data.forEach((p) => {
          initialLikes[p._id] = p.likes || 0;
        });
        setLikes(initialLikes);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleAddToCart = async (product) => {
    const qty = prompt("Enter quantity:");
    const quantity = Number(qty);

    if (!qty || isNaN(quantity) || quantity <= 0) {
      alert("Please enter a valid quantity.");
      return;
    }

    if (quantity > product.stock) {
      alert(`Only ${product.stock} items in stock.`);
      return;
    }

    const userEmail = localStorage.getItem("email");
    if (!userEmail) {
      alert("Please log in first.");
      return;
    }

    const cartItem = {
      email: userEmail,
      product_id: product._id,
      quantity,
    };

    try {
      await axios.post("https://consultancy-backend-9y9a.onrender.com/cart", cartItem);
      alert("Product added to cart successfully.");
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add product to cart.");
    }
  };

  const openBuyNowForm = (product) => {
    setSelectedProduct(product);
    setFormData({
      quantity: "",
      address: "",
      payment_method: "cod",
    });
    setShowForm(true);
  };

  const handleOrderSubmit = async () => {
    const { quantity, address, payment_method } = formData;
    const product = selectedProduct;

    if (!quantity || isNaN(quantity) || quantity <= 0) {
      alert("Please enter a valid quantity.");
      return;
    }

    if (quantity > product.stock) {
      alert(`Only ${product.stock} items in stock.`);
      return;
    }

    if (!address.trim()) {
      alert("Please enter a delivery address.");
      return;
    }

    const userEmail = localStorage.getItem("email");
    const userPhone = localStorage.getItem("Phone");
    const userName = localStorage.getItem("name");

    if (!userEmail) {
      alert("Please log in first.");
      return;
    }

    const now = new Date();
    const deliveryTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      Math.floor(Math.random() * (20 - 9 + 1)) + 9,
      Math.floor(Math.random() * 60)
    );

    const orderData = {
      email: userEmail,
      name: userName || "Guest",
      phone: userPhone || "",
      product_id: product._id,
      product_name: product.product_name,
      quantity: Number(quantity),
      order_date: now.toISOString().split("T")[0],
      order_time: now.toLocaleTimeString(),
      delivery_time: deliveryTime.toLocaleTimeString(),
      payment_method: payment_method.toUpperCase(),
      payment_status: "No",
      delivery_status: "Pending",
      address,
    };

    if (payment_method === "razorpay") {
      handleRazorpayPayment(orderData, product.price * quantity);
    } else {
      try {
        await axios.post("https://consultancy-backend-9y9a.onrender.com/order", orderData);
        alert("Order placed successfully!");
        setShowForm(false);
      } catch (error) {
        console.error("Order failed:", error);
        alert("Failed to place order.");
      }
    }
  };

  const handleRazorpayPayment = (orderData, amount) => {
    const options = {
      key:"rzp_test_4rdgre6savrrmw",
      amount: amount * 100, // Amount in paise
      currency: "INR",
      name: "Christal SuperMarket",
      description: "Transaction",
      handler: async (response) => {
        try {
          // Mark payment as successful and place the order
          orderData.payment_status = "Paid";
          await axios.post("https://consultancy-backend-9y9a.onrender.com/order", orderData);
          alert("Payment successful and order placed!");
          setShowForm(false);
        } catch (error) {
          console.error("Order placement failed after payment:", error);
          alert("Order placement failed after payment.");
        }
      },
      prefill: {
        name: orderData.name,
        email: orderData.email,
        contact: orderData.phone,
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const handleLike = (productId) => {
    setLikes((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }));
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => {
          const isExpanded = expandedProductId === product._id;

          return (
            <div
              key={product._id}
              onClick={() => setExpandedProductId(isExpanded ? null : product._id)}
              className={`bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition duration-300 cursor-pointer transform ${
                isExpanded ? "scale-105 ring-2 ring-yellow-400 z-10" : ""
              }`}
            >
              {/* Product Image */}
              <div className="relative">
                <img
                  src={product.image_url}
                  alt={product.product_name}
                  className="w-full h-52 object-contain p-4"
                  onClick={(e) => {
                    e.stopPropagation();
                    setImageModalProduct(product);
                  }}
                />
                <button
                  className="absolute top-2 right-2 bg-white border rounded-full p-1 text-red-500 hover:text-red-700 shadow"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLike(product._id);
                  }}
                >
                  ❤️ <span className="text-sm font-semibold">{likes[product._id] || 0}</span>
                </button>
              </div>

              {/* Product Info */}
              <div className="px-4 pb-4">
                <h2 className="text-md font-semibold text-gray-800 text-center mt-2">
                  {product.product_name}
                </h2>

                {isExpanded && (
                  <div className="mt-3 text-sm animate-fadeIn">
                    <p className="text-gray-600">{product.ingredients_text}</p>
                    <p className="text-lg text-green-700 font-bold mt-2">₹{product.price}</p>

                    {/* Buttons */}
                    <div className="mt-4 flex flex-col sm:flex-row justify-between gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openBuyNowForm(product);
                        }}
                        className="bg-orange-500 text-white py-2 w-full rounded hover:bg-orange-600 transition font-medium"
                      >
                        Buy Now
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product);
                        }}
                        className="bg-yellow-400 text-black py-2 w-full rounded hover:bg-yellow-500 transition font-medium"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Image Modal */}
      {imageModalProduct && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white p-6 rounded-xl w-[95%] max-w-3xl shadow-xl relative">
            <button
              onClick={() => setImageModalProduct(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-600 text-2xl transition"
            >
              ✖
            </button>
            <div className="flex flex-col md:flex-row items-center gap-6">
              <img
                src={imageModalProduct.image_url}
                alt={imageModalProduct.product_name}
                className="w-full md:w-1/2 h-[300px] object-contain rounded-lg shadow"
              />
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl md:text-3xl font-bold text-green-700">
                  {imageModalProduct.product_name}
                </h2>
                <p className="text-gray-600 mt-3 text-sm leading-relaxed">
                  {imageModalProduct.ingredients_text}
                </p>
                <p className="text-xl font-semibold text-green-600 mt-3">
                  ₹{imageModalProduct.price}
                </p>
                <div className="mt-6 flex justify-center md:justify-start gap-4">
                  <button
                    className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 transition"
                    onClick={() => {
                      handleAddToCart(imageModalProduct);
                      setImageModalProduct(null);
                    }}
                  >
                    Add to Cart
                  </button>
                  <button
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                    onClick={() => {
                      openBuyNowForm(imageModalProduct);
                      setImageModalProduct(null);
                    }}
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order Form */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-green-700">Place Your Order</h2>
            <label className="block mb-2 text-sm font-medium">Quantity</label>
            <input
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              className="w-full border p-2 rounded mb-4"
              min="1"
            />
            <label className="block mb-2 text-sm font-medium">Delivery Address</label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full border p-2 rounded mb-4"
            ></textarea>
            <label className="block mb-2 text-sm font-medium">Payment Method</label>
            <select
              value={formData.payment_method}
              onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
              className="w-full border p-2 rounded mb-4"
            >
              <option value="cod">Cash on Delivery</option>
              <option value="razorpay">Razorpay</option>
            </select>
            <div className="flex justify-between mt-4">
              <button
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
              <button
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                onClick={handleOrderSubmit}
              >
                Submit Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;