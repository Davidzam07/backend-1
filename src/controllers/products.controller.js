import { ProductRepository } from "../repositories/product.repository.js";

const productRepository = new ProductRepository();

export const getProducts = async (req, res, next) => {
  try {
    const products = await productRepository.findAll();
    res.json({ status: "success", payload: products });
  } catch (err) {
    next(err);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const { pid } = req.params;
    const product = await productRepository.findById(pid);
    if (!product) return res.status(404).json({ status: "error", error: "Producto no encontrado" });
    res.json({ status: "success", payload: product });
  } catch (err) {
    next(err);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const { title, description, price, stock, code, category, status } = req.body;
    if (!title || !description || price == null || stock == null || !code || !category) {
      return res.status(400).json({ status: "error", error: "Faltan campos obligatorios" });
    }
    const exists = await productRepository.findByCode(code);
    if (exists) return res.status(409).json({ status: "error", error: "El code ya existe" });
    const created = await productRepository.create({
      title,
      description,
      price,
      stock,
      code,
      category,
      status: status ?? true,
    });
    res.status(201).json({ status: "success", payload: created });
  } catch (err) {
    next(err);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { pid } = req.params;
    const updated = await productRepository.updateById(pid, req.body);
    if (!updated) return res.status(404).json({ status: "error", error: "Producto no encontrado" });
    res.json({ status: "success", payload: updated });
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const { pid } = req.params;
    const deleted = await productRepository.deleteById(pid);
    if (!deleted) return res.status(404).json({ status: "error", error: "Producto no encontrado" });
    res.json({ status: "success", payload: deleted });
  } catch (err) {
    next(err);
  }
};

