import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import {
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";

import { HiOutlineExclamationCircle } from "react-icons/hi";

type Comment = {
  id: string;
  content: string;
  postId: string;
  userId: string;
  likes: string;
  numberofLikes: number;
  createdAt: string;
  updatedAt: string;
};

export default function DashComments() {
  const { currentUser } = useSelector((state: RootState) => state.user);

  const [comments, setComments] = useState<Comment[]>([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(
          "https://echoes-wwgg.onrender.com/api/comment/getcomments",
          {
            credentials: "include",
          },
        );
        const data = await res.json();

        if (res.ok) {
          setComments(data.comments);
          if (data.comments.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (currentUser?.isAdmin) {
      fetchComments();
    }
  }, [currentUser?.id]);

  const handleShowMore = async () => {
    const startIndex = comments.length;

    try {
      const res = await fetch(
        `https://echoes-wwgg.onrender.com/api/comment/getcomments?startIndex=${startIndex}`,
        { credentials: "include" },
      );
      const data = await res.json();

      if (res.ok) {
        setComments((prev) => [...prev, ...data.users]);
        if (data.users.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteComment = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `https://echoes-wwgg.onrender.com/api/comment/deleteComment/${commentIdToDelete}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      if (res.ok) {
        setComments((prev) =>
          prev.filter((comment) => comment.id !== commentIdToDelete),
        );
        setShowModal(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser?.isAdmin && comments.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <TableHead>
              <TableRow>
                <TableHeadCell>Date updated</TableHeadCell>
                <TableHeadCell>Comment content</TableHeadCell>
                <TableHeadCell>Number of likes</TableHeadCell>
                <TableHeadCell>PostId</TableHeadCell>
                <TableHeadCell>UserId</TableHeadCell>
                <TableHeadCell>Delete</TableHeadCell>
              </TableRow>
            </TableHead>

            <TableBody className="divide-y">
              {comments.map((comment) => (
                <TableRow
                  key={comment.id}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <TableCell>
                    {new Date(comment.updatedAt).toLocaleDateString()}
                  </TableCell>

                  <TableCell>{comment.content}</TableCell>

                  <TableCell>{comment.numberofLikes}</TableCell>
                  <TableCell>{comment.postId}</TableCell>

                  <TableCell>{comment.userId}</TableCell>

                  <TableCell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setCommentIdToDelete(comment.id);
                      }}
                      className="font-medium text-red-500 hover:underline cursor-pointer"
                    >
                      Delete
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
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
        <p>You have no comments yet!</p>
      )}

      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <ModalHeader />
        <ModalBody>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500">
              Are you sure you want to delete this comment?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteComment}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
}
