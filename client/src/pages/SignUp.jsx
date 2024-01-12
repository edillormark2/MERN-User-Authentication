import { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OAuth from "../components/OAuth";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.username || !formData.email || !formData.password) {
        setLoading(false);
        toast.error("Please fill out all fields");
        return;
      }

      // Validate password length
      if (formData.password.length < 8) {
        setLoading(false);
        toast.error("Password must be at least 8 characters long");
        return;
      }

      const response = await axios.post(
        "http://localhost:3000/api/auth/signup",
        formData,
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      setLoading(false);
      toast.success("Account created successfully");
      navigate("/sign-in");
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.status === 409) {
        toast.error("Email already exists");
      } else {
        toast.error("Error submitting data");
      }
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <div className="dark:bg-secondary-dark-bg bg-white drop-shadow-xl p-6 mt-20 m-4 rounded-lg">
        <h1 className=" dark:text-gray-200 text-2xl sm:text-3xl text-center font-semibold mb-7">
          Sign Up
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Username"
            id="username"
            className="form-control bg-slate-50 p-3 rounded-lg border border-gray-300 text-sm sm:text-base dark:bg-half-transparent dark:text-gray-200"
            onChange={handleChange}
            value={formData.username}
          />
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
              className="absolute inset-y-0 right-2 flex items-center pr-2 cursor-pointer text-gray-500"
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
            {loading ? "Loading..." : "Sign Up"}
          </button>
          <OAuth />
        </form>
        <div className="flex gap-2 mt-5 text-sm sm:text-base dark:text-gray-200">
          <p>Have an account?</p>
          <Link to="/sign-in">
            <span className="text-blue-500">Sign in</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
