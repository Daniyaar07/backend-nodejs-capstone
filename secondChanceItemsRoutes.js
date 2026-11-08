const express = require("express");
const multer = require("multer");
const { ObjectId } = require("mongodb");
const { connectToDatabase } = require("./db");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.get("/", async (req, res) => {
    try {
        const db = await connectToDatabase();
        const items = await db.collection("secondChanceItems").find().toArray();
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const db = await connectToDatabase();
        const item = await db.collection("secondChanceItems").findOne({
            _id: new ObjectId(req.params.id)
        });

        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        res.json(item);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post("/", upload.single("image"), async (req, res) => {
    try {
        const db = await connectToDatabase();

        const item = {
            name: req.body.name,
            category: req.body.category,
            description: req.body.description,
            image: req.file ? req.file.filename : null
        };

        const result = await db.collection("secondChanceItems").insertOne(item);

        res.status(201).json({
            message: "Item created",
            insertedId: result.insertedId
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const db = await connectToDatabase();

        const result = await db.collection("secondChanceItems").deleteOne({
            _id: new ObjectId(req.params.id)
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Item not found" });
        }

        res.json({ message: "Item deleted successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
