import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const PrivateRoute = ({ children }) => {
  const { currentUser } = useSelector(state => state.user);

  if (!currentUser) {
    console.log("User not authenticated, redirecting to /signin");
    return <Navigate to="/signin" />;
  }

  return children;
};

export default PrivateRoute;
