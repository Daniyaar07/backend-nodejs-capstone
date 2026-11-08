const express = require("express");
const bcrypt = require("bcryptjs");
const { ObjectId } = require("mongodb");
const { connectToDatabase } = require("./db");

const router = express.Router();

router.post("/register", async (req, res) => {
    try {
        const db = await connectToDatabase();
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await db.collection("users").findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await db.collection("users").insertOne({
            name,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            message: "User registered successfully",
            userId: result.insertedId
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/login", async (req, res) => {
    try {
        const db = await connectToDatabase();
        const { email, password } = req.body;

        const user = await db.collection("users").findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        res.json({
            message: "Login successful",
            userId: user._id,
            name: user.name
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put("/update/:id", async (req, res) => {
    try {
        const db = await connectToDatabase();
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Name is required" });
        }

        const result = await db.collection("users").updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: { name } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User updated successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
