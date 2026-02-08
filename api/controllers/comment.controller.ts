import { error } from "console";
import { errorHandler } from "../utils/error.js";
import { PrismaClient } from "@prisma/client";
import { NextFunction } from "express";

const prisma = new PrismaClient();

export async function createComment(req: any, res: any, next: any) {
  try {
    const { content, postId, userId } = req.body;
    if (userId !== req.user.id) {
      return next(
        errorHandler(4003, "You are not allowed to create this comment", 1003),
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

export async function likeComment(req: any, res: any, next: any) {
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
    } else {
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
  } catch (error) {
    next(error);
  }
}

export async function editComment(req: any, res: any, next: any) {
  try {
    const comment = await prisma.comment.findUnique({
      where: {
        id: req.params.commentId,
      },
    });
    if (!comment) {
      return next(errorHandler(404, "Comment not found", 1004));
    }

    if (comment.userId !== req.user.id && !req.user.isAdmin) {
      return next(
        errorHandler(403, "You are not allowed to edit this comment", 1003),
      );
    }

    const editedComment = await prisma.comment.update({
      where: {
        id: req.params.commentId,
      },
      data: {
        content: req.body.content,
      },
    });

    res.status(200).json(editedComment);
  } catch (error) {
    next(error);
  }
}

export async function deleteComment(req: any, res: any, next: any) {
  try {
    const comment = await prisma.comment.findUnique({
      where: {
        id: req.params.commentId,
      },
    });
    if (!comment) {
      return next(errorHandler(404, "Comment not found", 1004));
    }
    if (comment.userId !== req.user.id && !req.user.isAdmin) {
      return next(
        errorHandler(403, "You are not allowed to delete the comment", 1003),
      );
    }

    await prisma.comment.delete({
      where: {
        id: req.params.commentId,
      },
    });

    res.status(200).json("Comment has been deleted");
  } catch (error) {
    next(error);
  }
}

export async function getComments(req: any, res: any, next: any) {
  if (!req.user.isAdmin) {
    return next(
      errorHandler(403, "You are not allowed to get all comments", 1003),
    );
  }

  try {
    const startIndex = Number(req.query.startIndex) || 0;
    const limit = Number(req.query.limit) || 9;
    const sortDirection = req.query.sort === "desc" ? "desc" : "asc";

    const comments = await prisma.comment.findMany({
      orderBy: {
        createdAt: sortDirection,
      },
      skip: startIndex,
      take: limit,
    });

    const totalComments = await prisma.comment.count();

    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate(),
    );

    const lastMonthComments = await prisma.comment.count({
      where: {
        createdAt: {
          gte: oneMonthAgo,
        },
      },
    });

    res.status(200).json({
      comments,
      totalComments,
      lastMonthComments,
    });
  } catch (error) {
    next(error);
  }
}
