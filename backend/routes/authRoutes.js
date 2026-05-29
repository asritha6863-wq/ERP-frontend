import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();


// ================= REGISTER =================

router.post("/register", async (req, res) => {

    try {

        const { name, email, password, role } = req.body;

        // CHECK USER

        const existing = await User.findOne({ email });

        if (existing) {
            return res.status(400).json({
                message: "Email already exists"
            });
        }

        // HASH PASSWORD

        const hashedPassword = await bcrypt.hash(password, 10);

        // CREATE USER

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role
        });

        res.json({
            message: "User created successfully",
            user
        });

    } catch (err) {

        res.status(500).json({
            error: err.message
        });
    }
});


// ================= LOGIN =================

router.post("/login", async (req, res) => {

    try {

        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "User not found"
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid password"
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            "secretkey",
            {
                expiresIn: "1d"
            }
        );

        res.json({
            message: "Login successful",
            token,
            role: user.role,
            name: user.name
        });

    } catch (err) {

        res.status(500).json({
            error: err.message
        });
    }
});


// ================= GET USERS =================

router.get("/users", async (req, res) => {

    try {

        const users = await User.find().sort({
            createdAt: -1
        });

        res.json(users);

    } catch (err) {

        res.status(500).json({
            error: err.message
        });
    }
});


// ================= DELETE USER =================

router.delete("/users/:id", async (req, res) => {

    try {

        await User.findByIdAndDelete(req.params.id);

        res.json({
            message: "User deleted successfully"
        });

    } catch (err) {

        res.status(500).json({
            error: err.message
        });
    }
});

export default router;