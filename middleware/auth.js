const jwt = require("jsonwebtoken");
const { BlackModel } = require("../models/blacklistModel");

const auth = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
    let black = await BlackModel.findOne({ token: token });
    if (!black) {
      jwt.verify(token, "manikant", (err, decoded) => {
        if (decoded) {
          req.body = {
            ...req.body,
            userID: decoded.userId,
            user: decoded.name,
          };
          next();
        } else {
          res.status(400).send({ msg: "Please Login First!!" });
        }
      });
    } else {
      res.status(400).send({ msg: "Please Login First!!" });
    }
  } else {
    res.status(400).send({ msg: "Please Login First!!" });
  }
};

module.exports = { auth };
