import mongoose from "mongoose";

const productCollection = "products";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0 },
    code: { type: String, required: true, unique: true, trim: true },
    category: { type: String, required: true, trim: true },
    status: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const ProductModel = mongoose.model(productCollection, productSchema);

