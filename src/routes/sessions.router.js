import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.model.js";
import { createHash } from "../utils/crypto.js";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "secretJWTdesarrollo";

// Registro de usuario
router.post("/register", async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;

    if (!first_name || !last_name || !email || !age || !password) {
      return res.status(400).json({ status: "error", error: "Faltan campos obligatorios" });
    }

    const exists = await UserModel.findOne({ email });
    if (exists) {
      return res.status(409).json({ status: "error", error: "El email ya está registrado" });
    }

    const hashedPassword = createHash(password);

    const newUser = await UserModel.create({
      first_name,
      last_name,
      email,
      age,
      password: hashedPassword,
    });

    res.status(201).json({ status: "success", payload: newUser });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
});

// Login: autentica con Passport local y genera JWT
router.post(
  "/login",
  passport.authenticate("login", { session: false, failWithError: true }),
  async (req, res) => {
    try {
      const user = req.user;

      const tokenPayload = {
        user: {
          _id: user._id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          age: user.age,
          role: user.role,
        },
      };

      const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: "1h" });

      res.json({
        status: "success",
        message: "Login exitoso",
        token,
      });
    } catch (error) {
      res.status(500).json({ status: "error", error: error.message });
    }
  },
  // Manejo de error de Passport (usuario/contraseña inválidos)
  (err, req, res, next) => {
    if (err || !req.user) {
      return res.status(401).json({
        status: "error",
        error: err?.message || "Credenciales inválidas",
      });
    }
    next();
  }
);

// Endpoint /current que utiliza la estrategia "current" de Passport con JWT
router.get(
  "/current",
  passport.authenticate("current", { session: false, failWithError: true }),
  (req, res) => {
    // Si llega aquí, el token es válido y req.user contiene al usuario
    const user = req.user;
    res.json({
      status: "success",
      payload: {
        _id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        age: user.age,
        role: user.role,
      },
    });
  },
  (err, req, res, next) => {
    // Manejo de token inválido o inexistente
    return res.status(401).json({
      status: "error",
      error: err?.message || "Token inválido o no provisto",
    });
  }
);

export default router;

