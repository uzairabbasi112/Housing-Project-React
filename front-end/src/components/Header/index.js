import React, { useState, useEffect } from 'react';
import { FaSearch, FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './Header.css';
import { FaShoppingCart } from 'react-icons/fa';


function Header() {
    const [search, setSearch] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [userName, setUserName] = useState('');
    const navigate = useNavigate();

    const suggestions = [
        { img: 'images/p2.jpg', text: 'Suggestion 1' },
        { img: 'images/p3.jpeg', text: 'Suggestion 2' },
        { img: 'images/p4.jpeg', text: 'Suggestion 3' }
    ];

    const handleFocus = () => setShowSuggestions(true);
    const handleBlur = () => setTimeout(() => setShowSuggestions(false), 150);
    const handleSuggestionClick = (suggestion) => {
        setSearch(suggestion.text);
        setShowSuggestions(false);
    };

    const handleProfileClick = () => navigate('/login');
    const handleCartClick = () => {
        navigate('/cart'); // This will navigate to the /cart page
    };

    // Fetch user or producer details using the token
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetch('http://localhost:5000/users/user-details', {
                method: 'GET',
                headers: {
                    'Authorization': token, // Pass token in header
                    'Content-Type': 'application/json',
                }
            })
            .then(response => {
                // If user not found, try to fetch producer details
                if (response.status === 404) {
                    return fetch('http://localhost:5000/producers/user-details', {
                        method: 'GET',
                        headers: {
                            'Authorization': token,
                            'Content-Type': 'application/json',
                        }
                    });
                }
                return response; // If successful, return user details response
            })
            .then(response => response.json())
            .then(data => {
                // Set user or producer name based on response
                if (data.user) {
                    setUserName(data.user.name);
                } else if (data.producer) {
                    setUserName(data.producer.name); // Adjust according to your producer details structure
                }
            })
            .catch(error => console.error("Error fetching user/producer details:", error));
        }
    }, []);

    return (
        <header className="header">
            <div className="logo">
                <img src="/favicon.ico" alt="Logo" />
                <h1 
                    style={{
                        background: "linear-gradient(to right, #007bff, #00d4ff)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}
                >
                    Fashion
                </h1>
            </div>
            <div className="search-bar">
                <input 
                    type="text" 
                    placeholder="Search..." 
                    value={search} 
                    onChange={(e) => setSearch(e.target.value)} 
                    onFocus={handleFocus} 
                    onBlur={handleBlur}
                />
                <button id='search-btn' type="submit">
                    <FaSearch />
                </button>
                <button id="cart" type="button" onClick={handleCartClick}>
                    <FaShoppingCart />
                </button>
                

                {showSuggestions && (
                    <div className="suggestions">
                        {suggestions.map((item, index) => (
                            <div 
                                key={index} 
                                className="suggestion-item" 
                                onMouseDown={() => handleSuggestionClick(item)}
                            >
                                <img src={item.img} alt="icon" className="suggestion-logo" />
                                <span>{item.text}</span>
                            </div>
                        ))}
                    </div>
                )}

            </div>
            <div className="profile" onClick={handleProfileClick} style={{ cursor: 'pointer' }}>
                <FaUserCircle size={30} />
                {userName && <span className="user-name">{userName}</span>}
            </div>
        </header>
    );
}

export default Header;
