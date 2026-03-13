import { ProductDAO } from "../dao/product.dao.js";

export class ProductRepository {
  constructor(dao = new ProductDAO()) {
    this.dao = dao;
  }

  findAll() {
    return this.dao.findAll();
  }

  findById(id) {
    return this.dao.findById(id);
  }

  findByCode(code) {
    return this.dao.findByCode(code);
  }

  create(data) {
    return this.dao.create(data);
  }

  updateById(id, data) {
    return this.dao.updateById(id, data);
  }

  deleteById(id) {
    return this.dao.deleteById(id);
  }
}

