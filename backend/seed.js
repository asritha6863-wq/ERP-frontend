import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

const seed = async () => {
    try {
        // Only add admin — don't delete existing users
        const existing = await User.findOne({ email: "admin@company.com" });
        if (existing) {
            console.log("Admin already exists!");
            process.exit(0);
        }

        await User.create({
            name: "Admin",
            email: "admin@company.com",
            password: await bcrypt.hash("admin123", 10),
            role: "admin"
        });

        console.log("✅ Admin created!");
        process.exit(0);

    } catch (err) {
        console.error("❌ Failed:", err);
        process.exit(1);
    }
};

seed();