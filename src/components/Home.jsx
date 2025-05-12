import React from "react";
import Navbar from "./Navbar";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { motion } from "framer-motion";

const Home = () => {
  return (
    <div className="font-sans bg-gradient-to-br from-yellow-100 via-white to-green-50 min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <header className="bg-gradient-to-r from-green-700 to-lime-500 text-white text-center py-20 shadow-lg">
        <motion.h1
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-6xl font-black uppercase tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-white drop-shadow-xl"
        >
          🛍️ Christal Supermarket
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-2xl mt-4 font-medium italic tracking-wide"
        >
          Your one-stop destination for quality and value 💰
        </motion.p>
      </header>

      {/* Carousel */}
      <section className="mt-12 max-w-6xl mx-auto px-4">
        <Carousel
          autoPlay
          infiniteLoop
          showThumbs={false}
          showStatus={false}
          interval={4000}
          className="rounded-2xl overflow-hidden shadow-2xl"
        >
          <div>
            <img src="https://shivangtrading.com/img/food_provision.jpg" alt="Supermarket Aisle" />
          </div>
          <div>
            <img src="https://bristolfoodpantry.org/images/images_1.jpg" alt="Fresh Groceries" />
          </div>
        </Carousel>
      </section>

      {/* About */}
      <section className="bg-orange-50 py-20 text-center px-6">
        <motion.h2
          initial={{ x: -100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-4xl font-bold text-green-800 mb-6 tracking-wide"
        >
          👋 Welcome to <span className="text-yellow-600">Christal Supermarket</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-lg text-gray-700 max-w-3xl mx-auto"
        >
          Discover top-quality products at unbeatable prices. From fresh groceries 🥦, trendy fashion 👕, to smart gadgets 📱 – all under one roof.
        </motion.p>
        <p className="mt-8 text-green-700 font-bold animate-bounce">
          🔑 Login now for a personalized shopping experience!
        </p>
      </section>

      {/* In-store Image */}
      <div className="max-w-5xl mx-auto px-4 py-10">
        <motion.img
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          src="https://thumbs.dreamstime.com/z/counter-fruits-supermarket-30149989.jpg"
          alt="Fruits Counter"
          className="w-full rounded-2xl shadow-xl object-cover h-[350px]"
        />
      </div>

      {/* Features */}
      <section className="py-20 bg-white grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 max-w-7xl mx-auto px-6">
        {[
          {
            title: "Wide Product Range",
            desc: "Groceries 🥕, fashion 👗, gadgets 🔌 – all in one place!",
            icon: "🛒",
          },
          {
            title: "Fast Delivery",
            desc: "Lightning-fast doorstep delivery. 🚀",
            icon: "🚚",
          },
          {
            title: "Quality Guaranteed",
            desc: "Trusted products with full satisfaction. 🏅",
            icon: "✅",
          },
        ].map((item, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.05 }}
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: idx * 0.2 }}
            className="bg-yellow-50 p-10 rounded-2xl text-center shadow-md cursor-pointer"
          >
            <div className="text-5xl mb-4">{item.icon}</div>
            <h3 className="text-2xl font-semibold text-green-700 mb-2">{item.title}</h3>
            <p className="text-gray-600">{item.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* Second Image */}
      <div className="max-w-5xl mx-auto px-4 py-10">
        <motion.img
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          src="https://thumbs.dreamstime.com/z/supermarket-18151480.jpg"
          alt="Shopping Cart Aisle"
          className="w-full rounded-2xl shadow-xl object-cover h-[350px]"
        />
      </div>

      {/* Categories */}
      <section className="bg-green-50 py-20 px-6 text-center">
        <h2 className="text-4xl font-bold text-green-800 mb-12">
          🧺 Shop by <span className="text-yellow-600">Category</span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {[
            { name: "Groceries", icon: "🍅" },
            { name: "Clothing", icon: "👚" },
            { name: "Electronics", icon: "🔌" },
            { name: "Home Essentials", icon: "🧹" },
          ].map((cat, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.08 }}
              className="bg-white rounded-xl p-6 shadow-lg hover:bg-green-100 cursor-pointer transition-transform duration-300"
            >
              <div className="text-3xl">{cat.icon}</div>
              <h3 className="text-lg font-semibold mt-2">{cat.name}</h3>
              <p className="text-sm text-gray-500 mt-1">Explore now</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
