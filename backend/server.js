import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import requestRoutes from "./routes/requestRoutes.js";

dotenv.config();

const app = express();

// ================= MIDDLEWARE =================

app.use(cors());

app.use(express.json());


// ================= HOME ROUTE =================

app.get("/", (req, res) => {
    res.send("ERP Backend Running Successfully 🚀");
});


// ================= ROUTES =================

// AUTH ROUTES
app.use("/api/auth", authRoutes);

// REQUEST ROUTES
app.use("/api/requests", requestRoutes);


// ================= DATABASE =================

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected");
    })
    .catch((err) => {
        console.log(err);
    });


// ================= SERVER =================

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});