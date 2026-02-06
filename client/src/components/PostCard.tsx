import React from "react";
import { Link } from "react-router-dom";

type Post = {
  id: string;
  title: string;
  content: string;
  image: string;
  category: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
};

type PostCardProps = {
  post: Post;
};

export default function PostCard({ post }: PostCardProps) {
  return (
    <div>
      <Link to={`/post/${post.slug}`}>
        <img src={post.image} alt="" />
      </Link>
    </div>
  );
}
