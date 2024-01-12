const { default: mongoose } = require("mongoose");

const transitionSchema = new mongoose.Schema({
  transition_id: {
    type: String,
    required: true,
  },
  to_user:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'User'
  },
  from_user:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'User'
  },
  tr_type: {
    type: String,
    enum: ["deposit", "widthdraw", "transfer"],
    required: true,
  },
  tr_status: {
    type: String,
    enum: ["pending", "failed", "completed"],
    required: true,
  },
  tr_date: {
    type:String,
    required: true,
  },
  tr_amount: {
    type: Number,
    required: true,
  },
});

const Transition = mongoose.model("TransitionAmount", transitionSchema);

module.exports = Transition;
