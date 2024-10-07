"use client";
import React, { useEffect, useState } from 'react';
import { deleteTask, fetchTasks } from '../action';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation'; // Import useRouter for navigation

const ListTasks = () => {
    const [tasks, setTasks] = useState<any>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null);
    const router = useRouter(); // Initialize router for navigation

    useEffect(() => {
        const studentData = Cookies.get('studentData'); // Get studentData from cookies
        if (studentData) {
            const { id } = JSON.parse(studentData); // Parse studentData to get id
            fetchTasks(id)
                .then((fetchedTasks) => {
                    setTasks(fetchedTasks);
                })
                .catch((err) => {
                    setError('Failed to load tasks');
                    console.error(err);
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setError('No student data found'); // Handle case where studentData does not exist
            setLoading(false);
        }
    }, []);

    const handleEdit = (task_id: number) => {
        // Redirect to the task management page with the task_id for editing
        router.push(`/manage-task?edit=${task_id}`);
    };

    const handleDelete = async (task_id: number, student_id: any) => {
        // Implement your delete task logic here
        const confirmed = window.confirm("Are you sure you want to delete this task?");
        if (confirmed) {
            // Call the delete action and refresh the tasks list
            console.log(`Deleting task with id ${task_id}`);
            // After delete, fetch the updated task list
            const data = await deleteTask(task_id);
            if (data?.success) {
                await fetchTasks(student_id).then(setTasks);
                alert(' Task deleted successfully ')
            } else {
                alert('Failed to delete task');
            }
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    // Empty state for when there are no tasks
    if (tasks.length === 0) {
        return (
            <div className='md:container mx-auto mt-10 text-center'>
                <h2>No Tasks Available</h2>
                <p>You currently have no tasks assigned.</p>
                <button
                    className='mt-4 p-2 bg-blue-500 text-white rounded'
                    onClick={() => router.push('/manage-task')} // Redirect to manage tasks page
                >
                    Manage Tasks
                </button>
            </div>
        );
    }

    return (
        <div className='md:container mx-auto mt-10'>
            <div className='flex justify-between items-center mb-10'>
                {/* Create Button to Create new tasks  */}
                <h2 className='text-2xl font-semibold'>Task List</h2>
                <button
                    className='mt-4 p-2 bg-blue-500 text-white rounded'
                    onClick={() => router.push('/manage-task')} // Redirect to manage tasks page
                >Create new task </button>
            </div>
            <table className='w-full table-auto border-collapse'>
                <thead>
                    <tr className='bg-gray-200'>
                        <th className='p-2 border'>Task Name</th>
                        <th className='p-2 border'>Status</th>
                        {/* a  */}
                        <th className='p-2 border'>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map((task: any) => (
                        <tr key={task.task_id} className='text-center'>
                            <td className='p-2 border'>{task.task_name}</td>
                            <td className='p-2 border'>{task.status}</td>
                            <td className='p-2 border'>
                                <button
                                    className='mr-2 p-1 bg-green-500 text-white rounded hover:bg-green-600'
                                    onClick={() => handleEdit(task.task_id)}
                                >
                                    Edit
                                </button>
                                <button
                                    className='p-1 bg-red-500 text-white rounded hover:bg-red-600'
                                    onClick={() => handleDelete(task.task_id, task.student_id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ListTasks;
