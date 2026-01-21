import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Link, useNavigate } from "react-router-dom";
import { current } from "@reduxjs/toolkit";
import {
  Alert,
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  Textarea,
} from "flowbite-react";
import { SetStateAction, useEffect, useState } from "react";
import Comment from "./Comment";
import { HiOutlineExclamationCircle } from "react-icons/hi";

type CommentSectionProps = {
  postId: string;
};

type Comment = {
  id: string;
  content: string;
  postId: string;
  userId: string;
  likes: string[];
  numberOfLikes: number;
  createdAt: string;
};

export default function CommentSection({ postId }: CommentSectionProps) {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);
  const navigate = useNavigate();
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (comment.length > 200) {
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/comment/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          content: comment,
          postId,
          userId: currentUser?.id,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setComment("");
        setCommentError(null);
        setComments([data, ...comments]);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setCommentError(error.message);
      } else {
        setCommentError("Failed to add comment");
      }
    }
  }

  useEffect(() => {
    async function getcomments() {
      try {
        const res = await fetch(
          `http://localhost:3000/api/comment/getPostComments/${postId}`,
        );
        const data = await res.json();
        if (!res.ok) {
          throw new Error("Failed to fetch comments");
        }

        setComments(data);
      } catch (error: any) {
        console.log(error.message);
      }
    }
    getcomments();
  }, [postId]);

  async function handleLike(commentId: String) {
    try {
      if (!currentUser) {
        navigate("/sign-in");
        return;
      }

      const res = await fetch(
        `http://localhost:3000/api/comment/likeComment/${commentId}`,
        {
          method: "PUT",
          credentials: "include",
        },
      );
      if (res.ok) {
        const data = await res.json();
        setComments(
          comments.map((comment) =>
            comment.id === commentId
              ? {
                  ...comment,
                  likes: data.likes,
                  numberOfLikes: data.likes.length,
                }
              : comment,
          ),
        );
      }
    } catch (error: any) {
      console.log(error.message);
    }
  }

  async function handleEdit(comment: any, editedContent: any) {
    setComments(
      comments.map((c) =>
        c.id === comment.id ? { ...c, content: editedContent } : c,
      ),
    );
  }

  function openDeleteModal(commentId: string) {
    setCommentToDelete(commentId);
    setShowModal(true);
  }

  async function confirmDelete() {
    if (!commentToDelete || !currentUser) return;
    try {
      const res = await fetch(
        `http://localhost:3000/api/comment/deleteComment/${commentToDelete}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      if (res.ok) {
        setComments((prev) => prev.filter((c) => c.id !== commentToDelete));
        setShowModal(false);
        setCommentToDelete(null);
      }
    } catch (error: any) {
      console.log(error.message);
    }
  }

  return (
    <div className="max-w-2xl mx-auto w-full p-3">
      {currentUser ? (
        <div className="flex items-center gap-1 my-5 text-gray-500 text-sm">
          <p>Signed in as:</p>
          <img
            className="h-5 w-5 object-cover rounded-full"
            src={currentUser.profilePicture}
            alt=""
          />
          <Link
            to={"/dashboard?tab=profile"}
            className="text-xs text-cyan-600 hover:underline"
          >
            @ {currentUser.username}
          </Link>
        </div>
      ) : (
        <div className="text-sm text-teal-500 my-5 flex gap-1">
          You must be signed in to comment.
          <Link to={"/sign-in"} className="text-blue-500 hover:underline">
            Sign In
          </Link>
        </div>
      )}
      {currentUser && (
        <form
          onSubmit={handleSubmit}
          className="border border-teal-500 rounded-md p-3 "
        >
          <Textarea
            placeholder="Add a comment..."
            rows={3}
            maxLength={200}
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          />
          <div className="flex justify-between items-center mt-5">
            <p className="text-gray-500 text-xs">
              {200 - comment.length} charectors remaining
            </p>
            <Button className="outline" type="submit">
              Submit
            </Button>
          </div>
          {commentError && (
            <Alert color={"failure"} className="mt-5">
              {commentError}
            </Alert>
          )}
        </form>
      )}
      {comments.length === 0 ? (
        <p className="text-sm my-5">No comments!</p>
      ) : (
        <>
          <div className="text-sm my-5 flex items-center gap-1">
            <p>Comments</p>
            <div className="border border-gray-400 py-1 px-2 rounded-sm">
              <p>{comments.length}</p>
            </div>
          </div>
          {comments.map((comment) => (
            <Comment
              key={comment.id}
              comment={comment}
              onLike={handleLike}
              onEdit={handleEdit}
              onDelete={openDeleteModal}
            />
          ))}
        </>
      )}
      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <ModalHeader />
        <ModalBody>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this comment?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={confirmDelete}>
                Yes, I am sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
}
