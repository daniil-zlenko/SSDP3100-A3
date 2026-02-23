const express = require("express");
const repo = require("../lib/projects.repository");

const router = express.Router();

router.get("/", (req, res) => {
  res.render("index", { title: "Portfolio Launchpad" });
});

router.get("/about", (req, res) => {
  res.render("about", { title: "About | Portfolio Launchpad" });
});

router.get("/projects", (req, res) => {
  const q = req.query.q || "";
  const projects = repo.search(repo.getActive(), q);
  res.render("projects", { title: "Projects | Portfolio Launchpad", projects, q });
});

router.get("/projects/:slug", (req, res) => {
  const project = repo.findBySlug(req.params.slug);
  if (!project) {
    return res.status(404).render("404", { title: "Project Not Found" });
  }
  const otherProjects = repo.getActive().filter((p) => p.slug !== req.params.slug);
  res.render("project-details", {
    title: `${project.title} | Portfolio Launchpad`,
    layout: "layouts/layout-sidebar",
    project,
    otherProjects,
  });
});

router.get("/contact", (req, res) => {
  res.render("contact", { title: "Contact | Portfolio Launchpad" });
});

router.post("/contact", (req, res) => {
  const { name, email, message } = req.body;
  console.log("Contact submission:", {
    name,
    email,
    message,
    receivedAt: new Date().toISOString(),
  });
  res.render("contact-success", {
    title: "Message Sent | Portfolio Launchpad",
    name: name || "there",
  });
});

module.exports = router;
