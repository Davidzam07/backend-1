import { UserDAO } from "../dao/user.dao.js";

export class UserRepository {
  constructor(dao = new UserDAO()) {
    this.dao = dao;
  }

  findByEmail(email) {
    return this.dao.findByEmail(email);
  }

  findById(id) {
    return this.dao.findById(id);
  }

  findByResetToken(tokenHash) {
    return this.dao.findByResetToken(tokenHash);
  }

  create(userData) {
    return this.dao.create(userData);
  }

  updateById(id, data) {
    return this.dao.updateById(id, data);
  }

  updateResetTokenByEmail(email, data) {
    return this.dao.updateOne({ email }, data);
  }

  findAll() {
    return this.dao.findAll();
  }

  deleteById(id) {
    return this.dao.deleteById(id);
  }
}

