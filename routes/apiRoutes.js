const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const Category = require("../models/Category");
const { getActiveProjects, getActiveProjectsByCategorySlug } = require("../services/projectService");

// GET /api/projects  (active only, optional ?q= and ?tag=)
router.get("/projects", async (req, res) => {
  try {
    const q = (req.query.q || "").trim();
    const tag = (req.query.tag || "").trim();
    const projects = await getActiveProjects(q || undefined, tag || undefined);
    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/projects/category/:slug  — must come before /:id
router.get("/projects/category/:slug", async (req, res) => {
  try {
    const result = await getActiveProjectsByCategorySlug(req.params.slug);
    if (!result) return res.status(404).json({ error: "Category not found" });
    res.json(result.projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/projects/:id
router.get("/projects/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate("categoryId").lean();
    if (!project) return res.status(404).json({ error: "Project not found" });
    res.json(project);
  } catch (err) {
    if (err.name === "CastError") return res.status(404).json({ error: "Project not found" });
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/categories
router.get("/categories", async (req, res) => {
  try {
    const categories = await Category.find().lean();
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
