import React, { useEffect, useState } from "react";
import moment from "moment";

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
  createdAt: string;
  updatedAt?: string;
};

type CommentProps = {
  comment: CommentType;
};

export default function Comment({ comment }: CommentProps) {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    async function getUser() {
      try {
        const res = await fetch(
          `http://localhost:3000/api/user/${comment.userId}`
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
      </div>
    </div>
  );
}
