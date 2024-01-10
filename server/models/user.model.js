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
        "https://qph.cf2.quoracdn.net/main-qimg-6d72b77c81c9841bd98fc806d702e859-lq"
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
