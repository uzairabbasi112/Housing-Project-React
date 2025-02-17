import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Home from "./Pages/Home";
import Login from "./Pages/Login_signup/Login";
import ProductDetails from "./Pages/ProductDetails";
import Cart from "./Pages/cart";
import Header from "./components/Header/index";
import SubHeader from "./components/Header/sub_header";
import Order from './Pages/order';
import './App.css';

function App({ isLoginPage }) {
    return (
        <div className={isLoginPage ? 'gradient-background' : ''}>
            {!isLoginPage && <Header />}
            {!isLoginPage && <SubHeader />}
            
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/login' element={<Login />} />
                <Route path='/cart' element={<Cart />} />
                <Route path='/order' element={<Order />} />
                <Route path='/product/:id' element={<ProductDetails />} />
            </Routes>
        </div>
    );
}

function WrappedApp() {
    const location = useLocation(); // Move useLocation here
    const isLoginPage = location.pathname === '/login';

    return <App isLoginPage={isLoginPage} />;
}

export default function Main() {
    return (
        <Router>
            <WrappedApp />
        </Router>
    );
}
