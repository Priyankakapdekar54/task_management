"use client"
import React from 'react';
import { useEffect, useState } from 'react';

const Header = () => {
    const [studentData, setStudentData] = useState(null);

    useEffect(() => {
        // Fetch the student data from cookies
        const cookieData = document.cookie
            .split('; ')
            .find(row => row.startsWith('studentData='));

        if (cookieData) {
            const data = cookieData.split('=')[1];
            setStudentData(JSON.parse(decodeURIComponent(data))); // Decode and parse the cookie data
        }
    }, []);

    const handleLogout = () => {
        // Clear the studentData cookie
        document.cookie = 'studentData=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        // You may want to redirect to login or home page after logging out
        window.location.href = '/login'; // Redirect to login page
    };

    return (
        <div className="flex justify-between items-center p-4 bg-blue-600 text-white">
            <div className="text-xl font-bold">
                Task Management
            </div>
            {studentData && (
                <div className="flex items-center space-x-4">
                    {/* <span>{studentData.student_name}</span> */}
                    <span>{studentData.email}</span>

                    <button
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md transition duration-300"
                    >
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
};

export default Header;
