import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "../firebase";
import axios from "axios"; // Import Axios
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";

const OAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Update the frontend code in handleGoogleClick function
  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);

      // Use Axios for API request
      const response = await axios.post(
        "http://localhost:3000/api/auth/google",
        {
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL
        }
      );

      // Store the token in localStorage
      localStorage.setItem("access_token", response.data.access_token);
      dispatch(signInSuccess(response.data));

      // Now, include the token in the headers for subsequent requests
      const token = localStorage.getItem("access_token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      navigate("/");
    } catch (error) {
      console.log("Could not login with Google", error);
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleClick}
      className="bg-red-700 text-white p-3 rounded-lg flex items-center justify-center gap-4 hover:opacity-80 text-sm sm:text-base"
    >
      <FaGoogle />
      <span>Sign in with Google</span>
    </button>
  );
};

export default OAuth;
