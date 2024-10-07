"use client"
import React, { useState } from 'react';
import { createStudent } from '@/app/action';

const Register = () => {
    // State for form fields and loading state
    const [formData, setFormData] = useState({
        studentName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false); // Loading state

    // Handle input change
    const handleChange = (e: any) => {
        const { id, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [id]: value,
        }));
    };

    // Handle form submission
    const handleSubmit = async (e: any) => {
        e.preventDefault();

        // Check if passwords match
        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        // Start loading when the form is being submitted
        setLoading(true);

        try {
            // Send data to the server
            const data = await createStudent(formData);
            console.log(data, 'data'); // Client log

            // Show the server response in an alert
            if (data?.error) {
                alert(data.error);
            } else {
                alert('Registration successful!');
            }

        } catch (error) {
            console.error('Error submitting form', error);
            alert('Registration failed');
        } finally {
            // Stop loading after the request is completed
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Register</h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    {/* Student Name */}
                    <div>
                        <label htmlFor="studentName" className="block text-sm font-medium text-gray-700">Student Name</label>
                        <input
                            type="text"
                            id="studentName"
                            value={formData.studentName}
                            onChange={handleChange}
                            placeholder="Enter your name"
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Email */}
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

                    {/* Password */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm your password"
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Register Button */}
                    <div>
                        <button
                            type="submit"
                            disabled={loading} // Disable while loading
                            className={`w-full text-white p-3 rounded-md transition-colors duration-300 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
                        >
                            {loading ? 'Submitting...' : 'Register'} {/* Change button text based on loading state */}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
