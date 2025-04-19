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

export const deleteUser = async (req, res, next) => {
  try {
    if (req.user.id.toString()  !== req.params.id.toString()) {
      return next(errorHandler(403, 'You are not allowed to delete this account'));
    }

    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return next(errorHandler(404, 'User not found'));
    }
    res.clearCookie('access_token');
    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    return next(error);
  }
};

