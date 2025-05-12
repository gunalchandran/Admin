import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, PieChart, Pie, LineChart, Line,
  XAxis, YAxis, Tooltip, Legend, Cell, CartesianGrid, ResponsiveContainer
} from "recharts";
import { useNavigate } from "react-router-dom";

const Analysis = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("https://consultancy-backend-9y9a.onrender.com/admin/orders")
      .then(res => setOrders(res.data))
      .catch(err => console.error("Error fetching admin orders:", err));
  }, []);

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + (parseFloat(order.total_price) || 0), 0);
  const canceled = orders.filter(o => o.delivery_status === "Canceled").length;
  const pending = orders.filter(o => o.delivery_status === "Pending").length;
  const delivered = orders.filter(o => o.delivery_status === "Delivered").length;

  const statusData = [
    { name: "Delivered", value: delivered },
    { name: "Pending", value: pending },
    { name: "Canceled", value: canceled },
  ];

  const paymentData = [
    { name: "COD", value: orders.filter(o => o.payment_method === "COD").length },
    { name: "Online", value: orders.filter(o => o.payment_method === "Online").length },
  ];

  const dailyData = orders.reduce((acc, curr) => {
    const date = curr.order_date;
    acc[date] = (acc[date] || 0) + parseFloat(curr.total_price || 0);
    return acc;
  }, {});
  const lineData = Object.keys(dailyData).map(date => ({
    date,
    sales: dailyData[date]
  }));

  const productData = orders.reduce((acc, curr) => {
    acc[curr.product_name] = (acc[curr.product_name] || 0) + curr.quantity;
    return acc;
  }, {});
  const productChartData = Object.keys(productData).map(product => ({
    name: product,
    quantity: productData[product]
  }));

  const COLORS = ["#4caf50", "#f44336", "#ff9800", "#2196f3", "#9c27b0", "#00bcd4"];

  return (
    <div style={{ padding: "30px" }}>
      <button onClick={() => navigate(-1)} style={backButtonStyle}>← Back</button>
      <h2>🧾 Admin Sales Dashboard</h2>

      <div style={{ display: "flex", gap: "20px", marginBottom: "30px", flexWrap: "wrap" }}>
        <div style={cardStyle}>Total Orders<br /><strong>{totalOrders}</strong></div>
        <div style={cardStyle}>Total Revenue<br /><strong>${totalRevenue.toFixed(2)}</strong></div>
        <div style={cardStyle}>Delivered<br /><strong>{delivered}</strong></div>
        <div style={cardStyle}>Pending<br /><strong>{pending}</strong></div>
        <div style={cardStyle}>Canceled<br /><strong>{canceled}</strong></div>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "40px" }}>
        {/* Status Bar Chart */}
        <ChartBox title="Delivery Status">
          <BarChart data={statusData}>
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#4caf50" />
          </BarChart>
        </ChartBox>

        {/* Payment Pie Chart */}
        <ChartBox title="Payment Method">
          <PieChart>
            <Pie data={paymentData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
              {paymentData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ChartBox>

        {/* Line Chart - Sales Over Time */}
        <ChartBox title="Daily Sales Trend">
          <LineChart data={lineData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <CartesianGrid strokeDasharray="3 3" />
            <Legend />
            <Line type="monotone" dataKey="sales" stroke="#2196f3" />
          </LineChart>
        </ChartBox>

        {/* Bar Chart - Product Wise Sales */}
        <ChartBox title="Product-wise Quantity Sold">
          <BarChart data={productChartData}>
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="quantity" fill="#9c27b0" />
          </BarChart>
        </ChartBox>
      </div>
    </div>
  );
};

const cardStyle = {
  flex: "1 1 200px",
  padding: "20px",
  background: "#f5f5f5",
  borderRadius: "10px",
  textAlign: "center",
  fontSize: "18px",
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
};

const backButtonStyle = {
  marginBottom: "20px",
  padding: "10px 16px",
  background: "#2196f3",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "16px"
};

const ChartBox = ({ title, children }) => (
  <div style={{
    flex: "1 1 45%",
    minWidth: "400px",
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
  }}>
    <h4>{title}</h4>
    <ResponsiveContainer width="100%" height={300}>
      {children}
    </ResponsiveContainer>
  </div>
);

export default Analysis;
