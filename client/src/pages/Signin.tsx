import { Alert, Button, ButtonGroup, Spinner, TextInput } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import Label from "../components/Label";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../redux/user/userslice";
import GAuth from "../components/GAuth";
type FormData = {
  // username: string;
  email: string;
  password: string;
};

export function SignIn() {
  const [formData, setformData] = useState<FormData>({
    // username: "",
    email: "",
    password: "",
  });
  const { loading, error: errorMessage } = useSelector(
    (state: any) => state.user
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handlechange(e: any) {
    setformData({ ...formData, [e.target.id]: e.target.value.trim() });
  }
  async function handleSubmit(e: any) {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return dispatch(signInFailure("PLease fill all the fields"));
    }
    try {
      dispatch(signInStart());

      const response = await fetch("http://localhost:3000/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success === false) {
        return dispatch(signInFailure(data.message));
      }

      if (response.ok) {
        dispatch(signInSuccess(data));
        navigate("/");
      }
    } catch (error: any) {
      dispatch(signInFailure(error.message));
    }
  }

  return (
    <div className="mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* left */}
        <div className="flex-1">
          <Link to={"/"} className="font-bold dark:text-white text-4xl">
            <span className="px-3 py-1 rounded-lg bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-800 text-white shadow-lg">
              Echoes
            </span>
          </Link>

          <p className="text-sm mt-5">
            You can sign in with your Email and Password or with Google
          </p>
        </div>

        {/* right */}
        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label value="Your Email" />
              <TextInput
                type="email"
                placeholder="your_email@gmail.com"
                id="email"
                onChange={handlechange}
              />
            </div>{" "}
            <div>
              <Label value="Your Password" />
              <TextInput
                type="password"
                placeholder="***********"
                id="password"
                onChange={handlechange}
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span className="pl-3">Loading...</span>
                </>
              ) : (
                "Sign In"
              )}
            </Button>
            <GAuth />
          </form>
          <div className=" flex gap-2 text-sm mt-5">
            <span>Don't have an account?</span>
            <Link to="/signup" className="text-blue-500">
              Sign-Up
            </Link>
          </div>
          {errorMessage && (
            <Alert className="mt-5" color="failure">
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
