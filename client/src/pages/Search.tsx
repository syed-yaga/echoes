import { Button, Select, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PostCard from "../components/PostCard";

type Post = {
  id: string;
  title: string;
  content: string;
  image?: string;
  category: string;
  slug: string;
  createdAt: string;
  updatedAt?: string;
};

export default function Search() {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    sort: "desc",
    category: "uncategorized",
  });
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  //   const [recentPosts, setRecentPosts] = useState<Post[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const sortFromUrl = urlParams.get("sort");
    const categoryFromUrl = urlParams.get("category");

    if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
      setSidebarData({
        ...sidebarData,
        searchTerm: searchTermFromUrl ?? "",
        sort: sortFromUrl ?? "",
        category: categoryFromUrl ?? "",
      });
    }

    async function fetchPosts() {
      setLoading(true);
      const searchQuery = urlParams.toString();
      const res = await fetch(
        `https://echoes-wwgg.onrender.com/api/post/getposts?${searchQuery}`,
        {
          method: "GET",
          credentials: "include",
        },
      );
      if (!res.ok) {
        setLoading(false);
        return;
      }

      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts);
        setLoading(false);
        if (data.posts && data.posts.length === 9) {
          setShowMore(true);
        } else {
          setShowMore(false);
        }
      }
    }

    fetchPosts();
  }, [location.search]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    if (e.target.id === "searchTerm") {
      setSidebarData({ ...sidebarData, searchTerm: e.target.value });
    }

    if (e.target.id === "sort") {
      const order = e.target.value || "desc";
      setSidebarData({ ...sidebarData, sort: order });
    }

    if (e.target.id === "category") {
      const category = e.target.value || "uncategorized";
      setSidebarData({ ...sidebarData, category });
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", sidebarData.searchTerm);
    urlParams.set("sort", sidebarData.sort);
    urlParams.set("category", sidebarData.category);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };
  async function handleShowMore() {
    const numberOfPosts = posts.length;
    const startIndex = numberOfPosts;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex.toString());
    const searchQuery = urlParams.toString();
    const res = await fetch(
      `https://echoes-wwgg.onrender.com/api/post/getposts?${searchQuery}`,
      {
        method: "GET",
        credentials: "include",
      },
    );
    if (!res.ok) {
      return;
    }
    if (res.ok) {
      const data = await res.json();
      setPosts([...posts, ...data.posts]);
      if (data.posts && data.posts.length === 9) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
    }
  }
  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b md:border-r md:min-h-screen border-gray-500">
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              Search Term:
            </label>
            <TextInput
              placeholder="Search..."
              id="searchTerm"
              type="text"
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort:</label>
            <Select onChange={handleChange} value={sidebarData.sort} id="sort">
              <option value="desc">Latest</option>
              <option value="asc">Oldest</option>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Category:</label>
            <Select
              onChange={handleChange}
              value={sidebarData.category}
              id="category"
            >
              <option value="uncategorized">Uncategorized</option>
              <option value="reactjs">React.js</option>
              <option value="nextjs">Next.js</option>
              <option value="javascript">Javascript</option>
            </Select>
          </div>
          <Button type="submit" outline>
            Apply Filters
          </Button>
        </form>
      </div>
      <div className="w-full">
        <h1 className="text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5">
          Posts results
        </h1>
        <div className=" flex p-7 flex-wrap gap-4">
          {!loading && posts.length === 0 && (
            <p className="text-xl text-gray-500">No posts found.</p>
          )}

          {loading && <p className="text-xl text-gray-500">Loading...</p>}
          {!loading &&
            posts &&
            posts.map((post) => <PostCard key={post.id} post={post} />)}

          {showMore && (
            <button
              className="text-teal-500 text-lg hover:underline p-7 w-full"
              onClick={handleShowMore}
            >
              Show More
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
