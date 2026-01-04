import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Navigate, Outlet } from "react-router-dom";

export default function OnlyAdminPrivateRoute() {
  const { currentUser } = useSelector((state: RootState) => state.user);
  return currentUser && currentUser?.isAdmin ? (
    <Outlet />
  ) : (
    <Navigate to="/signin" />
  );
}
