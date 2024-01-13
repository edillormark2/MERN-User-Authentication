import { useSelector, useDispatch } from "react-redux";
import { useEffect, useRef, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable
} from "firebase/storage";
import { app } from "../firebase";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOut
} from "../redux/user/userSlice";


const Profile = () => {
  const { currentUser, loading } = useSelector((state) => state.user);
  const token = localStorage.getItem("access_token");
  const fileRef = useRef(null);
  const [image, setImage] = useState(undefined);
  const [imagePercent, setImagePercent] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [isImageChanged, setIsImageChanged] = useState(false); 
  const [formData, setFormData] = useState({
    username: currentUser?.username || "",
    email: currentUser?.email || "",
    password: "",
  });
  const [isDataChanged, setIsDataChanged] = useState(false); // New state to track changes
  const dispatch = useDispatch();

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`https://mern-auth-6cal.onrender.com/api/user/user/${currentUser._id}`);
      setFormData({
        ...formData,
        username: response.data.username,
        email: response.data.email,
      });
    } catch (error) {
      console.error("Error fetching user data: ", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleUserUpdated = () => {
    // Callback function to refresh user data after updating the user
    fetchUserData();
  };

  useEffect(() => {
    if (image) {
      handleFileUpload(image);
    }
  }, [image]);

  const handleFileUpload = async (newImage) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + newImage.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, newImage);
  
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImagePercent(Math.round(progress));
      },
      () => {
        setImageError(true);
      },
      async () => {
        try {
          await getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setFormData({ ...formData, profilePicture: downloadURL });
            setIsImageChanged(true); // Set isImageChanged to true when the image is uploaded
          });
  
          
        } catch (error) {
          console.error("Error updating profile picture: ", error);
        }
      }
    );
  };

  const handleChange = (e) => {
    const { id, value } = e.target;

    // Only set isDataChanged to true if the value is different from the original value
    if (formData[id] !== value) {
      setIsDataChanged(true);
    }

    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if data or image has changed
    if (!isDataChanged && !isImageChanged) {
      toast.info("You haven't changed anything.");
      return;
    }

    try {
      dispatch(updateUserStart());

      const updateData = { ...formData };

      // Include the password field only if it's not empty
      if (formData.password) {
        updateData.password = formData.password;
      } else {
        delete updateData.password; // Remove the password field if it's empty
      }

      const res = await axios.post(
        `https://mern-auth-6cal.onrender.com/api/user/update/${currentUser._id}`,
        updateData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      if (res.status === 201) {
        dispatch(updateUserSuccess(res.data));
        toast.success(res.data.message || "Updated successfully");
        await fetchUserData();
      } else {
        dispatch(updateUserFailure(res.data));
        toast.error(res.data.message || "Error updating data");
      }
    } catch (error) {
      console.error("Error:", error);
      dispatch(updateUserFailure(error));
      toast.error("Error updating data");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      // Show confirmation dialog to the user
      const userConfirmed = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");

      if (!userConfirmed) {
        // User cancelled the deletion
        return;
      }

      dispatch(deleteUserStart());

      const token = localStorage.getItem('access_token');

      const res = await axios.delete(
        `https://mern-auth-6cal.onrender.com/api/user/delete/${currentUser._id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem("access_token")}`
          },
        }
      );

      const data = res.data;

      if (data.success === false) {
        dispatch(deleteUserFailure(data));
        toast.error("Failed to delete account. Please try again.");
        return;
      }

      dispatch(deleteUserSuccess(data));
      toast.success("Account deleted successfully");
    } catch (error) {
      dispatch(deleteUserFailure(error));
      toast.error("An error occurred while deleting the account. Please try again.");
    }
  };

  const handleSignOut = async () => {
    try {
      const confirmSignOut = window.confirm("Are you sure you want to sign out?");
      
      if (confirmSignOut) {
        await fetch('https://mern-auth-6cal.onrender.com/api/auth/signout', {
          method: 'GET',
          mode: 'cors',
          credentials: 'include', // Include credentials (cookies)
        });
    
        dispatch(signOut());
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  
  return (
    <div className="p-3 max-w-lg mx-auto">
    <div className="dark:bg-secondary-dark-bg bg-white drop-shadow-xl p-6 mt-10 m-4 rounded-lg">
      <form onSubmit={handleSubmit} className="flex flex-col gap-1">
        <input
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <img
  src={
    formData.profilePicture ?
      `${formData.profilePicture}?${Math.random()}` :
      (currentUser && currentUser.profilePicture)
  }
  alt="profile"
  className="h-28 w-28 self-center cursor-pointer rounded-full object-cover mt-2"
  onClick={() => fileRef.current.click()}
  key={formData.profilePicture || Math.random()} // Change the key dynamically
/>
        <p className="text-sm self-center mt-4">
          {imageError ? (
            <span className="text-red-700">
              Error uploading image (file size must be less than 3 MB)
            </span>
          ) : imagePercent > 0 && imagePercent < 100 ? (
            <span className="text-slate-700 dark:text-gray-200">
              Uploading: {imagePercent}%
              <span
                className="block h-1 bg-blue-500"
                style={{
                  width: `${imagePercent}%`,
                  transition: "width 0.3s ease-out", // Smooth transition effect
                }}
              ></span>
            </span>
          ) : imagePercent === 100 && image && image.size <= 3 * 1024 * 1024 ? (
            <span className="text-green-700 font-semibold">
              Image uploaded successfully
            </span>
          ) : null}
        </p>
  
        <div className="mt-4">
          <p className="text-sm dark:text-gray-200">Username</p>
          <input
            value={formData.username || ""}
            type="text"
            id="username"
            placeholder="Username"
            className="form-control bg-slate-50 p-3 rounded-lg border border-gray-300 pr-10 text-sm sm:text-base dark:bg-half-transparent dark:text-gray-200"
            onChange={handleChange}
          />
        </div>
  
        <div className="mt-4">
          <p className="text-sm dark:text-gray-200">Email</p>
          <input
            value={formData.email || ""}
            type="email"
            id="email"
            placeholder="Email"
            className="form-control bg-slate-50 p-3 rounded-lg border border-gray-300 pr-10 text-sm sm:text-base dark:bg-half-transparent dark:text-gray-200"
            onChange={handleChange}
          />
        </div>
  
        <div className="mt-4">
          <p className="text-sm dark:text-gray-200">Password</p>
          <input
            type="password"
            id="password"
            placeholder="Password"
            className="form-control bg-slate-50 p-3 rounded-lg border border-gray-300 pr-10 text-sm sm:text-base dark:bg-half-transparent dark:text-gray-200"
            onChange={handleChange}
          />
        </div>
  
        <button className="bg-blue-600 text-white p-3 rounded-lg hover:opacity-70 disabled:opacity-70 text-sm sm:text-base mt-6">
          {loading ? "Loading..." : "Update"}
        </button>
      </form>
  
      <div className="flex justify-between mt-16">
        <span
          onClick={handleDeleteAccount}
          className="text-red-700 dark:bg-main-dark-bg cursor-pointer bg-white bg-opacity-50 p-2 rounded-xl font-bold text-sm sm:text-base hover:opacity-75"
        >
          Delete Account
        </span>
        <span
          onClick={handleSignOut}
          className="text-red-700 dark:bg-main-dark-bg cursor-pointer bg-white bg-opacity-50 p-2 rounded-xl font-bold text-sm sm:text-base hover:opacity-75"
        >
          Sign out
        </span>
      </div>
    </div>
  </div>
  
  );
};

export default Profile;