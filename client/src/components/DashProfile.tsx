import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import {
  Alert,
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  TextInput,
} from "flowbite-react";
import { supabase } from "../supabaseClient";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutSuccess,
} from "../redux/user/userslice";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Link } from "react-router-dom";

type FormDataType = {
  username: string;
  email: string;
  password: string;
  profilePicture: string | null;
};

export default function DashProfile() {
  const { currentUser, error, loading } = useSelector(
    (state: RootState) => state.user
  );
  const [initialized, setInitialized] = useState(false);

  const [formData, setFormData] = useState<FormDataType>({
    username: "",
    email: "",
    password: "",
    profilePicture: null,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageFileUrl, setImageFileUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number | null>(null);

  const [updateUserSuccess, setUpdateUserSuccess] = useState<string | null>(
    null
  );
  const [updateUserError, setUpdateUserError] = useState<string | null>(null);
  const [showModal, setShowModel] = useState(false);

  const filePickerRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (currentUser && !initialized) {
      setFormData({
        username: currentUser.username,
        email: currentUser.email,
        password: "",
        profilePicture: currentUser.profilePicture,
      });
      setInitialized(true);
    }
  }, [currentUser, initialized]);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadError("Only image files allowed");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setUploadError("Max size allowed: 2MB");
      return;
    }

    setUploadError(null);
    setImageFile(file);
    setImageFileUrl(URL.createObjectURL(file));
  }

  async function uploadImage() {
    setImageFileUploading(true);
    if (!imageFile || !currentUser) return;

    const ext = imageFile.name.split(".").pop();
    const fileName = `${currentUser.id}-${Date.now()}.${ext}`;
    const filePath = `profiles/${fileName}`;

    setUploading(true);
    setProgress(20);

    const { error } = await supabase.storage
      .from("images")
      .upload(filePath, imageFile, { upsert: false });

    if (error) {
      setUploadError(error.message);
      setUploading(false);
      setImageFileUploading(false);
      return;
    }

    setProgress(100);

    const { data } = supabase.storage.from("images").getPublicUrl(filePath);
    setImageFileUrl(data.publicUrl);

    setFormData((prev) => ({
      ...prev,
      profilePicture: data.publicUrl,
    }));

    setUploading(false);
    setImageFileUploading(false);
  }

  useEffect(() => {
    if (imageFile) uploadImage();
  }, [imageFile]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { id, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);

    if (!currentUser) {
      setUpdateUserError("You must be logged in.");
      return;
    }

    if (imageFileUploading) {
      alert("Please wait — image is still uploading...");
      return;
    }

    const hasChanges =
      formData.username !== currentUser.username ||
      formData.email !== currentUser.email ||
      formData.password.trim() !== "" ||
      formData.profilePicture !== currentUser.profilePicture;

    if (!hasChanges) {
      setUpdateUserError("No changes made");
      return;
    }

    try {
      dispatch(updateStart());

      const res = await fetch(
        `http://localhost:3000/api/user/update/${currentUser.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      } else {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("Profile updated successfully ✔️");
      }
    } catch (error: any) {
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);
    }
  }

  async function handleDeleteUser() {
    setShowModel(false);
    try {
      dispatch(deleteUserStart());
      const res = await fetch(
        `http://localhost:3000/api/user/delete/${currentUser?.id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      const text = await res.text();
      const data = text ? JSON.parse(text) : null;
      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
      } else {
        dispatch(deleteUserSuccess(data));
      }
    } catch (error: any) {
      dispatch(deleteUserFailure(error.message));
    }
  }

  async function handleSignOut() {
    try {
      const res = await fetch("http://localhost:3000/api/user/signout", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signOutSuccess());
      }
    } catch (error: any) {
      console.log(error.message);
    }
  }

  if (!currentUser) return <div>Please sign in</div>;

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          accept="image/*"
          ref={filePickerRef}
          onChange={handleImageChange}
          hidden
        />

        <div
          className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
          onClick={() => filePickerRef.current?.click()}
        >
          {progress && (
            <CircularProgressbar
              value={progress}
              text={`${progress}%`}
              strokeWidth={5}
            />
          )}

          <img
            src={imageFileUrl || currentUser.profilePicture}
            alt="profile"
            className="rounded-full w-full h-full object-cover border-8 border-gray-300"
          />
        </div>

        {uploadError && <Alert color="failure">{uploadError}</Alert>}

        <TextInput
          type="text"
          id="username"
          placeholder="username"
          value={formData.username}
          onChange={handleChange}
        />

        <TextInput
          type="text"
          id="email"
          placeholder="email"
          value={formData.email}
          onChange={handleChange}
        />

        <TextInput
          type="password"
          id="password"
          placeholder="password"
          value={formData.password}
          onChange={handleChange}
        />

        <Button
          type="submit"
          outline
          disabled={imageFileUploading || uploading || loading}
        >
          {imageFileUploading
            ? "Uploading image..."
            : loading
            ? "Updating profile..."
            : "Update"}
        </Button>
        {currentUser.isAdmin && (
          <Link to={"/create-post"}>
            <Button type="button" className="w-full">
              Post
            </Button>
          </Link>
        )}
      </form>
      <div className="text-red-500 flex justify-between mt-5">
        <span onClick={() => setShowModel(true)} className="cursor-pointer">
          Delete Account
        </span>
        <span onClick={handleSignOut} className="cursor-pointer">
          Sign Out
        </span>
      </div>

      {updateUserSuccess && (
        <Alert className="mt-5" color="success">
          {updateUserSuccess}
        </Alert>
      )}

      {updateUserError && (
        <Alert className="mt-5" color="failure">
          {updateUserError}
        </Alert>
      )}
      {error && (
        <Alert className="mt-5" color="failure">
          {error}
        </Alert>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModel(false)}
        popup
        size="md"
      >
        <ModalHeader />
        <ModalBody>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete your account?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteUser}>
                Yes, I am sure
              </Button>
              <Button color="gray" onClick={() => setShowModel(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
}
