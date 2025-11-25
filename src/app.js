const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const errorHandler = require("./middlewares/errorHandler");

// routes
const authRoutes = require("./routes/auth.routes");
const projectRoutes = require("./routes/project.routes");
const testcaseRoutes = require("./routes/testcase.routes");

const app = express();

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/testcases", testcaseRoutes);

app.use(errorHandler);

module.exports = app;