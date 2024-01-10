import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "../firebase";
import axios from "axios"; // Import Axios
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";

const OAuth = () => {
  const dispatch = useDispatch();

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

      dispatch(signInSuccess(response.data));
    } catch (error) {
      console.log("Could not login with Google", error);
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleClick}
      className="bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95"
    >
      Continue with Google
    </button>
  );
};

export default OAuth;
