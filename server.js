const express = require("express");
const Database = require("better-sqlite3");
const bcrypt = require("bcrypt");
const path = require("path");

const app = express();
const PORT = 3000;

// Set up the file paths
const publicDirectory = path.join(__dirname, "..", "public");
const databasePath = path.join(__dirname, "popcorn.db");

// Open or create the SQLite database
const db = new Database(databasePath);

// Allow the server to receive JSON
app.use(express.json({ limit: "10kb" }));

// Create the users table if it doesn't exist
db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL
    )
`);

// Make the public folder available to the browser
app.use(express.static(publicDirectory));

// Show the login page
app.get("/", (req, res) => {
    res.sendFile(
        path.join(publicDirectory, "Popcorn_Bucket_Login.html")
    );
});

// REGISTER
app.post("/register", async (req, res) => {
    const username =
        typeof req.body.username === "string"
            ? req.body.username.trim()
            : "";

    const email =
        typeof req.body.email === "string"
            ? req.body.email.trim().toLowerCase()
            : "";

    const password =
        typeof req.body.password === "string"
            ? req.body.password
            : "";

    // Check that all fields were provided
    if (!username || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "Please provide a username, email, and password."
        });
    }

    // Validate username length
    if (username.length < 3 || username.length > 30) {
        return res.status(400).json({
            success: false,
            message: "Username must be between 3 and 30 characters."
        });
    }

    // Require a minimum password length
    if (password.length < 8) {
        return res.status(400).json({
            success: false,
            message: "Password must be at least 8 characters long."
        });
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({
            success: false,
            message: "Please enter a valid email address."
        });
    }

    try {
        // Hash the password before storing it
        const passwordHash = await bcrypt.hash(password, 12);

        // Insert the new account into SQLite
        const statement = db.prepare(`
            INSERT INTO users (username, email, password_hash)
            VALUES (?, ?, ?)
        `);

        statement.run(username, email, passwordHash);

        return res.status(201).json({
            success: true,
            message: "Account created successfully!"
        });

    } catch (error) {
        // Handle duplicate usernames or emails
        if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
            return res.status(409).json({
                success: false,
                message: "Username or email already exists."
            });
        }

        console.error("Registration error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong. Please try again."
        });
    }
});

// LOGIN
app.post("/login", async (req, res) => {
    const username =
        typeof req.body.username === "string"
            ? req.body.username.trim()
            : "";

    const password =
        typeof req.body.password === "string"
            ? req.body.password
            : "";

    // Make sure the required fields were provided
    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: "Please provide a username and password."
        });
    }

    try {
        // Find the account by username
        const statement = db.prepare(`
            SELECT id, username, password_hash
            FROM users
            WHERE username = ?
        `);

        const user = statement.get(username);

        // Verify the account and password
        if (
            !user ||
            !(await bcrypt.compare(password, user.password_hash))
        ) {
            return res.status(401).json({
                success: false,
                message: "Invalid username or password."
            });
        }

        // Credentials are valid
        return res.json({
            success: true,
            message: "Login successful!"
        });

    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong. Please try again."
        });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});