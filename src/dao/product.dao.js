import { ProductModel } from "../models/product.model.js";

export class ProductDAO {
  findAll() {
    return ProductModel.find();
  }

  findById(id) {
    return ProductModel.findById(id);
  }

  findByCode(code) {
    return ProductModel.findOne({ code });
  }

  create(data) {
    return ProductModel.create(data);
  }

  updateById(id, data) {
    return ProductModel.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  deleteById(id) {
    return ProductModel.findByIdAndDelete(id);
  }
}

