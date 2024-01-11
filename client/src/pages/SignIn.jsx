import { useState } from "react";
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

const SignIn = () => {
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

    // Log formData just before making the request
    console.log(formData);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/signin",
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
      <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          id="email"
          className="bg-slate-100 p-3 rounded-lg"
          onChange={handleChange}
          value={formData.email}
        />
        <input
          type="password"
          placeholder="Password"
          id="password"
          className="bg-slate-100 p-3 rounded-lg"
          onChange={handleChange}
          value={formData.password}
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Sign In"}
        </button>
        <OAuth />
      </form>
      <div className="flex gap-2 mt-5">
        <p>Don't Have an account?</p>
        <Link to="/sign-up">
          <span className="text-blue-500">Sign up</span>
        </Link>
      </div>
    </div>
  );
};

export default SignIn;
