import React, { useEffect, useState } from "react";
import moment from "moment";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Button, Textarea } from "flowbite-react";

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
  onEdit: (commentId: string, content: string) => Promise<void>;
};

export default function Comment({ comment, onLike, onEdit }: CommentProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [editedContent, setEditedContent] = useState(comment.content);
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
  }, [comment.userId]);

  function handleEdit() {
    setIsEditing(true);
    setEditedContent(comment.content);
  }

  async function handleSave() {
    try {
      const res = await fetch(
        `http://localhost:3000/api/comment/editComment/${comment.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            content: editedContent,
          }),
        },
      );
      if (res.ok) {
        setIsEditing(false);
        onEdit(comment.id, editedContent);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  }

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
        {isEditing ? (
          <>
            <Textarea
              className="mb-2"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />
            <div className="flex justify-end gap-2 text-xs">
              <Button type="button" size="sm" onClick={handleSave}>
                Save
              </Button>
              <Button
                type="button"
                size="sm"
                outline
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="text-gray-200 text-sm mt-2 whitespace-pre-wrap">
              {comment.content}
            </p>

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
              {currentUser &&
                (currentUser.id === comment.userId || currentUser.isAdmin) && (
                  <button
                    type="button"
                    className="text-gray-400 hover:text-blue-500"
                    onClick={handleEdit}
                  >
                    Edit
                  </button>
                )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
