require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");

const pageRoutes = require("./routes/pageRoutes");
const apiRoutes = require("./routes/apiRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();
const PORT = process.env.PORT || 3100;

// View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);
app.set("layout", "layouts/layout-full");

// Middleware
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", apiRoutes);
app.use("/api/*", (req, res) => {
  res.status(404).json({ error: "Not found" });
});
app.use("/admin", adminRoutes);
app.use("/", pageRoutes);

// HTML 404 catch-all
app.use((req, res) => {
  res.status(404).render("404", { title: "Page Not Found" });
});

// Connect to MongoDB then start server
if (!process.env.MONGODB_URI) {
  console.error("Error: MONGODB_URI is not set. Check your .env file.");
  process.exit(1);
}

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err.message);
    process.exit(1);
  });
