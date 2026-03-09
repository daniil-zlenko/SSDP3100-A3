const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const Contact = require("../models/Contact");
const { getActiveProjects, getActiveProjectsByCategorySlug } = require("../services/projectService");

// GET /
router.get("/", (req, res) => {
  res.render("index", { title: "Portfolio Launchpad" });
});

// GET /about
router.get("/about", (req, res) => {
  res.render("about", { title: "About" });
});

// GET /projects  (with optional ?q= and ?tag=)
router.get("/projects", async (req, res) => {
  try {
    const q = (req.query.q || "").trim();
    const tag = (req.query.tag || "").trim();
    const projects = await getActiveProjects(q || undefined, tag || undefined);
    res.render("projects", { title: "Projects", projects, q, tag });
  } catch (err) {
    console.error(err);
    res.status(500).render("404", { title: "Error" });
  }
});

// GET /projects/category/:slug
router.get("/projects/category/:slug", async (req, res) => {
  try {
    const result = await getActiveProjectsByCategorySlug(req.params.slug);
    if (!result) return res.status(404).render("404", { title: "Category Not Found" });
    res.render("projects", {
      title: `Projects – ${result.category.name}`,
      projects: result.projects,
      q: "",
      tag: "",
      category: result.category
    });
  } catch (err) {
    console.error(err);
    res.status(500).render("404", { title: "Error" });
  }
});

// GET /projects/:slug
router.get("/projects/:slug", async (req, res) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug, isActive: true })
      .populate("categoryId")
      .lean();
    if (!project) return res.status(404).render("404", { title: "Project Not Found" });

    const otherProjects = await Project.find({
      isActive: true,
      _id: { $ne: project._id }
    }).lean();

    res.render("project-details", {
      title: project.title,
      project,
      otherProjects,
      layout: "layouts/layout-sidebar"
    });
  } catch (err) {
    console.error(err);
    res.status(500).render("404", { title: "Error" });
  }
});

// GET /contact
router.get("/contact", (req, res) => {
  res.render("contact", { title: "Contact", success: null, error: null, fields: {} });
});

// POST /contact
router.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.render("contact", {
      title: "Contact",
      success: null,
      error: "All fields are required.",
      fields: { name, email, message }
    });
  }

  try {
    await Contact.create({ name, email, message, postedDate: new Date(), isRead: false });
    res.render("contact", {
      title: "Contact",
      success: "Message sent! We'll be in touch.",
      error: null,
      fields: {}
    });
  } catch (err) {
    console.error(err);
    res.render("contact", {
      title: "Contact",
      success: null,
      error: "Failed to send message. Please try again.",
      fields: { name, email, message }
    });
  }
});

module.exports = router;
