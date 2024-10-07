import { Pool } from "pg";

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "task_management", // change with your database name
  password: "priyanka", // password will be of your pgadmin4
  port: 5432,
});

export const query = (text: any, params: any) => pool.query(text, params);
