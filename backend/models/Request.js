import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    employeeName: { type: String },
    itemName: { type: String, required: true },
    quantity: { type: Number, required: true },
    reason: { type: String, required: true },
    priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
    department: { type: String },
    status: {
        type: String,
        enum: ["Pending", "Approved", "Rejected", "Sent to Accounts"],
        default: "Pending"
    },
    rejectionReason: { type: String, default: "" },
    approvedBy: { type: String, default: "" },
    accountsStatus: {
        type: String,
        enum: ["Pending", "Processing", "Completed"],
        default: "Pending"
    }
}, { timestamps: true });

export default mongoose.model("Request", requestSchema);