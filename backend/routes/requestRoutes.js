import express from "express";
import jwt from "jsonwebtoken";
import Request from "../models/Request.js";

const router = express.Router();

// Auth middleware
const auth = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token" });
    try {
        req.user = jwt.verify(token, "secretkey");
        next();
    } catch {
        res.status(401).json({ message: "Invalid token" });
    }
};

// ✅ Create request (Employee)
router.post("/create", auth, async (req, res) => {
    try {
        const request = await Request.create({
            ...req.body,
            employeeId: req.user.id,
            employeeName: req.body.employeeName,
            status: "Pending"
        });
        res.json(request);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Get my requests (Employee)
router.get("/my", auth, async (req, res) => {
    try {
        const requests = await Request.find({ employeeId: req.user.id }).sort({ createdAt: -1 });
        res.json(requests);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Get all requests (Department)
router.get("/all", auth, async (req, res) => {
    try {
        const requests = await Request.find()
            .sort({ createdAt: -1 })
            .populate("employeeId", "name email");
        res.json(requests);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Get approved requests (Accounts)
router.get("/accounts", auth, async (req, res) => {
    try {
        const requests = await Request.find({ status: "Sent to Accounts" })
            .sort({ createdAt: -1 })
            .populate("employeeId", "name email");
        res.json(requests);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Approve or Reject (Department)
router.put("/update/:id", auth, async (req, res) => {
    try {
        const { status, rejectionReason, approvedBy } = req.body;

        const updated = await Request.findByIdAndUpdate(
            req.params.id,
            {
                status: status === "Approved" ? "Sent to Accounts" : "Rejected",
                rejectionReason: rejectionReason || "",
                approvedBy: approvedBy || ""
            },
            { new: true }
        ).populate("employeeId", "name email");

        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Accounts update status
router.put("/accounts/update/:id", auth, async (req, res) => {
    try {
        const updated = await Request.findByIdAndUpdate(
            req.params.id,
            { accountsStatus: req.body.accountsStatus },
            { new: true }
        );
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;