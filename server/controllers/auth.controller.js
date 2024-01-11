import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

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
        sameSite: "None", // Set the sameSite attribute
        secure: process.env.NODE_ENV === "production" // Set secure based on your environment
      })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 1);

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d"
      });
      const { password: hashedPassword, ...rest } = user._doc;

      res
        .cookie("access_token", token, {
          httpOnly: true,
          expires: expiryDate,
          sameSite: "None", // Set the sameSite attribute
          secure: process.env.NODE_ENV === "production" // Set secure based on your environment
        })
        .status(200)
        .json(rest);
    } else {
      try {
        const generatedPassword =
          Math.random().toString(36).slice(-8) +
          Math.random().toString(36).slice(-8);
        const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

        const newUser = new User({
          username: req.body.name.split(" ").join("").toLowerCase(),
          email: req.body.email,
          password: hashedPassword,
          profilePicture: req.body.photo
        });

        await newUser.save();

        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 1);

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
          expiresIn: "1d"
        });
        const { password: hashedPassword2, ...rest } = newUser._doc;

        res
          .cookie("access_token", token, {
            httpOnly: true,
            expires: expiryDate,
            sameSite: "None", // Set the sameSite attribute
            secure: process.env.NODE_ENV === "production" // Set secure based on your environment
          })
          .status(200)
          .json(rest);
      } catch (error) {
        next(error);
      }
    }
  } catch (error) {
    next(error);
  }
};

export const signout = (req, res) => {
  res.clearCookie("access_token").status(200).json("Signout success!");
};
