import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const exists = await User.findOne({
            email: process.env.ADMIN_EMAIL,
        });

        if (exists) {
            console.log("Admin already exists");
            process.exit(0);
        }

        await User.create({
            name: "Admin",
            email: process.env.ADMIN_EMAIL,
            password: process.env.ADMIN_PASSWORD, // ✅ PLAIN password
            isAdmin: true,
        });

        console.log("Admin created successfully");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

run();
