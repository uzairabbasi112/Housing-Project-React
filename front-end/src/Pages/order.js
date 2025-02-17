import React, { useEffect, useState } from 'react';
import './order.css';
import axios from 'axios';

const Order = () => {
    const [orderData, setOrderData] = useState(null);
    const [isOrderSaved, setIsOrderSaved] = useState(false);

    useEffect(() => {
        // Fetch order data from localStorage
        const storedOrderData = JSON.parse(localStorage.getItem('orderData'));
        setOrderData(storedOrderData);

        // Save order details to the database
        if (storedOrderData) {
            saveOrderToDatabase(storedOrderData);
        }
    }, []);

    const saveOrderToDatabase = async (data) => {
        try {
            const userId = localStorage.getItem('userId'); // Assuming user ID is stored in localStorage
            const payload = {
                userId: userId,
                productId: data.productId, // Ensure productId is available in the data
                totalAmount: (data.price * data.quantity).toFixed(2),
            };

            const response = await axios.post('http://localhost:5000/orders', payload);

            if (response.status === 201) {
                console.log('Order saved successfully:', response.data.order);
                setIsOrderSaved(true);
            } else {
                console.error('Failed to save order:', response.data.error);
            }
        } catch (error) {
            console.error('Error saving order to database:', error.message);
        }
    };

    if (!orderData) {
        return <div>No order data found. Please go back and place an order.</div>;
    }

    return (
        <div className="order">
            <h1>Order Summary</h1>
            <div className="order-details">
                <img
                    src={`http://localhost:5000/product_uploads/${orderData.image}`}
                    alt={orderData.title}
                    className="order-image"
                    height={100}
                    width={100}
                />
                <div className="order-info">
                    <h3>Product Name: {orderData.title}</h3>
                    <p>Price: ${orderData.price}</p>
                    <p>Quantity: {orderData.quantity}</p>
                    <p>Total: ${(orderData.price * orderData.quantity).toFixed(2)}</p>
                </div>
            </div>
            {isOrderSaved && <div className="success-message">Order saved successfully!</div>}
        </div>
    );
};

export default Order;
