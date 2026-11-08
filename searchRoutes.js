const express = require("express");
const { connectToDatabase } = require("./db");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const db = await connectToDatabase();
        const category = req.query.category;

        const filter = {};

        if (category) {
            filter.category = category;
        }

        const items = await db.collection("secondChanceItems")
            .find(filter)
            .toArray();

        res.json(items);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
