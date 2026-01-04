import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export function test(req, res) {
    res.json({ message: "Good to go" });
}
export async function updateUser(req, res, next) {
    if (req.user.id !== req.params.userId) {
        return next(errorHandler(403, "You are not allowed to update this user", 2001));
    }
    const updates = {};
    if (req.body.password) {
        if (req.body.password.length < 6) {
            return next(errorHandler(400, "Password must be at least 6 characters", 1001));
        }
        req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }
    if (req.body.username !== undefined && req.body.username !== "") {
        const username = req.body.username;
        if (username.length < 7 || username.length > 20) {
            return next(errorHandler(400, "Username must be between 7 and 20 characters", 1001));
        }
        if (username.includes(" ")) {
            return next(errorHandler(400, "Username cannot contain spaces", 1001));
        }
        if (username !== username.toLowerCase()) {
            return next(errorHandler(400, "Username must be lowercase", 1001));
        }
        if (!username.match(/^[a-zA-Z0-9]+$/)) {
            return next(errorHandler(400, "Username can only contain letters and numbers", 1001));
        }
        updates.username = username;
    }
    if (req.body.email !== undefined && req.body.email !== "") {
        updates.email = req.body.email;
    }
    if (req.body.profilePicture) {
        updates.profilePicture = req.body.profilePicture;
    }
    if (Object.keys(updates).length === 0) {
        return next(errorHandler(400, "No changes provided", 1001));
    }
    try {
        const updated = await prisma.user.update({
            where: { id: req.params.userId },
            data: updates,
        });
        const { password, ...rest } = updated;
        res.status(200).json(rest);
    }
    catch (error) {
        next(error);
    }
}
export async function deleteUser(req, res, next) {
    console.log("JWT user id:", req.user.id);
    console.log("Param user id:", req.params.userId);
    if (req.user.id !== req.params.userId) {
        return next(errorHandler(403, "You are not allowed to delete this user", 1003));
    }
    try {
        await prisma.user.delete({
            where: {
                id: req.params.userId,
            },
        });
        res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
    }
    catch (error) {
        next(error);
    }
}
export function signout(req, res, next) {
    try {
        res
            .clearCookie("access_token")
            .status(200)
            .json("User has been signed out");
    }
    catch (error) { }
}
//# sourceMappingURL=user.controller.js.map