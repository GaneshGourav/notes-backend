const mongoose = require("mongoose");

const blackSchema = mongoose.Schema(
  {
    token: { type: String, required: true },
  },
  {
    versionKey: false,
  }
);

const BlackModel = mongoose.model("blacklist", blackSchema);

module.exports = { BlackModel };
