import { CartModel } from "../models/cart.model.js";

export class CartDAO {
  create(data = {}) {
    return CartModel.create(data);
  }

  findById(id) {
    return CartModel.findById(id).populate("products.product");
  }

  updateById(id, data) {
    return CartModel.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }
}

