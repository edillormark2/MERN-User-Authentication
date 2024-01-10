import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    profilePicture: {
      type: String,
      default:
        "https://i.pinimg.com/736x/d4/29/1e/d4291ea760fcbf77ef282cb83ab7127b.jpg"
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
