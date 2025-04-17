import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";


export const test = (req, res) => {
  res.json({
    message: 'hello from user controller',
  });
}

export const updateUserInfo = async (req, res, next) => {
  try {
    console.log("Token user ID:", req.user?.id);
    console.log("Param ID:", req.params?.id);

    if (req.user.id.toString() !== req.params.id.toString()) {
      return next(errorHandler(403, 'Forbidden'));
    }

    if (req.body.password) {
      req.body.password = bcrypt.hashSync(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
      }},
      { new: true }
    );

    if (!updatedUser) {
      return next(errorHandler(404, 'User not found'));
    }

    const { password, ...rest } = updatedUser._doc;
    return res.status(200).json(rest);

  } catch (error) {
    return next(error);
  }
};

