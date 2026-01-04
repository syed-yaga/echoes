import { PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
const prisma = new PrismaClient();
export async function signup(req, res, next) {
    const { username, email, password } = req.body;
    if (!username ||
        !email ||
        !password ||
        username === "" ||
        email === "" ||
        password === "") {
        return next(errorHandler(400, "All fields are required", 1001));
    }
    const hashedPassword = bcryptjs.hashSync(password, 10);
    try {
        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
            },
        });
        return res.status(200).json({ message: "signup successful" });
    }
    catch (error) {
        next(error);
    }
}
export async function signin(req, res, next) {
    const { email, password } = req.body;
    if (!email || !password || email === "" || password === "") {
        next(errorHandler(400, "All fields are required", 1001));
    }
    try {
        const validUser = await prisma.user.findUnique({
            where: { email: email },
        });
        if (!validUser) {
            return next(errorHandler(404, "User not found", 3001));
        }
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) {
            return next(errorHandler(400, "Invalid password", 1001));
        }
        const token = jwt.sign({ id: validUser.id, isAdmin: validUser.isAdmin }, process.env.JWT_SECRET);
        const { password: pass, ...rest } = validUser;
        res
            .status(200)
            .cookie("access_token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            path: "/",
        })
            .json(rest);
    }
    catch (error) {
        next(error);
    }
}
export async function google(req, res, next) {
    const { email, name, googlePhotoUrl } = req.body;
    try {
        const user = await prisma.user.findUnique({
            where: { email: email },
        });
        if (user) {
            const token = jwt.sign({ id: user.id, isAdmin: user.isAdmin }, process.env.JWT_SECRET);
            const { password, ...rest } = user;
            res
                .status(200)
                .cookie("access_token", token, {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                path: "/",
            })
                .json(rest);
        }
        else {
            const generatedPassword = Math.random().toString(36).slice(-8) +
                Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
            const newUser = await prisma.user.create({
                data: {
                    username: name.toLowerCase().split(" ").join("") +
                        Math.random().toString(9).slice(-4),
                    email,
                    password: hashedPassword,
                    profilePicture: googlePhotoUrl,
                },
            });
            const token = jwt.sign({ id: newUser.id, isAdmin: newUser.isAdmin }, process.env.JWT_SECRET);
            const { password, ...rest } = newUser;
            res
                .status(200)
                .cookie("access_token", token, {
                httpOnly: true,
                secure: false,
                sameSite: "none",
                path: "/",
            })
                .json(rest);
        }
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=auth.controller.js.map