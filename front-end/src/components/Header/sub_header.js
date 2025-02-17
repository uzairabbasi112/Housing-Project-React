import React, { useState, useEffect } from 'react';
import { FaAngleDown, FaHome, FaLaptop, FaTshirt, FaBatteryFull, FaBreadSlice, FaBlog, FaPhoneAlt } from 'react-icons/fa';
import axios from 'axios';

function SubHeader() {
    const [showPopup, setShowPopup] = useState(false);
    const [showPostProductPopup, setShowPostProductPopup] = useState(false);
    const [countries, setCountries] = useState([]);
    
    const [formData, setFormData] = useState({
        name: '',
        title: '',
        category: '',
        description: '',
        images: []
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const togglePopup = () => {
        setShowPopup(!showPopup);
    };

    const closePopup = () => {
        setShowPopup(false);
    };

    const openPostProductPopup = () => {
        setShowPostProductPopup(true);
    };

    const closePostProductPopup = () => {
        setShowPostProductPopup(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleFileChange = (e, index) => {
        const file = e.target.files[0];
        if (file) {
            const updatedImages = [...formData.images];
            updatedImages[index] = file;
            setFormData((prevData) => ({ ...prevData, images: updatedImages }));
        }
    };

    useEffect(() => {
        if (showPopup && countries.length === 0) {
            fetch('https://countriesnow.space/api/v0.1/countries/')
                .then(response => response.json())
                .then(data => {
                    const countryNames = data.data.map(country => country.country);
                    setCountries(countryNames);
                })
                .catch(error => {
                    console.error('Error fetching countries:', error);
                });
        }
    }, [showPopup, countries]);

    const isUserProducer = localStorage.getItem('IsUser') === '0';
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
    
        try {
            // Create FormData to handle files
            const formPayload = new FormData();
            formPayload.append('Title', formData.title); // Rename `title` to `Title`
            formPayload.append('Category', formData.category);
            formPayload.append('Description', formData.description);
            formPayload.append('Name', formData.name);
            formPayload.append('Rating', 0); // Default rating, as it's required
            formPayload.append('Price', 100); // Ensure the price is a number
            formData.images.forEach((image) => {
                formPayload.append('Images_path', image); // Rename `images` to `Images_path`
            });
            console.log(formPayload)
    
            // Make the POST request to the backend
            const response = await axios.post('http://localhost:5000/products', formPayload, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
    
            if (response.status === 201) {
                alert('Product created successfully!');
                closePostProductPopup();
                setFormData({
                    name: '',
                    title: '',
                    category: '',
                    description: '',
                    images: [],
                    price: '',
                });
            } else {
                alert('Failed to create the product.');
            }
        } catch (error) {
            console.error('Error submitting product:', error.message);
            alert('An error occurred while creating the product.');
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
        <>
            <div className="sub-header">
                <div className="all-categories">
                    <button className="categories-button" onClick={togglePopup}>
                        Countries <FaAngleDown />
                    </button>
                </div>
                <div className="menu-items">
                    <ul>
                        <li><FaHome /> Home</li>
                        <li><FaLaptop /> Electronic</li>
                        <li><FaTshirt /> Fashion</li>
                        <li><FaBatteryFull /> Batteries</li>
                        <li><FaBreadSlice /> Bakery</li>
                        <li><FaBlog /> Blogs</li>
                        <li><FaPhoneAlt /> Contacts</li>
                    </ul>
                </div>

                {isUserProducer && (
                    <button className="post-product-button" onClick={openPostProductPopup}>
                        Post Product
                    </button>
                )}
            </div>
            
            {showPopup && (
                <>
                    <div className="overlay" onClick={closePopup}></div>
                    <div className="center-popup">
                        <ul>
                            {countries.length > 0 ? (
                                countries.map((country, index) => (
                                    <li key={index}>{country}</li>
                                ))
                            ) : (
                                <li>Loading...</li>
                            )}
                        </ul>
                    </div>
                </>
            )}

            {showPostProductPopup && (
                <>
                    <div className="overlay" onClick={closePostProductPopup}></div>
                    <div className="post-product-popup">
                        <h2>Post a New Product</h2>
                        <form>
                            <div>
                                <label>Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div>
                                <label>Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div>
                                <label>Category</label>
                                <input
                                    type="text"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div>
                                <label>Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    required
                                ></textarea>
                            </div>
                            <div className="image-upload-container">
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <span key={index} className="upload-box">
                                        {formData.images[index] ? (
                                            <img src={URL.createObjectURL(formData.images[index])} alt={`Preview ${index + 1}`} />
                                        ) : (
                                            <label htmlFor={`file-input-${index}`} className="upload-placeholder">
                                                Click to upload
                                            </label>
                                        )}
                                        <input
                                            type="file"
                                            id={`file-input-${index}`}
                                            className="file-input"
                                            accept="image/*"
                                            onChange={(e) => handleFileChange(e, index)}
                                        />
                                    </span>
                                ))}
                            </div>
                            <button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Submitting...' : 'Submit'}
                            </button>
                        </form>
                    </div>
                </>
            )}
        </>
    );
}

export default SubHeader;
