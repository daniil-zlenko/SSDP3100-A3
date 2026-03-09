const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  isActive: { type: Boolean, required: true },
  tags: [{ name: { type: String } }],
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true }
});

module.exports = mongoose.model("Project", projectSchema);
