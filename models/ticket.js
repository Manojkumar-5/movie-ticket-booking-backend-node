const mongoose = require("mongoose");

const TicketSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
    },
    isbooked:{
        type:Boolean,
        required:true
    },
    email: {
      type: String,
      trim: true,
      required: true,
    },
    bookingid: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ticket", TicketSchema);
