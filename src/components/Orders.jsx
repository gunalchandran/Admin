import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userEmail = localStorage.getItem("email");
    if (!userEmail) {
      console.error("No userEmail found in localStorage");
      return;
    }

    axios.get(`http://localhost:5000/order-history?email=${userEmail}`)
      .then(response => {
        setOrders(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the order history:", error);
      });
  }, []);

  const cancelOrder = (orderId) => {
    const userEmail = localStorage.getItem('email');
    if (!userEmail) {
      console.error("No userEmail found in localStorage");
      return;
    }

    axios.delete(`http://localhost:5000/cancel-order/${orderId}?email=${userEmail}`)
      .then(response => {
        alert("Order canceled successfully");
        setOrders(orders.filter(order => order._id !== orderId));
      })
      .catch(error => {
        console.error("There was an error canceling the order:", error);
      });
  };

  const goBack = () => {
    navigate('/customer-dashboard');
  };

  const styles = {
    container: {
      padding: '30px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f0f4f8',
      minHeight: '100vh',
    },
    backButton: {
      marginBottom: '20px',
      backgroundColor: '#3498db',
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: 'bold',
      transition: '0.3s ease',
    },
    title: {
      textAlign: 'center',
      fontSize: '28px',
      marginBottom: '30px',
      color: '#2c3e50',
    },
    orderList: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '25px',
      justifyContent: 'center',
    },
    orderCard: {
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      transition: 'transform 0.2s ease',
    },
    orderImage: {
      width: '100%',
      height: '180px',
      objectFit: 'cover',
      borderRadius: '10px',
      marginBottom: '10px',
    },
    orderDetails: {
      flexGrow: 1,
    },
    productTitle: {
      fontSize: '20px',
      color: '#2c3e50',
      marginBottom: '10px',
    },
    paragraph: {
      margin: '5px 0',
      color: '#555',
    },
    cancelButton: {
      backgroundColor: '#e74c3c',
      color: 'white',
      border: 'none',
      padding: '10px',
      borderRadius: '8px',
      cursor: 'pointer',
      marginTop: '15px',
      fontWeight: 'bold',
      transition: '0.3s ease',
    }
  };

  return (
    <div style={styles.container}>
      <button
        style={styles.backButton}
        onClick={goBack}
        onMouseOver={(e) => e.target.style.backgroundColor = '#2980b9'}
        onMouseOut={(e) => e.target.style.backgroundColor = '#3498db'}
      >
        ← Back
      </button>

      <h2 style={styles.title}>Your Order History</h2>

      <div style={styles.orderList}>
        {orders.map(order => (
          <div key={order._id} style={styles.orderCard}>
            {order.image ? (
              <img src={order.image} alt={order.product_name} style={styles.orderImage} />
            ) : (
              <div style={{ textAlign: 'center', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#eee', borderRadius: '10px' }}>
                <p>No Image Available</p>
              </div>
            )}
            <div style={styles.orderDetails}>
              <h3 style={styles.productTitle}>{order.product_name}</h3>
              <p style={styles.paragraph}><strong>Quantity:</strong> {order.quantity}</p>
              <p style={styles.paragraph}><strong>Total Price:</strong> ${order.total_price}</p>
              <p style={styles.paragraph}><strong>Delivery Time:</strong> {order.delivery_time}</p>
              <p style={styles.paragraph}><strong>Delivery Status:</strong> {order.delivery_status}</p>
            </div>
            {order.delivery_status === "Pending" && (
              <button
                style={styles.cancelButton}
                onClick={() => cancelOrder(order._id)}
                onMouseOver={(e) => e.target.style.backgroundColor = '#c0392b'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#e74c3c'}
              >
                Cancel Order
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
