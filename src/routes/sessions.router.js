import { Router } from "express";
import passport from "passport";
import {
  register,
  login,
  current,
  forgotPassword,
  resetPassword,
  resetPasswordPage,
} from "../controllers/sessions.controller.js";

const router = Router();

router.post("/register", register);

router.post(
  "/login",
  passport.authenticate("login", { session: false, failWithError: true }),
  login,
  (err, req, res, next) => {
    return res.status(401).json({
      status: "error",
      error: err?.message || "Credenciales inválidas",
    });
  }
);

router.get(
  "/current",
  passport.authenticate("current", { session: false, failWithError: true }),
  current,
  (err, req, res, next) => {
    return res.status(401).json({
      status: "error",
      error: err?.message || "Token inválido o no provisto",
    });
  }
);

router.post("/forgot-password", forgotPassword);
router.get("/reset-password", resetPasswordPage);
router.post("/reset-password", resetPassword);

export default router;

