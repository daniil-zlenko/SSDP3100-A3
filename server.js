const express = require("express");
const morgan = require("morgan");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");

const pagesRouter = require("./src/server/routes/pages.routes");
const apiRouter = require("./src/server/routes/api.routes");

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
app.use("/api", apiRouter);
app.use("/api/*", (req, res) => {
  res.status(404).json({ error: "Not found" });
});
app.use("/", pagesRouter);

// HTML 404 catch-all
app.use((req, res) => {
  res.status(404).render("404", { title: "Page Not Found" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
