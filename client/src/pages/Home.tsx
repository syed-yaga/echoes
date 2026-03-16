import { Link } from "react-router-dom";
import CalltoAction from "../components/CalltoAction";
import { useEffect, useState } from "react";
import PostCard from "../components/PostCard";

type Post = {
  id: string;
  title: string;
  content: string;
  userId: string;
  image?: string;
  category: string;
  slug: string;
  createdAt: string;
  updatedAt?: string;
};

export function Home() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    async function fetchPosts() {
      const res = await fetch(
        "https://echoes-wwgg.onrender.com/api/post/getPosts",
        {
          method: "GET",
          credentials: "include",
        },
      );

      const data = await res.json();
      setPosts(data.posts);
    }

    fetchPosts();
  }, []);

  return (
    <div>
      <div className="flex flex-col gap-6 lg:p-28 p-3 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold lg:text-6xl">Welcome to Echoes</h1>
        <p className="text-gray-500 text-xs sm:text-sm">
          Here you'll find a variety of articles and tutorial on topics such as
          web development, software engineering and programming languages
        </p>
        <Link
          to={"/search"}
          className="text-xs sm:text-sm text-teal-500 font-bold hover:underline"
        >
          View all posts
        </Link>
      </div>
      <div className="p-3 bg-amber-100 dark:bg-slate-700">
        <CalltoAction />
      </div>
      <div className="max-w-6px mx-auto p-3 flex flex-col gap-8 py-7">
        {posts && posts.length > 0 && (
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-semibold text-center">Recent Posts</h2>
            <div className="flex flex-wrap gap-4">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
            <Link
              to={"/search"}
              className="text-lg text-teal-500 hover:underline text-center"
            >
              View all posts
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
