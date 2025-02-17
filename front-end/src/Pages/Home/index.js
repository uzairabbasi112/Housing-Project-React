import React, { useEffect, useState } from 'react';
import Card from '../../components/Cards/Card';
import './home.css';

const Home = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/products')
            .then((response) => response.json())
            .then((data) => setProducts(data))
            .catch((error) => console.error('Error fetching products:', error));
    }, []);

    return (
        <div className="cards-container">
            {products.map((product) => (
                <Card
                    key={product._id}
                    productId={product._id} // Pass product ID to Card
                    image={product.Images_path[0]}
                    name={product.Name}
                    title={product.Title}
                    rating={product.Rating}
                    price={product.Price}
                />
            ))}
        </div>
    );
};

export default Home;
