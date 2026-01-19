import { error } from "console";
import { errorHandler } from "../utils/error.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function createComment(req: any, res: any, next: any) {
  try {
    const { content, postId, userId } = req.body;
    if (userId !== req.user.id) {
      return next(
        errorHandler(4003, "You are not allowed to create this comment", 1003)
      );
    }

    const newComment = await prisma.comment.create({
      data: {
        content,
        postId,
        userId,
      },
    });

    res.status(200).json(newComment);
  } catch (error) {
    next(error);
  }
}

export async function getPostComments(req: any, res: any, next: any) {
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
  } catch (error) {
    next(error);
  }
}
