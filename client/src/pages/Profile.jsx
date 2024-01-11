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
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOut
} from "../redux/user/userSlice";
import "react-toastify/dist/ReactToastify.css";

const Profile = () => {
  const { currentUser, loading } = useSelector(state => state.user);
  const token = localStorage.getItem("access_token"); // Check here for the stored token
  console.log("Token:", token);
  const fileRef = useRef(null);
  const [image, setImage] = useState(undefined);
  const [imagePercent, setImagePercent] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [formData, setFormData] = useState({
    username: currentUser?.username || "",
    email: currentUser?.email || "",
    password: ""
  });
  const dispatch = useDispatch();

  useEffect(
    () => {
      if (image) {
        handleFileUpload(image);
      }
    },
    [image]
  );

  const handleFileUpload = async image => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      "state_changed",
      snapshot => {
        const progress = snapshot.bytesTransferred / snapshot.totalBytes * 100;
        setImagePercent(Math.round(progress));
      },
      () => {
        setImageError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(downloadURL =>
          setFormData({ ...formData, profilePicture: downloadURL })
        );
      }
    );
  };

  const handleChange = e => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await axios.post(
        `http://localhost:3000/api/user/update/${currentUser._id}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`
          }
        }
      );
      
    
      if (res.status === 201) {
        dispatch(updateUserSuccess(res.data));
        toast.success(res.data.message || "Updated successfully");
      } else {
        dispatch(updateUserFailure(res.data));
        toast.error(res.data.message || "Error updating data");
      }
    } catch (error) {
      console.error("Error:", error);
      dispatch(updateUserFailure(error));
      toast.error("Error updating data");
    }
  }    


  const handleDeleteAccount = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`http://localhost:3000/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error));
    }
  };

  const handleSignOut = async () => {
    try {
      await axios.get("http://localhost:3000/api/auth/signout");
      toast.success("Sign out successful");
      dispatch(signOut());
    } catch (error) {
      console.error("Error during sign out:", error);
      toast.error("Error during sign out");
    }
  };
  
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
          onChange={e => setImage(e.target.files[0])}
        />
        <img
          src={
            formData.profilePicture ||
            (currentUser && currentUser.profilePicture)
          }
          alt="profile"
          className="h-24 w-24 self-center cursor-pointer rounded-full object-cover mt-2 "
          onClick={() => fileRef.current.click()}
        />

        <p className="text-sm self-center">
          {imageError
            ? <span className="text-red-700">
                Error uploading image (file size must be less than 3 MB)
              </span>
            : imagePercent > 0 && imagePercent < 100
              ? <span className="text-slate-700">{`Uploading: ${imagePercent}%`}</span>
              : imagePercent === 100 && image && image.size <= 3 * 1024 * 1024
                ? <span className="text-green-700">
                    Image uploaded successfully
                  </span>
                : null}
        </p>
        <input
          value={formData.username || ""}
          type="text"
          id="username"
          placeholder="Username"
          className="bg-slate-100 rounded-lg p-3"
          onChange={handleChange}
        />

        <input
          value={formData.email || ""}
          type="email"
          id="email"
          placeholder="Email"
          className="bg-slate-100 rounded-lg p-3"
          onChange={handleChange}
        />
        <input
          type="password"
          id="password"
          placeholder="Password"
          className="bg-slate-100 rounded-lg p-3"
          onChange={handleChange}
        />
        <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-80">
          {loading ? "Loading..." : "Update"}
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span
          onClick={handleDeleteAccount}
          className="text-red-700 cursor-pointer"
        >
          Delete Account
        </span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">
          Sign out
        </span>
      </div>
    </div>
  );
};

export default Profile;
