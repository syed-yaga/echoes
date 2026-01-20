import React, { useEffect, useState } from "react";
import moment from "moment";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

type User = {
  id: string;
  username: string;
  email: string;
  profilePicture?: string;
};

type CommentType = {
  id: string;
  content: string;
  postId: string;
  userId: string;
  likes: string[];
  numberOfLikes: number;
  createdAt: string;
  updatedAt?: string;
};

type CommentProps = {
  comment: CommentType;
  onLike: (commentId: string) => Promise<void>;
};

export default function Comment({ comment, onLike }: CommentProps) {
  const [user, setUser] = useState<User | null>(null);
  const { currentUser } = useSelector((state: RootState) => state.user);
  useEffect(() => {
    async function getUser() {
      try {
        const res = await fetch(
          `http://localhost:3000/api/user/${comment.userId}`,
        );
        const data = await res.json();
        if (res.ok) {
          setUser(data);
        }
      } catch (error: any) {
        console.log(error.message);
      }
    }
    getUser();
  }, [comment]);

  return (
    <div className="flex p-4 border-b dark:border-gray-600 text-sm">
      <div className="flex-shrink-0 mr-3">
        <img
          className="w-10 h-10 rounded-full bg-gray-200"
          src={user?.profilePicture}
          alt={user?.username}
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center mb-1">
          <span className="font-bold mr-1 text-xs truncate">
            {user ? `@${user.username}` : "unknown user"}
          </span>
          <span className="text-gray-500 text-xs">
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>
        <p className="text-gray-500 pb-2">{comment.content}</p>
        <div className=" flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2">
          <button
            type="button"
            onClick={() => onLike(comment.id)}
            className={`text-gray-400 hover:text-blue-500 ${currentUser && comment.likes.includes(currentUser.id) && "!text-blue-500"}`}
          >
            <FaThumbsUp className="text-sm" />
          </button>
          <p className="text-gray-400">
            {comment.numberOfLikes > 0 &&
              comment.numberOfLikes +
                "" +
                (comment.numberOfLikes === 1 ? "like" : "likes")}
          </p>
        </div>
      </div>
    </div>
  );
}
