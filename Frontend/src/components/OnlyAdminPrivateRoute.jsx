import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function OnlyAdminPrivateRoute() {
  const { currentUser } = useSelector((state) => state.user);

  console.log('currentUser:', currentUser); // Add this line to debug the user state

  return currentUser && currentUser.isAdmin ? <Outlet /> : <Navigate to="/signin" />;
}
