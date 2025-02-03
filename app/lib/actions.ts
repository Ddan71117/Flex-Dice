"use server";
import { neon } from "@neondatabase/serverless";
import bcryptjs from "bcryptjs";

// Initialize Neon connection
const sql = neon(process.env.DATABASE_URL || "");

// Function to authenticate user
export async function authenticate(username: string, password: string) {
  try {
    const user = await getUserByUsername(username);

    if (!user) {
      throw new Error("User not found");
    }

    const isMatch = await bcryptjs.compare(password, user.password);

    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    return user;
  } catch (error) {
    console.error("Error authenticating user:", error);
    throw error;
  }
}

// Function to create users table
export async function createUsersTable() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log("Users table created successfully.");
  } catch (error) {
    console.error("Error creating users table:", error);
  }
}

// Function to retrieve user by username
export async function getUserByUsername(username: string) {
  try {
    const result = await sql`
      SELECT * FROM users WHERE username = ${username}
    `;
    return result ? result[0] : null;
  } catch (error) {
    console.error("Error retrieving user by username:", error);
    return null;
  }
}

// Function to insert new user into the database
export async function createUser(username: string, password: string) {
  try {
    // Check if username already exists
    const existingUser = await getUserByUsername(username);
    if (existingUser) {
      throw new Error("Username already taken");
    }

    // Hash the password asynchronously
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Insert the new user into the database
    await sql`
      INSERT INTO users (username, password)
      VALUES (${username}, ${hashedPassword})
    `;
    console.log("User inserted successfully.");
    return { success: true }; // Return something to indicate success
  } catch (error) {
    console.error("Error inserting user:", error);
    throw error; // Rethrow the error so it can be handled by the caller
  }
}

// Logout function - to be called server-side
export async function logout(response: any) {
  try {
    // Clear cookies or session
    response.clearCookie("session_id"); // You may need to adjust based on your session management
    console.log("User logged out successfully.");
  } catch (error) {
    console.error("Error logging out user:", error);
  }
}
