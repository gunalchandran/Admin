import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    brands: "",
    code: "",
    ingredients_text: "",
    product_name: "",
    schema_version: 1,
    stock: "",
    price: "",
    image: null,
  });

  const [editProduct, setEditProduct] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get("https://consultancy-backend-9y9a.onrender.com/products");
      setProducts(res.data);
    } catch (err) {
      setError("Failed to fetch products.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    setNewProduct((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewProduct((prev) => ({ ...prev, image: file }));

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addOrUpdateProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData();
    Object.keys(newProduct).forEach((key) => {
      formData.append(key, newProduct[key]);
    });

    try {
      if (editProduct) {
        await axios.put(`https://consultancy-backend-9y9a.onrender.com/products/${editProduct._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axios.post("https://consultancy-backend-9y9a.onrender.com/products", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      fetchProducts();
      resetForm();
    } catch (error) {
      setError(editProduct ? "Error updating product." : "Error adding product.");
    }
    setLoading(false);
  };

  const deleteProduct = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`https://consultancy-backend-9y9a.onrender.com/products/${id}`);
      fetchProducts();
    } catch (err) {
      setError("Failed to delete product.");
    }
    setLoading(false);
  };

  const resetForm = () => {
    setNewProduct({
      brands: "",
      code: "",
      ingredients_text: "",
      product_name: "",
      schema_version: 1,
      stock: "",
      price: "",
      image: null,
    });
    setEditProduct(null);
    setPreview(null);
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="min-h-screen bg-gray-100 p-6 flex-1">
        <h1 className="text-2xl font-bold text-gray-700">Supermarket Product Management</h1>
        {error && <p className="text-red-500 mt-2">{error}</p>}

        {/* Product Form */}
        <form onSubmit={addOrUpdateProduct} className="bg-white shadow-md rounded-lg p-6 mt-4">
          <h2 className="text-xl font-semibold mb-4">{editProduct ? "Edit Product" : "Add Product"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="product_name"
              placeholder="Product Name"
              value={newProduct.product_name}
              onChange={handleInputChange}
              className="border p-2 rounded"
              required
            />
            <input
              type="text"
              name="brands"
              placeholder="Brand"
              value={newProduct.brands}
              onChange={handleInputChange}
              className="border p-2 rounded"
            />
            <input
              type="text"
              name="code"
              placeholder="Product Code"
              value={newProduct.code}
              onChange={handleInputChange}
              className="border p-2 rounded"
            />
            <input
              type="number"
              name="stock"
              placeholder="Stock"
              value={newProduct.stock}
              onChange={handleInputChange}
              className="border p-2 rounded"
              required
            />
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={newProduct.price}
              onChange={handleInputChange}
              className="border p-2 rounded"
              required
            />
            <input
              type="file"
              onChange={handleImageChange}
              className="border p-2 rounded"
              accept="image/*"
            />
            {preview && <img src={preview} alt="Preview" className="h-20 w-20 object-cover rounded mt-2" />}
          </div>
          <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
            {editProduct ? "Update Product" : "Add Product"}
          </button>
        </form>

        {/* Product Grid Layout - 5 Products Per Row */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {products.map((product) => (
            <div key={product._id} className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center">
              {product.image_url && (
                <img src={product.image_url} alt={product.product_name} className="h-32 w-32 object-cover rounded-md" />
              )}
              <h3 className="text-lg font-semibold mt-2 text-center">{product.product_name}</h3>
              <p className="text-gray-600 text-sm">{product.brands}</p>
              <p className="text-gray-800 font-medium">Stock: {product.stock}</p>
              <p className="text-gray-800 font-medium">Price: ₹{product.price}</p>
              <div className="flex space-x-2 mt-2">
                <button
                  onClick={() => {
                    setEditProduct(product);
                    setNewProduct({
                      ...product,
                      image: null,
                    });
                    setPreview(product.image_url || null);
                  }}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteProduct(product._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Loader */}
        {loading && <p className="text-blue-500 mt-4">Loading...</p>}
      </div>
    </div>
  );
};

export default ProductManagement;
