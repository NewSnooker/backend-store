const mongoose = require("mongoose");
const HeroSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      text: true,
    },
    description: {
      type: String,
      text: true,
    },
    button: {
      type: String,
      text: true,
    },
    images: {
      type: Array,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Hero = mongoose.model("hero", HeroSchema);
