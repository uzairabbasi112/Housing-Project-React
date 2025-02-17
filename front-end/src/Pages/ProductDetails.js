import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Product_Details.css';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [showBuyNowModal, setShowBuyNowModal] = useState(false); // State for Buy Now modal visibility
    const [shippingAddress, setShippingAddress] = useState('');
    const [shippingMethod, setShippingMethod] = useState('standard');
    const [promoCode, setPromoCode] = useState('');

    useEffect(() => {
        fetch(`http://localhost:5000/products/${id}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => setProduct(data))
            .catch((error) => console.error('Error fetching product:', error));
    }, [id]);

    if (!product) return <div>Loading...</div>;

    const openImageModal = (img) => {
        setSelectedImage(img);
    };

    const closeImageModal = () => {
        setSelectedImage(null);
    };

    const renderRating = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span key={i} className={`star ${i <= rating ? 'filled' : ''}`}>
                    ★
                </span>
            );
        }
        return stars;
    };

    const increaseQuantity = () => setQuantity(quantity + 1);
    const decreaseQuantity = () => setQuantity(quantity > 1 ? quantity - 1 : 1);

    const handleAddToCart = () => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingProductIndex = cart.findIndex(item => item.id === product._id);

        if (existingProductIndex >= 0) {
            cart[existingProductIndex].quantity += quantity;
        } else {
            cart.push({
                id: product._id,
                name: product.Name,
                title: product.Title,
                price: product.Price,
                quantity: quantity,
                image: product.Images_path[0],
            });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        navigate('/cart');
    };

    const handleBuyNowClick = () => {
        setShowBuyNowModal(true);
    };

    const closeBuyNowModal = () => {
        setShowBuyNowModal(false);
    };

    const handlePlaceOrder = () => {
        const orderData = {
            id: product._id,
            name: product.Name,
            title: product.Title,
            price: product.Price,
            quantity: quantity,
            image: product.Images_path[0],
        };
    
        localStorage.setItem('orderData', JSON.stringify(orderData));
        navigate('/order');
    };
    
    return (
        <div className="product-details">
            <h1 className="product-title">{product.Title}</h1>
            <div className="product-images">
                {product.Images_path.map((img, index) => (
                    <img
                        key={index}
                        src={`http://localhost:5000/product_uploads/${img}`}
                        alt={`${product.Title} image ${index + 1}`}
                        onClick={() => openImageModal(img)}
                    />
                ))}
            </div>
            <div className="product-content">
                <div className="product-left">
                    <p className="product-name">{product.Name}</p>
                    <p className="product-description">{product.Description}</p>
                    <p className="product-rating">
                        Rating: <span className="stars">{renderRating(product.Rating)}</span>
                    </p>
                    <p className="product-price">Price: ${product.Price}</p>
                </div>

                <div className="product-right">
                    <div className="quantity-control">
                        <button onClick={decreaseQuantity}>-</button>
                        <span>{quantity}</span>
                        <button onClick={increaseQuantity}>+</button>
                    </div>
                    <button className="add-to-cart" onClick={handleAddToCart}>Add to Cart</button>
                    <button className="buy-now" onClick={handleBuyNowClick}>Buy Now</button>
                </div>
            </div>

            {selectedImage && (
                <div className="modal" onClick={closeImageModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <span className="close" onClick={closeImageModal}>&times;</span>
                        <img src={`http://localhost:5000/product_uploads/${selectedImage}`} alt="Selected" />
                    </div>
                </div>
            )}

            {showBuyNowModal && (
                <div className="modal" onClick={closeBuyNowModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <span className="close" onClick={closeBuyNowModal}>&times;</span>
                        <h2>Buy Now</h2>
                        <div className="buy-now-details">
                            <p><strong>Product:</strong> {product.Title}</p>
                            <p><strong>Price:</strong> ${product.Price}</p>
                            <p><strong>Quantity:</strong> {quantity}</p>
                            <p><strong>Total:</strong> ${(product.Price * quantity).toFixed(2)}</p>

                            <label>
                                Shipping Address:
                                <input
                                    type="text"
                                    value={shippingAddress}
                                    onChange={(e) => setShippingAddress(e.target.value)}
                                    placeholder="Enter your address"
                                />
                            </label>

                            <label>
                                Shipping Method:
                                <select
                                    value={shippingMethod}
                                    onChange={(e) => setShippingMethod(e.target.value)}
                                >
                                    <option value="standard">Standard Shipping</option>
                                    <option value="express">Express Shipping</option>
                                </select>
                            </label>

                            <label>
                                Promo Code (Optional):
                                <input
                                    type="text"
                                    value={promoCode}
                                    onChange={(e) => setPromoCode(e.target.value)}
                                    placeholder="Enter promo code"
                                />
                            </label>

                            <div className="order-summary">
                                <p>Product Total: ${(product.Price * quantity).toFixed(2)}</p>
                                <p>Shipping: {shippingMethod === 'express' ? '$10' : '$5'}</p>
                                <p><strong>Grand Total:</strong> ${(product.Price * quantity + (shippingMethod === 'express' ? 10 : 5)).toFixed(2)}</p>
                            </div>
                        </div>
                        <button onClick={handlePlaceOrder} className="place-order-btn">Place Order</button>
                        <button onClick={closeBuyNowModal} className="cancel-btn">Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetails;
