import { CartsService } from "../services/carts.service.js";

const cartsService = new CartsService();

export const createCart = async (req, res, next) => {
  try {
    const cart = await cartsService.createCart();
    res.status(201).json({ status: "success", payload: cart });
  } catch (err) {
    next(err);
  }
};

export const getCart = async (req, res, next) => {
  try {
    const { cid } = req.params;
    const cart = await cartsService.getCartById(cid);
    if (!cart) return res.status(404).json({ status: "error", error: "Carrito no encontrado" });
    res.json({ status: "success", payload: cart });
  } catch (err) {
    next(err);
  }
};

export const addProduct = async (req, res, next) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    const updated = await cartsService.addProductToCart({ cid, pid, quantity: quantity ?? 1 });
    res.json({ status: "success", payload: updated });
  } catch (err) {
    next(err);
  }
};

export const purchase = async (req, res, next) => {
  try {
    const { cid } = req.params;
    const purchaserEmail = req.user.email;
    const result = await cartsService.purchase({ cid, purchaserEmail });
    res.json({ status: "success", payload: result });
  } catch (err) {
    next(err);
  }
};

