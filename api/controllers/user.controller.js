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
    if (!req.user.isAdmin && req.user.id !== req.params.userId) {
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
export async function getUsers(req, res, next) {
    if (!req.user.isAdmin) {
        return next(errorHandler(403, "You are not allowed to see all the users", 2003));
    }
    try {
        const startIndex = Number(req.query.startIndex) || 0;
        const limit = Number(req.query.limit) || 9;
        const sortDirection = req.query.sort === "asc" ? "asc" : "desc";
        const users = await prisma.user.findMany({
            orderBy: {
                createdAt: sortDirection,
            },
            skip: startIndex,
            take: limit,
        });
        const userWithoutPassword = users.map((user) => {
            const { password, ...rest } = user;
            return rest;
        });
        const totalUsers = await prisma.user.count();
        const now = new Date();
        const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        const lastMonthUser = await prisma.user.count({
            where: {
                createdAt: {
                    gte: oneMonthAgo,
                },
            },
        });
        res.status(200).json({
            users: userWithoutPassword,
            totalUsers,
            lastMonthUser,
        });
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=user.controller.js.map