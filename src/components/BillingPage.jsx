import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // ⬅️ Import useNavigate

const BillingPage = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantity, setQuantity] = useState(1);

  const navigate = useNavigate(); // ⬅️ Initialize useNavigate

  useEffect(() => {
    axios
      .get("https://consultancy-backend-9y9a.onrender.com/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Failed to fetch products", err));
  }, []);

  const addToCart = () => {
    const product = products.find(
      (p) =>
        p._id === selectedProductId ||
        p.id === selectedProductId ||
        p.product_name === selectedProductId
    );
    if (product) {
      setCart([
        ...cart,
        {
          product_name: product.product_name,
          price: product.price,
          quantity: parseInt(quantity),
        },
      ]);
    }
    setSelectedProductId("");
    setQuantity(1);
  };

  const removeFromCart = (index) => {
    const updatedCart = [...cart];
    updatedCart.splice(index, 1);
    setCart(updatedCart);
  };

  const generatePDF = async () => {
    try {
      const response = await axios.post(
        "https://consultancy-backend-9y9a.onrender.com/generate-bill",
        { items: cart },
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "bill.pdf");
      document.body.appendChild(link);
      link.click();
      setCart([]); // Clear the cart after generating PDF
    } catch (err) {
      console.error("PDF generation failed", err);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white shadow-lg rounded-lg mt-6">
      {/* 🔙 Back Button */}
      <div className="mb-4">
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded shadow-md transition"
        >
          🔙 Back
        </button>
      </div>

      <h2 className="text-3xl font-bold text-center mb-6 text-blue-800">
        🧾 Manual Billing System
      </h2>

      <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-center items-center">
        <select
          value={selectedProductId}
          onChange={(e) => setSelectedProductId(e.target.value)}
          className="border px-4 py-2 rounded w-full sm:w-72 shadow-sm focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Select Product</option>
          {products.map((product) => (
            <option key={product.product_name} value={product.product_name}>
              {product.product_name} - ₹{product.price}
            </option>
          ))}
        </select>

        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="border px-4 py-2 rounded w-full sm:w-24 shadow-sm text-center"
        />

        <button
          onClick={addToCart}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded shadow-md transition"
        >
          ➕ Add to Cart
        </button>
      </div>

      {cart.length > 0 && (
        <div className="mt-6">
          <table className="w-full border-collapse">
            <thead className="bg-blue-100 text-gray-800">
              <tr>
                <th className="border p-2">Product</th>
                <th className="border p-2">Qty</th>
                <th className="border p-2">Price</th>
                <th className="border p-2">Total</th>
                <th className="border p-2">Action</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {cart.map((item, index) => (
                <tr key={index} className="hover:bg-gray-100 transition">
                  <td className="border p-2">{item.product_name}</td>
                  <td className="border p-2">{item.quantity}</td>
                  <td className="border p-2">₹{item.price}</td>
                  <td className="border p-2">
                    ₹{(item.quantity * item.price).toFixed(2)}
                  </td>
                  <td className="border p-2">
                    <button
                      onClick={() => removeFromCart(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
              <tr className="font-bold bg-blue-50">
                <td colSpan="3" className="text-right pr-4">
                  Grand Total:
                </td>
                <td colSpan="2" className="text-left pl-4 text-blue-700">
                  ₹
                  {cart
                    .reduce((acc, item) => acc + item.quantity * item.price, 0)
                    .toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>

          <div className="mt-6 text-right">
            <button
              onClick={generatePDF}
              className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-3 rounded shadow-lg transition"
            >
              🧾 Generate PDF Bill
            </button>
          </div>
        </div>
      )}

      {cart.length === 0 && (
        <p className="text-center text-gray-500 mt-6">
          No items in cart. Add some products above. 🛒
        </p>
      )}
    </div>
  );
};

export default BillingPage;
