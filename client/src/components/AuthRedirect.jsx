import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const AuthRedirect = ({ element }) => {
  const { currentUser } = useSelector(state => state.user);
  return currentUser ? <Navigate to="/" /> : element;
};

export default AuthRedirect;
