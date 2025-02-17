import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './cart.css';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        // Fetch the cart data from localStorage when the component mounts
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        setCartItems(cart);
    }, []);

    const handleRemoveItem = (index) => {
        const updatedCart = [...cartItems];
        updatedCart.splice(index, 1);
        setCartItems(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart)); // Update localStorage
    };

    const handleCheckout = () => {
        // You can implement the checkout process here
        alert("Proceeding to checkout...");
    };

    return (
        <div className="cart">
            <h1>Your Cart</h1>
            <div className="cart-items">
                {cartItems.length === 0 ? (
                    <p>Your cart is empty.</p>
                ) : (
                    cartItems.map((item, index) => (
                        <div key={index} className="cart-item">
                            <img
                                src={`http://localhost:5000/product_uploads/${item.image}`}
                                alt={item.name}
                                className="cart-item-image"
                            />
                            <div className="cart-item-info">
                                <h3>{item.title}</h3> {/* Display title */}
                                <p>Price: ${item.price}</p>
                                <p>Quantity: {item.quantity}</p>
                                <p>Total: ${item.price * item.quantity}</p> {/* Total for the item */}
                                <button onClick={() => handleRemoveItem(index)}>Remove</button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="cart-total">
                <p>Total: ${cartItems.reduce((total, item) => total + item.price * item.quantity, 0)}</p>
            </div>

            <div className="cart-actions">
                <button className="checkout" onClick={handleCheckout}>Proceed to Checkout</button>
                <Link to="/" className="continue-shopping">Continue Shopping</Link>
            </div>
        </div>
    );
};

export default Cart;
