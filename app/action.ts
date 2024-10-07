'use server'
import bcrypt from 'bcrypt';
import { query } from './db';

export async function createStudent(formData: any) {
    const { studentName, email, password } = formData;

    try {
        // Check if the email already exists
        const checkEmailQuery = 'SELECT * FROM students WHERE email = $1';
        // Here query is a function which we create in db.ts file and we use to insert record in db.
        const { rowCount } = await query(checkEmailQuery, [email]);

        if (rowCount > 0) {
            // If the email already exists, send an error
            return { error: 'Email already exists' };
        }

        // Hash the password with bcrypt
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insert the student data into the database
        const insertStudentQuery = `
            INSERT INTO students (student_name, email, password, created_at)
            VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
            RETURNING *;
        `;
        const result = await query(insertStudentQuery, [studentName, email, hashedPassword]);

        // If the insert was successful, return the newly created student data
        return { success: true, student: result.rows[0] };

    } catch (error) {
        console.error('Error creating student:', error); // this is server log
        return { error: 'Registration failed' };
    }
}

export async function loginStudent(formData: any) {
    try {
        const { email, password } = formData;

        // Check if email and password are provided
        if (!email || !password) {
            throw new Error('Email and password are required.');
        }

        // Query to find the student by email (including password for verification)
        const queryData = `SELECT id, student_name, email, password, created_at FROM students WHERE email = $1`;

        const result = await query(queryData, [email]); // Error batao priyanka

        // If the account doesn't exist, send an error
        if (result.rows.length === 0) {
            throw new Error('No account found with the provided email.');
        }

        // Get the student data
        const studentData = result.rows[0];

        // Compare the provided password with the hashed password from the database
        const isPasswordValid = await bcrypt.compare(password, studentData.password);

        if (!isPasswordValid) {
            throw new Error('Invalid password.');
        }

        // Exclude the password from the returned data
        delete studentData.password; // Remove the password from the returned object

        return {
            success: true,
            student: studentData
        };
    } catch (error) {
        console.log('Error in loginStudent:', error);

        return {
            success: false,
            message: error.message || 'Login failed.',
        };
    }
}


export async function fetchTasks(student_id: any) {
    try {
        // SQL query to fetch tasks for the specific student_id
        const sqlQuery = 'SELECT task_id, task_name, status FROM tasks WHERE student_id = $1';
        const result = await query(sqlQuery, [student_id]);

        // Assuming result.rows contains the tasks
        return result.rows;
    } catch (error) {
        console.error('Error fetching tasks:', error);
        throw new Error('Could not fetch tasks');
    }
}

export async function fetchTasksBasedonTaskId(task_id: any) {
    try {
        // SQL query to fetch tasks for the specific student_id
        const sqlQuery = 'SELECT task_id, task_name, status FROM tasks WHERE task_id = $1';
        const result = await query(sqlQuery, [task_id]);

        // Assuming result.rows contains the tasks
        return result.rows;
    } catch (error) {
        console.error('Error fetching tasks:', error);
        throw new Error('Could not fetch tasks');
    }
}

export async function manageTaskWithDb(taskName: string, status: string, edit: boolean, student_id: number) {
    try {
        if (edit) {
            // Update the task
            const queryData = `
                UPDATE tasks 
                SET task_name = $1, status = $2, updated_at = CURRENT_TIMESTAMP 
                WHERE task_id = $3 AND student_id = $4
            `;
            const values = [taskName, status, edit, student_id];
            const res = await query(queryData, values);

            if (res.rowCount > 0) {
                return { success: true, message: 'Task updated successfully' };
            } else {
                return { success: false, message: 'Task not found or no changes made' };
            }
        } else {
            // Insert the new task
            const queryInsert = `
                INSERT INTO tasks (student_id, task_name, status) 
                VALUES ($1, $2, $3)
            `;
            const values = [student_id, taskName, status];
            await query(queryInsert, values);
            return { success: true, message: 'Task inserted successfully' };
        }
    } catch (error) {
        console.error('Error managing task:', error);
        return { success: false, message: 'Error managing task' };
    }
}


export async function deleteTask(task_id: any) {
    try {
        const sqlQuery = 'DELETE FROM tasks WHERE task_id = $1';
        const result = await query(sqlQuery, [task_id]);

        if (result.rowCount > 0) {
            return { success: true, message: 'Task deleted successfully' };
        } else {
            return { success: false, message: 'Task not found' };
        }
    } catch (error) {
        console.log(error)
    }
}