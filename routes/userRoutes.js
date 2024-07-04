const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { UserModel } = require("../models/userModel");
const { BlackModel } = require("../models/blacklistModel");

const userRouter = express.Router();

userRouter.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    let user = await UserModel.findOne({ email });
    console.log(user);
    if (!user) {
      bcrypt.hash(password, 10, async (err, hash) => {
        console.log(err);
        if (err) {
          return res
            .status(400)
            .json({ msg: "Something Went Wrong, Try again..." });
        } else {
          let user = new UserModel({ username, email, password: hash });
          await user.save();
          return res
            .status(201)
            .json({ msg: "Account created Successfully!!" });
        }
      });
    } else {
      return res
        .status(400)
        .json({ msg: "This email is already registered!!" });
    }
  } catch (error) {
    return res.status(500).json({ msg: "Internal Server Error, Try Again..." });
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await UserModel.findOne({ email });
    if (user) {
      bcrypt.compare(password, user.password, async (err, result) => {
        if (result) {
          let token = jwt.sign(
            { userId: user._id, name: user.username },
            process.env.SECERETKEY,
            { expiresIn: "2d" }
          );
        
          res
            .status(200)
            .json({
              msg: "Logged in successfully!!",
              token,
              name: user.username,
            });

          setTimeout(async () => {
            try {
              const blackToken = new BlackModel({ token: token });
              await blackToken.save();
              res.clearCookie();
            } catch (error) {}
          }, 2 * 24 * 60 * 60 * 1000);
        } else {
          return res.status(400).json({ msg: "Your Password is Wrong!!" });
        }
      });
    } else {
      return res
        .status(400)
        .json({ msg: "Your email is not exists or wrong!!" });
    }
  } catch (error) {
    return res.status(500).json({ msg: "Internal Server Error, Try Again..." });
  }
});

userRouter.post("/logout", async (req, res) => {
  let { token } = req.body;
  console.log(req.body);
  try {
    if (token) {
      const blackToken = new BlackModel({ token: token });
      await blackToken.save();
  
      res.status(200).send({ msg: "Logged out successfully!!" });
    } else {
      res.status(400).send({ msg: "Something went wrong!!" });
    }
  } catch (error) {
    res.status(500).send({ msg: "Server Internal Error, Try again..." });
  }
});

module.exports = { userRouter };
