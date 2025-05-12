import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const SearchResults = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const location = useLocation();

  // Extract the search query from the URL
  const query = new URLSearchParams(location.search).get("q");

  useEffect(() => {
  // Fetch all products from the backend
  axios
    .get("http://localhost:5000/products")
    .then((res) => {
      console.log("All Products:", res.data); // Log all products
      setProducts(res.data);

      // Filter products based on the query
      const filtered = res.data.filter((product) =>
        product.product_name
          .trim()
          .toLowerCase()
          .includes(query.trim().toLowerCase())
      );
      console.log("Search Query:", query); // Log the search query
      console.log("Filtered Products:", filtered); // Log filtered products
      setFilteredProducts(filtered);
    })
    .catch((err) => console.error("Error fetching products:", err));
}, [query]);
  return (
    <div className="p-6 bg-green-50 min-h-screen">
      <h1 className="text-2xl font-bold text-green-700 mb-6">
        Search Results for "{query}"
      </h1>

      {filteredProducts.length === 0 ? (
        <p className="text-gray-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="border-2 border-green-300 p-4 rounded-lg bg-white shadow-md"
            >
              <img
                src={product.image_url}
                alt={product.product_name}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <h2 className="text-lg font-bold text-green-700 mt-2 text-center">
                {product.product_name}
              </h2>
              <p className="text-md mt-2 text-green-600 font-semibold">
                ₹{product.price}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;