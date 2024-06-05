const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  correctOption: {
    type: String,
    required: true,
  },
  options: {
    type: Object,
    required: true,
  }
}, {
    timestamps: true,
});

const Question = mongoose.model("questions", questionSchema);
module.exports = Question;
