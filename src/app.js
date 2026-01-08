const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const healthRouter = require("./routes/health.routes");
const notFound = require("./middlewares/notFound");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

// Security: disable Express signature header
app.disable("x-powered-by");

// Parsing JSON
app.use(express.json());
app.use(helmet());
app.use(cors());
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// Routes
app.use("/health", healthRouter);

// Not Found
app.use(notFound);

// Server Error
app.use(errorHandler);

module.exports = app;
