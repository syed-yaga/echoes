import { Prisma, PrismaClient } from "@prisma/client";
import { errorHandler } from "../utils/error.js";

const prisma = new PrismaClient();

export async function create(req: any, res: any, next: any) {
  if (!req.user.isAdmin) {
    return next(
      errorHandler(403, "You are not allowed to create a post", 2001)
    );
  }

  if (!req.body.title || !req.body.content) {
    return next(errorHandler(400, "Please provide all required fields", 1001));
  }

  const slug = req.body.title
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, "-");

  const newPost = await prisma.post.create({
    data: {
      ...req.body,
      slug,
      userId: req.user.id,
    },
  });

  try {
    res.status(200).json(newPost);
  } catch (error) {
    next(error);
  }
}

export async function getposts(req: any, res: any, next: any) {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === "asc" ? "asc" : "desc";

    const where: any = {
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { id: req.query.postId }),
      ...(req.query.searchTerm && {
        OR: [
          {
            title: {
              contains: req.query.searchTerm,
              mode: "insensitive",
            },
          },
          {
            content: {
              contains: req.query.searchTerm,
              mode: "insensitive",
            },
          },
        ],
      }),
    };

    const posts = await prisma.post.findMany({
      where,
      orderBy: {
        updatedAt: sortDirection,
      },
      skip: startIndex,
      take: limit,
    });

    const totalPosts = await prisma.post.count();

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthPosts = await prisma.post.count({
      where: {
        createdAt: {
          gte: oneMonthAgo,
        },
      },
    });

    res.status(200).json({
      posts,
      totalPosts,
      lastMonthPosts,
    });
  } catch (error) {
    next(error);
  }
}

export async function deletepost(req: any, res: any, next: any) {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(
      errorHandler(403, "You are not allowed to delete this post", 2003)
    );
  }

  try {
    const post = await prisma.post.delete({
      where: { id: req.params.postId },
    });

    res.status(200).json(post);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return res.status(404).json("Post not found");
      }
    }
    next(error);
  }
}

export async function updatepost(req: any, res: any, next: any) {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(
      errorHandler(403, "You are not allowed to update this post", 2003)
    );
  }
  try {
    const updatedPost = await prisma.post.update({
      where: {
        id: req.params.postId,
      },
      data: {
        title: req.body.title,
        content: req.body.content,
        category: req.body.category,
        image: req.body.image,
      },
    });

    res.status(200).json(updatedPost);
  } catch (error) {
    next(error);
  }
}
