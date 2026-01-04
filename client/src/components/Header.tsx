import {
  Avatar,
  Button,
  Dropdown,
  DropdownDivider,
  DropdownHeader,
  DropdownItem,
  Navbar,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
  TextInput,
} from "flowbite-react";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { toggleTheme } from "../redux/theme/themeSlice";
import { RootState } from "../redux/store";
import { signOutSuccess } from "../redux/user/userslice";

export default function Header() {
  const path = useLocation().pathname;
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: any) => state.user);
  console.log("Current User:", currentUser);
  console.log("Profile Picture:", currentUser?.profilePicture);
  const { theme } = useSelector((state: RootState) => state.theme);

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

  return (
    <Navbar className="border-b-2">
      <Link
        to={"/"}
        className="self-center text-sm sm:text-xl font-semibold dark:text-white"
      >
        <span className="px-3 py-1 rounded-lg bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-800 text-white shadow-lg">
          Echoes
        </span>
      </Link>
      <form action="">
        <TextInput
          type="text"
          placeholder="Search..."
          rightIcon={AiOutlineSearch}
          className="hidden lg:inline"
        />
      </form>
      <Button className="w-12 h-10 lg:hidden" color="gray" pill>
        <AiOutlineSearch />
      </Button>
      <div className="flex gap-2 md:order-2">
        <Button
          className="w-12 h-10 hidden sm:inline"
          color="gray"
          pill
          onClick={() => dispatch(toggleTheme())}
        >
          {theme === "light" ? <FaSun /> : <FaMoon />}
        </Button>
        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar
                alt="user avatar"
                img={currentUser.profilePicture}
                rounded
              />
            }
          >
            <DropdownHeader>
              <span className="block text-sm">@{currentUser.username}</span>
              <span className="block text-sm font-medium truncate">
                {currentUser.email}
              </span>
            </DropdownHeader>
            <Link className="" to={"/dashboard?tab=profile"}>
              <DropdownItem>Profile</DropdownItem>
            </Link>
            <DropdownDivider />
            <DropdownItem onClick={handleSignOut}>Sign Out</DropdownItem>
          </Dropdown>
        ) : (
          <Link to="/signin">
            <Button outline>Sign In</Button>
          </Link>
        )}

        <NavbarToggle />
      </div>
      <NavbarCollapse>
        <NavbarLink active={path === "/"} as={"div"}>
          <Link to="/">Home</Link>
        </NavbarLink>
        <NavbarLink active={path === "/about"} as={"div"}>
          <Link to="/about">About</Link>
        </NavbarLink>
        <NavbarLink active={path === "/projects"} as={"div"}>
          <Link to="/projects">Projects</Link>
        </NavbarLink>
      </NavbarCollapse>
    </Navbar>
  );
}
