const Project = require("../models/Project");

/**
 * Build a Mongoose filter query from optional q (search) and tag params.
 * Used by both HTML and API routes to avoid duplicating logic.
 */
function buildFilter(q, tag, extraFilter = {}) {
  const filter = { ...extraFilter };

  if (q) {
    const regex = new RegExp(q, "i");
    filter.$or = [
      { title: regex },
      { description: regex },
      { "tags.name": regex }
    ];
  }

  if (tag) {
    filter["tags.name"] = new RegExp(`^${tag}$`, "i");
  }

  return filter;
}

/**
 * Get active projects with optional search/tag filters.
 */
async function getActiveProjects(q, tag) {
  const filter = buildFilter(q, tag, { isActive: true });
  return Project.find(filter).populate("categoryId").lean();
}

/**
 * Get active projects for a category slug.
 */
async function getActiveProjectsByCategorySlug(slug, q, tag) {
  const Category = require("../models/Category");
  const category = await Category.findOne({ slug }).lean();
  if (!category) return null;

  const filter = buildFilter(q, tag, { isActive: true, categoryId: category._id });
  const projects = await Project.find(filter).populate("categoryId").lean();
  return { category, projects };
}

module.exports = { buildFilter, getActiveProjects, getActiveProjectsByCategorySlug };
