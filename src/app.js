const express = require("express");
const healthRouter = require("./routes/health.routes");

const app = express();

// Parsing JSON
app.use(express.json());

// Routes
app.use("/health", healthRouter);

// Not Found
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

// Server Error
app.use((err, req, res, next) => {
  res.status(500).json({ error: "Internal Server Error!" });
});

module.exports = app;
