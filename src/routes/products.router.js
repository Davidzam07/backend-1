import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from "../controllers/products.controller.js";
import { requireCurrent, authorize } from "../middlewares/authorization.js";

const router = Router();

router.get("/", getProducts);
router.get("/:pid", getProductById);

// Solo admin puede crear, actualizar y eliminar productos
router.post("/", requireCurrent, authorize(["admin"]), createProduct);
router.put("/:pid", requireCurrent, authorize(["admin"]), updateProduct);
router.delete("/:pid", requireCurrent, authorize(["admin"]), deleteProduct);

export default router;

