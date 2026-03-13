import { UserModel } from "../models/user.model.js";

export class UserDAO {
  findByEmail(email) {
    return UserModel.findOne({ email });
  }

  findById(id) {
    return UserModel.findById(id);
  }

  findByResetToken(tokenHash) {
    return UserModel.findOne({
      resetPasswordToken: tokenHash,
      resetPasswordExpires: { $gt: new Date() },
    });
  }

  create(data) {
    return UserModel.create(data);
  }

  updateById(id, data) {
    return UserModel.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  updateOne(filter, data) {
    return UserModel.updateOne(filter, data);
  }

  findAll() {
    return UserModel.find();
  }

  deleteById(id) {
    return UserModel.findByIdAndDelete(id);
  }
}

