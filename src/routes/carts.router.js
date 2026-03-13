import { Router } from "express";
import { createCart, getCart, addProduct, purchase } from "../controllers/carts.controller.js";
import { requireCurrent, authorize } from "../middlewares/authorization.js";

const router = Router();

router.post("/", createCart);
router.get("/:cid", getCart);

// Solo el user puede agregar productos a su carrito
router.post("/:cid/products/:pid", requireCurrent, authorize(["user"]), addProduct);

// Purchase: el user compra su carrito (genera ticket)
router.post("/:cid/purchase", requireCurrent, authorize(["user"]), purchase);

export default router;

