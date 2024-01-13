import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";

export const test = (req, res) => {
  res.json({
    message: "API is working!"
  });
};

//Updating user profile
export const updateUser = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.id) {
      return res
        .status(401)
        .json({ message: "You can update only your account" });
    }

    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          profilePicture: req.body.profilePicture
        }
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const { password, ...rest } = updatedUser._doc;
    res
      .status(201)
      .json({ success: true, message: "Updated successfully", ...rest });
  } catch (error) {
    next(error);
  }
};

//Deleting User Account
export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, "You can delete only your account"));
  }
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User hasn been deleted...");
  } catch (error) {
    next(error);
  }
};

//Fetching user data
export const getUserData = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { password, ...userData } = user._doc;
    res.status(200).json(userData);
  } catch (error) {
    next(error);
  }
};
