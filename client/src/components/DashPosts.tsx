import React, { useEffect, useState } from "react";
import { RootState } from "../redux/store";
import { useSelector } from "react-redux";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import { Link } from "react-router-dom";

type Post = {
  id: string;
  userId: string;
  content: string;
  title: string;
  image: string;
  category: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
};

export default function DashPosts() {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [showMore, setShowMore] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch(
          `http://localhost:3000/api/post/getposts?userId=${currentUser?.id}`
        );
        const data = await res.json();
        if (res.ok) {
          setUserPosts(data.posts);
          if (data.posts.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error: any) {
        console.log(error.message);
      }
    }
    if (currentUser?.isAdmin) {
      fetchPosts();
    }
  }, [currentUser?.id]);

  async function handleShowMore() {
    const startIndex = userPosts.length;
    try {
      const res = await fetch(
        `http://localhost:3000/api/post/getposts?userId=${currentUser?.id}&startIndex=${startIndex}`
      );
      const data = await res.json();
      if (res.ok) {
        setUserPosts((prev) => [...prev, ...data.posts]);
        if (data.posts.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {}
  }

  return (
    <div className="table-auto overflow-x-scroll md:mx:auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500 ">
      {currentUser?.isAdmin && userPosts.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <TableHead>
              <TableRow>
                <TableHeadCell>Date updated</TableHeadCell>
                <TableHeadCell>Post image</TableHeadCell>
                <TableHeadCell>Post title</TableHeadCell>
                <TableHeadCell>Category</TableHeadCell>
                <TableHeadCell>Delete</TableHeadCell>
                <TableHeadCell>
                  <span>Edit</span>
                </TableHeadCell>
              </TableRow>
            </TableHead>
            {userPosts.map((post) => (
              <TableBody className="divede-y" key={post.id}>
                <TableRow
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  key={post.id}
                >
                  <TableCell>
                    {new Date(post.updatedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Link to={`/post/${post.slug}`}>
                      {post.image && (
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-20 h-10 object-cover bg-gray-500"
                        />
                      )}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link
                      className="font-medium text-gray-900 dar:text-white"
                      to={`/post/${post.slug}`}
                    >
                      {post.title}
                    </Link>
                  </TableCell>
                  <TableCell>{post.category}</TableCell>
                  <TableCell>
                    <span className="font-medium text-red-500 hover:underline cursor-pointer">
                      Delete
                    </span>
                  </TableCell>
                  <TableCell>
                    <Link
                      className="text-teal-500"
                      to={`/update-post/${post.id}`}
                    >
                      <span>Edit</span>
                    </Link>
                  </TableCell>
                </TableRow>
              </TableBody>
            ))}
          </Table>
          {showMore && (
            <button
              onClick={handleShowMore}
              className="w-full text-teal-500 self-center text-sm py-7"
            >
              Show more
            </button>
          )}
        </>
      ) : (
        <p>You have no posts yet!</p>
      )}
    </div>
  );
}
