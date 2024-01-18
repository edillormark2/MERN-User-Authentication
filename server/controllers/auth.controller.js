import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existingUser) {
      return res
        .status(409)
        .json({ message: "Username or email already exists" });
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });

    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const validUser = await User.findOne({ email });

    if (!validUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const validPassword = bcryptjs.compareSync(password, validUser.password);

    if (!validPassword) {
      return res
        .status(401)
        .json({ message: "Email or password is incorrect" });
    }

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 1); // Expires in 1 day

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1d"
    });

    const { password: hashedPassword, ...rest } = validUser._doc;

    res
      .cookie("access_token", token, {
        httpOnly: true,
        expires: expiryDate,
        sameSite: "None",
        secure: process.env.NODE_ENV === "production"
      })
      .status(200)
      .json({
        ...rest,
        access_token: token // Include access_token in the response
      });
  } catch (error) {
    // Handle token expiration
    if (error.name === "TokenExpiredError") {
      return res.redirect("/sign-in"); // Redirect to the sign-in page
    }
    next(error);
  }
};

export const google = async (req, res, next) => {
  try {
    const { email, name, photo } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      // If the user already exists, create a token and send it in the response
      const token = generateToken(existingUser._id);
      return sendTokenResponse(existingUser, token, res);
    }

    // If the user does not exist, create a new user
    const generatedPassword =
      Math.random().toString(36).slice(-8) +
      Math.random().toString(36).slice(-8);
    const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

    const newUser = new User({
      username: name.split(" ").join("").toLowerCase(),
      email,
      password: hashedPassword,
      profilePicture: photo
    });

    await newUser.save();

    // Create a token for the new user
    const token = generateToken(newUser._id);

    // Send the token in the response
    sendTokenResponse(newUser, token, res);
  } catch (error) {
    // Handle token expiration
    if (error.name === "TokenExpiredError") {
      return res.redirect("/signin"); // Redirect to the sign-in page
    }
    next(error);
  }
};

// Function to generate a JWT token
const generateToken = userId => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "1d"
  });
};

// Function to send the token in the response
const sendTokenResponse = (user, token, res) => {
  const { password, ...rest } = user._doc;

  res
    .cookie("access_token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // Expires in 1 day
      sameSite: "None",
      secure: process.env.NODE_ENV === "production"
    })
    .status(200)
    .json({
      ...rest,
      access_token: token
    });
};

export const signout = (req, res) => {
  res.clearCookie("access_token").status(200).json("Signout success!");
};
