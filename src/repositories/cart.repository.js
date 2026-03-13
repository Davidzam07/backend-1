import { CartDAO } from "../dao/cart.dao.js";

export class CartRepository {
  constructor(dao = new CartDAO()) {
    this.dao = dao;
  }

  create() {
    return this.dao.create({ products: [] });
  }

  findById(id) {
    return this.dao.findById(id);
  }

  updateById(id, data) {
    return this.dao.updateById(id, data);
  }
}

