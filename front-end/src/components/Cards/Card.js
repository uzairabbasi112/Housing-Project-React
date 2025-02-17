import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './Card.css';
import { FaHeart } from 'react-icons/fa';

function Card({ image, name, title, rating, productId }) {
    const navigate = useNavigate(); // Initialize navigate

    // State to track if the heart is liked
    const [isLiked, setIsLiked] = useState(false);

    const handleCardClick = () => {
        navigate(`/product/${productId}`); // Navigate to the product details page
    };

    // Handle click on heart icon
    const handleHeartClick = (e) => {
        e.stopPropagation(); // Prevent the card click from firing when heart is clicked
        setIsLiked(!isLiked); // Toggle the liked state
    };

    return (
        <div className="card" onClick={handleCardClick}> {/* Add onClick to the card */}
            <div className="card-image">
                <img src={`http://localhost:5000/product_uploads/${image}`} alt={name} />
                <button 
                    className={`share-button ${isLiked ? 'liked' : ''}`} 
                    onClick={handleHeartClick} // Handle heart click
                >
                    <FaHeart color={isLiked ? 'red' : 'white'} size="20px" />
                </button>
            </div>
            <div className="card-content">
                <h2>{title}</h2>
                <p>{name}</p>
                <span>Rating: {rating}</span>
            </div>
        </div>
    );
}

export default Card;
