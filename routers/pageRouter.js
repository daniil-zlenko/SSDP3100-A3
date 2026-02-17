const express = require("express");
const path = require("path");

const router = express.Router();
const pagesDir = path.join(__dirname, "..", "pages");

router.get("/", (req, res) => {
  res.sendFile(path.join(pagesDir, "index.html"));
});

router.get("/about", (req, res) => {
  res.sendFile(path.join(pagesDir, "about.html"));
});

router.get("/projects", (req, res) => {
  res.sendFile(path.join(pagesDir, "projects.html"));
});

router.get("/contact", (req, res) => {
  res.sendFile(path.join(pagesDir, "contact.html"));
});

module.exports = router;
