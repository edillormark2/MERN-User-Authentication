import { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  signInStart,
  signInSuccess,
  signInFailure
} from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import OAuth from "../components/OAuth";
import "../App.css";

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const { loading } = useSelector(state => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = e => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error("Please fill out all fields");
      return;
    }
    dispatch(signInStart());
    try {
      const response = await axios.post(
        "https://mern-auth-6cal.onrender.com/api/auth/signin",
        formData,
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      localStorage.setItem("access_token", response.data.access_token);
      dispatch(signInSuccess(response.data));
      // Handle successful sign-in
      toast.success("Logged in successfully");
      navigate("/");
    } catch (error) {
      dispatch(signInFailure(error));
      if (error.response && error.response.status === 401) {
        toast.error("Email or password is incorrect");
      } else if (error.response && error.response.status === 404) {
        toast.error("User not found");
      } else {
        toast.error("Error signing in");
      }
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <div className="dark:bg-secondary-dark-bg bg-white drop-shadow-xl p-6 mt-20 m-4 rounded-lg">
        <h1 className="dark:text-gray-200 text-2xl sm:text-3xl text-center font-semibold mb-7">
          Sign In
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            id="email"
            className="form-control bg-slate-50 p-3 rounded-lg border border-gray-300 text-sm sm:text-base dark:bg-half-transparent dark:text-gray-200"
            onChange={handleChange}
            value={formData.email}
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              id="password"
              className="form-control bg-slate-50 p-3 rounded-lg border border-gray-300 pr-10 text-sm sm:text-base dark:bg-half-transparent dark:text-gray-200"
              onChange={handleChange}
              value={formData.password}
            />
            <div
              className="absolute inset-y-0 right-2 flex items-center pr-2 cursor-pointer text-gray-500 "
              onClick={togglePasswordVisibility}
            >
              {showPassword
                ? <AiFillEye size={23} />
                : <AiFillEyeInvisible size={23} />}
            </div>
          </div>
          <button
            disabled={loading}
            className="bg-blue-600 text-white p-3 rounded-lg  hover:opacity-85 disabled:opacity-80 text-sm sm:text-base"
          >
            {loading ? "Loading..." : "Sign In"}
          </button>
          <OAuth />
        </form>
        <div className="flex gap-2 mt-5 text-sm sm:text-base dark:text-gray-200">
          <p>Don't Have an account?</p>
          <Link to="/">
            <span className="text-blue-500">Sign up</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
