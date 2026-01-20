import { errorHandler } from "../utils/error.js";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export async function createComment(req, res, next) {
    try {
        const { content, postId, userId } = req.body;
        if (userId !== req.user.id) {
            return next(errorHandler(4003, "You are not allowed to create this comment", 1003));
        }
        const newComment = await prisma.comment.create({
            data: {
                content,
                postId,
                userId,
            },
        });
        res.status(200).json(newComment);
    }
    catch (error) {
        next(error);
    }
}
export async function getPostComments(req, res, next) {
    try {
        const comments = await prisma.comment.findMany({
            where: {
                postId: req.params.postId,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        res.status(200).json(comments);
    }
    catch (error) {
        next(error);
    }
}
export async function likeComment(req, res, next) {
    try {
        const comment = await prisma.comment.findUnique({
            where: {
                id: req.params.commentId,
            },
        });
        if (!comment) {
            return next(errorHandler(404, "Comment not found", 1004));
        }
        const userIndex = comment.likes.indexOf(req.user.id);
        let updatedComment;
        if (userIndex === -1) {
            updatedComment = await prisma.comment.update({
                where: { id: comment.id },
                data: {
                    numberOfLikes: { increment: 1 },
                    likes: { push: req.user.id },
                },
            });
        }
        else {
            updatedComment = await prisma.comment.update({
                where: { id: comment.id },
                data: {
                    numberOfLikes: { decrement: 1 },
                    likes: {
                        set: comment.likes.filter((id) => id !== req.user.id),
                    },
                },
            });
        }
        res.status(200).json(updatedComment);
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=comment.controller.js.map