const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema(
  {
    destination: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    image: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", BlogSchema);
