const express = require("express");
const dotenv = require("dotenv");
const colors = require("colors");
const monsterRoutes = require("./routes/monsterRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const connectDB = require("./config/db");

dotenv.config();

connectDB();
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send("API is running successfuly");
});

app.use("/api/monster", monsterRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, console.log(`Server running on port ${PORT}`.yellow.bold));
