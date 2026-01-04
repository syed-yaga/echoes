import { Alert, Button, ButtonGroup, Spinner, TextInput } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import Label from "../components/Label";
import { useState } from "react";
import GAuth from "../components/GAuth";
type FormData = {
  username: string;
  email: string;
  password: string;
};

export function SignUp() {
  const [formData, setformData] = useState<FormData>({
    username: "",
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handlechange(e: any) {
    setformData({ ...formData, [e.target.id]: e.target.value.trim() });
  }
  async function handleSubmit(e: any) {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      return setErrorMessage("Please fill out all fields.");
    }
    try {
      setLoading(true);

      setErrorMessage(null);

      const response = await fetch("http://localhost:3000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success === false) {
        return setErrorMessage(data.message);
      }
      setLoading(false);
      if (response.ok) {
        navigate("/sign-in");
      }
    } catch (error: any) {
      setErrorMessage(error.message);
      setLoading(false);
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
            You can sign up with your Email and Password or with Google
          </p>
        </div>

        {/* right */}
        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label value="Your Username" />
              <TextInput
                type="text"
                placeholder="Username"
                id="username"
                onChange={handlechange}
              />
            </div>
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
                placeholder="Passowrd"
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
                "Sign Up"
              )}
            </Button>
            <GAuth />
          </form>
          <div className=" flex gap-2 text-sm mt-5">
            <span>Have an Account?</span>
            <Link to="/signin" className="text-blue-500">
              Sign-In
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
