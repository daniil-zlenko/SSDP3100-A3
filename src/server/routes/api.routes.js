const express = require("express");
const repo = require("../lib/projects.repository");

const router = express.Router();

router.get("/projects", (req, res) => {
  try {
    const q = req.query.q || "";
    const projects = repo.search(repo.getActive(), q);
    res.status(200).json(projects);
  } catch (err) {
    console.error("Failed to read project list:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/projects/:id", (req, res) => {
  try {
    const project = repo.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    return res.status(200).json(project);
  } catch (err) {
    console.error("Failed to read project details:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
