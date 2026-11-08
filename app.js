const express = require("express");
const app = express();

const searchRoutes = require("./searchRoutes");
const secondChanceItemsRoutes = require("./secondChanceItemsRoutes");

app.use(express.json());

app.use("/api/secondchance/search", searchRoutes);
app.use("/api/secondchance/items", secondChanceItemsRoutes);

app.get("/", (req, res) => {
    res.send("Welcome to SecondChance");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
