const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const dataPath = path.join(__dirname, "..", "data", "projects.json");

function getProjects() {
  const raw = fs.readFileSync(dataPath, "utf-8");
  const parsed = JSON.parse(raw);
  return parsed.projects || [];
}

router.get("/projects", (req, res) => {
  try {
    const q = (req.query.q || "").toString().trim().toLowerCase();
    let projects = getProjects().filter((project) => project.active === true);

    if (q) {
      projects = projects.filter((project) => {
        const searchableFields = [
          project.title,
          project.tagline,
          project.description,
          ...(project.stack || []),
          ...(project.tags || [])
        ]
          .join(" ")
          .toLowerCase();

        return searchableFields.includes(q);
      });
    }

    res.status(200).json(projects);
  } catch (error) {
    console.error("Failed to read project list:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/projects/:id", (req, res) => {
  try {
    const projects = getProjects();
    const project = projects.find((item) => item.id === req.params.id);

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    return res.status(200).json(project);
  } catch (error) {
    console.error("Failed to read project details:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
