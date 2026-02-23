const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "../../../data/projects.json");

function loadAll() {
  const raw = fs.readFileSync(dataPath, "utf-8");
  return JSON.parse(raw).projects || [];
}

function getActive() {
  return loadAll().filter((p) => p.status === true);
}

function search(projects, q) {
  const term = (q || "").toString().trim().toLowerCase();
  if (!term) return projects;
  return projects.filter((p) => {
    const searchable = [
      p.title,
      p.tagline,
      p.description,
      ...(p.stack || []),
      ...(p.tags || []),
    ]
      .join(" ")
      .toLowerCase();
    return searchable.includes(term);
  });
}

function findById(id) {
  return loadAll().find((p) => p.id === id) || null;
}

function findBySlug(slug) {
  return loadAll().find((p) => p.slug === slug) || null;
}

module.exports = { loadAll, getActive, search, findById, findBySlug };
