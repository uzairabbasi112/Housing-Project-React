import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true); // Start loading

        try {
            // Attempt to login through Users first
            const userResponse = await fetch('http://localhost:5000/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const userData = await userResponse.json();
            console.log("User Login Response:", userData); // Log the full response

            if (userResponse.ok) {
                // If login is successful, navigate to home page
                localStorage.setItem('token', userData.token);
                localStorage.setItem('userType', 'user'); // Store user type
                localStorage.setItem('IsUser', '1'); // Set IsUser variable
                navigate('/');
                return; // Exit the function
            }

            // If user not found, attempt to login through Producers
            const producerResponse = await fetch('http://localhost:5000/producers/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const producerData = await producerResponse.json();
            console.log("Producer Login Response:", producerData); // Log the full response

            if (producerResponse.ok) {
                // If producer login is successful, navigate to home page
                localStorage.setItem('token', producerData.token);
                localStorage.setItem('userType', 'producer'); // Store user type
                localStorage.setItem('IsUser', '0'); // Set IsUser variable
                navigate('/');
            } else {
                // If both user and producer login failed
                alert(userData.message || producerData.message || "Invalid email or password");
            }
        } catch (error) {
            console.error("Error logging in:", error);
            alert("An error occurred. Please try again.");
        } finally {
            setLoading(false); // Stop loading
        }
    };

    return (
        <div className="login-container">
            <div className="login-form">
                <h2>Login</h2>
                <form onSubmit={handleLogin}>
                    <div className="input-container">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-container">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="login-button" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <p className="register-text">
                    Don't have an account? <a href="/register">Register</a>
                </p>
            </div>
        </div>
    );
};

export default Login;
