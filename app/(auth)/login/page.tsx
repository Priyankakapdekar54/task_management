"use client"
import { loginStudent } from '@/app/action';
import React, { useState } from 'react';
import Cookies from 'js-cookie'; // Import the js-cookie library

const Login = () => {
    // State to manage form data
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    // State to toggle password visibility
    const [showPassword, setShowPassword] = useState(false);

    // Handle input change
    const handleChange = (e: any) => {
        const { id, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [id]: value,
        }));
    };

    // Toggle password visibility
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // Check if both email and password are filled
    const isFormFilled = formData.email && formData.password;

    // Handle form submission
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (isFormFilled) {
            const data = await loginStudent(formData)
            if (data.success) {
                Cookies.set('studentData', JSON.stringify(data.student), { expires: 7 }); // Cookie expires in 7 days
                window.location.href = '/'; // Redirect to root page
            } else {
                alert(data.message);
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>
                <form className="space-y-4" onSubmit={handleSubmit}>

                    {/* Email Field */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Password Field */}
                    <div className="relative">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type={showPassword ? 'text' : 'password'} // Toggle between text and password
                            id="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {/* Show/Hide Toggle */}
                        <span
                            onClick={togglePasswordVisibility}
                            className="absolute top-9 right-4 text-gray-500 cursor-pointer"
                        >
                            {showPassword ? 'Hide' : 'Show'}
                        </span>
                    </div>

                    {/* Submit Button */}
                    <div>
                        <button
                            type="submit"
                            disabled={!isFormFilled} // Disable button if fields are not filled
                            className={`w-full text-white p-3 rounded-md transition-colors duration-300 ${isFormFilled ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400 cursor-not-allowed'}`}
                        >
                            Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
