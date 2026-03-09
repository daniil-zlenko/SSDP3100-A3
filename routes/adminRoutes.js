const express = require("express");
const router = express.Router();
const Category = require("../models/Category");
const Project = require("../models/Project");
const Contact = require("../models/Contact");

// ── Dashboard ────────────────────────────────────────────────────────────────

router.get("/", (req, res) => {
  res.render("admin/dashboard", { title: "Admin Dashboard" });
});

// ── Contacts ─────────────────────────────────────────────────────────────────

router.get("/contacts", async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ postedDate: -1 }).lean();
    res.render("admin/contacts", { title: "Admin – Contacts", contacts });
  } catch (err) {
    console.error(err);
    res.status(500).render("404", { title: "Error" });
  }
});

// PATCH /admin/contacts/:id/read  — toggle isRead, return JSON
router.patch("/contacts/:id/read", async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ error: "Not found" });
    contact.isRead = !contact.isRead;
    await contact.save();
    res.json({ isRead: contact.isRead });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /admin/contacts/:id  — return JSON
router.delete("/contacts/:id", async (req, res) => {
  try {
    const result = await Contact.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ error: "Not found" });
    res.json({ deleted: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ── Categories ───────────────────────────────────────────────────────────────

router.get("/categories", async (req, res) => {
  try {
    const categories = await Category.find().lean();
    // Count projects per category
    const counts = await Project.aggregate([
      { $group: { _id: "$categoryId", count: { $sum: 1 } } }
    ]);
    const countMap = {};
    counts.forEach(({ _id, count }) => {
      countMap[_id.toString()] = count;
    });
    const categoriesWithCount = categories.map(cat => ({
      ...cat,
      projectCount: countMap[cat._id.toString()] || 0
    }));
    res.render("admin/categories", { title: "Admin – Categories", categories: categoriesWithCount });
  } catch (err) {
    console.error(err);
    res.status(500).render("404", { title: "Error" });
  }
});

router.get("/categories/new", (req, res) => {
  res.render("admin/category-form", {
    title: "New Category",
    category: null,
    error: null
  });
});

router.post("/categories", async (req, res) => {
  const { name, slug, description } = req.body;
  try {
    await Category.create({ name, slug, description });
    res.redirect("/admin/categories");
  } catch (err) {
    console.error(err);
    const error = err.code === 11000
      ? "A category with that slug already exists."
      : "Failed to create category.";
    res.render("admin/category-form", {
      title: "New Category",
      category: { name, slug, description },
      error
    });
  }
});

router.get("/categories/:id/edit", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).lean();
    if (!category) return res.status(404).render("404", { title: "Not Found" });
    res.render("admin/category-form", { title: "Edit Category", category, error: null });
  } catch (err) {
    console.error(err);
    res.status(500).render("404", { title: "Error" });
  }
});

router.post("/categories/:id", async (req, res) => {
  const { name, slug, description } = req.body;
  try {
    await Category.findByIdAndUpdate(req.params.id, { name, slug, description });
    res.redirect("/admin/categories");
  } catch (err) {
    console.error(err);
    const error = err.code === 11000
      ? "A category with that slug already exists."
      : "Failed to update category.";
    res.render("admin/category-form", {
      title: "Edit Category",
      category: { _id: req.params.id, name, slug, description },
      error
    });
  }
});

// DELETE /admin/categories/:id  — refuse if referenced by projects
router.delete("/categories/:id", async (req, res) => {
  try {
    const count = await Project.countDocuments({ categoryId: req.params.id });
    if (count > 0) {
      return res.status(400).json({
        error: `Cannot delete: ${count} project(s) still use this category.`
      });
    }
    const result = await Category.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ error: "Not found" });
    res.json({ deleted: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ── Projects ─────────────────────────────────────────────────────────────────

router.get("/projects", async (req, res) => {
  try {
    const projects = await Project.find().populate("categoryId").lean();
    res.render("admin/projects", { title: "Admin – Projects", projects });
  } catch (err) {
    console.error(err);
    res.status(500).render("404", { title: "Error" });
  }
});

router.get("/projects/new", async (req, res) => {
  try {
    const categories = await Category.find().lean();
    res.render("admin/project-form", {
      title: "New Project",
      project: null,
      categories,
      error: null
    });
  } catch (err) {
    console.error(err);
    res.status(500).render("404", { title: "Error" });
  }
});

router.post("/projects", async (req, res) => {
  const { slug, title, description, isActive, tags, categoryId } = req.body;
  const tagArray = (tags || "")
    .split(",")
    .map(t => t.trim())
    .filter(Boolean)
    .map(name => ({ name }));

  try {
    await Project.create({
      slug,
      title,
      description,
      isActive: isActive === "true",
      tags: tagArray,
      categoryId
    });
    res.redirect("/admin/projects");
  } catch (err) {
    console.error(err);
    const categories = await Category.find().lean();
    const error = err.code === 11000
      ? "A project with that slug already exists."
      : "Failed to create project.";
    res.render("admin/project-form", {
      title: "New Project",
      project: { slug, title, description, isActive, tags, categoryId },
      categories,
      error
    });
  }
});

router.get("/projects/:id/edit", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).lean();
    if (!project) return res.status(404).render("404", { title: "Not Found" });
    const categories = await Category.find().lean();
    // Convert tags array to comma-separated string for the form
    project.tagsString = (project.tags || []).map(t => t.name).join(", ");
    res.render("admin/project-form", { title: "Edit Project", project, categories, error: null });
  } catch (err) {
    console.error(err);
    res.status(500).render("404", { title: "Error" });
  }
});

router.post("/projects/:id", async (req, res) => {
  const { slug, title, description, isActive, tags, categoryId } = req.body;
  const tagArray = (tags || "")
    .split(",")
    .map(t => t.trim())
    .filter(Boolean)
    .map(name => ({ name }));

  try {
    await Project.findByIdAndUpdate(req.params.id, {
      slug,
      title,
      description,
      isActive: isActive === "true",
      tags: tagArray,
      categoryId
    });
    res.redirect("/admin/projects");
  } catch (err) {
    console.error(err);
    const categories = await Category.find().lean();
    const error = err.code === 11000
      ? "A project with that slug already exists."
      : "Failed to update project.";
    res.render("admin/project-form", {
      title: "Edit Project",
      project: { _id: req.params.id, slug, title, description, isActive, tags, categoryId },
      categories,
      error
    });
  }
});

// DELETE /admin/projects/:id  — return JSON
router.delete("/projects/:id", async (req, res) => {
  try {
    const result = await Project.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ error: "Not found" });
    res.json({ deleted: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
