import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    department: String,
    status: {
      type: String,
      default: "Pending"
    },

    forwardTo: {        // ✅ ADD THIS
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

export default mongoose.model("Complaint", complaintSchema);