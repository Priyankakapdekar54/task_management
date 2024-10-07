"use client"
import React, { useEffect, useState } from 'react';
import { fetchTasksBasedonTaskId, manageTaskWithDb } from '../action';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie'; // Import the js-cookie library

const TaskManageForm = ({ edit }: any) => {
    const [taskName, setTaskName] = useState('');
    const [status, setStatus] = useState('pending'); // Default status

    const route = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchTasksBasedonTaskId(edit);
            if (data?.length === 0) {
                route.push(`/`);
            } else if (data?.length > 0) {
                setTaskName(data[0].task_name);
                setStatus(data[0].status);
            }
        };

        if (edit) {
            fetchData();
        }
    }, [edit, route]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Get student_id from cookies
        const studentData = Cookies.get('studentData');
        const student_id = studentData ? JSON.parse(studentData).id : null;

        try {
            // Call manageTaskWithDb with student_id
            const response = await manageTaskWithDb(taskName, status, edit, student_id);

            // Handle the response
            if (response.success) {
                // Alert the success message
                const confirmRedirect = window.confirm(response.message + "\nDo you want to go to the home page?");

                if (confirmRedirect) {
                    // Redirect to home page if user confirms
                    route.push('/'); // Use Next.js router to navigate
                }
            } else {
                alert(response.message); // Show error message if the operation wasn't successful
            }

            // Reset the form fields
            setTaskName('');
            setStatus('pending');
        } catch (error) {
            console.log(error);
            alert('An unexpected error occurred.'); // Show error for unexpected issues
        }
    };


    return (
        <div className='md:container mx-auto mt-10 p-4'>
            <h2 className='text-2xl mb-4'>{edit ? 'Edit Task' : 'Create Task'}</h2>
            <form onSubmit={handleSubmit} className='space-y-4'>
                <div>
                    <label htmlFor="taskName" className='block text-lg'>Task Name</label>
                    <input
                        type="text"
                        id="taskName"
                        value={taskName}
                        onChange={(e) => setTaskName(e.target.value)}
                        required
                        className='w-full p-2 border border-gray-300 rounded'
                        placeholder='Enter task name'
                    />
                </div>
                <div>
                    <label htmlFor="status" className='block text-lg'>Status</label>
                    <select
                        id="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className='w-full p-2 border border-gray-300 rounded'
                    >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>
                <button
                    type="submit"
                    className='mt-4 w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200'
                >
                    {edit ? 'Update Task' : 'Create Task'}
                </button>
            </form>
        </div>
    );
};

export default TaskManageForm;
