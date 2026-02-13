import { Router } from "express";
import { UserModel } from "../models/user.model.js";
import { createHash } from "../utils/crypto.js";
import { authJwt, authorizeRoles } from "../middlewares/auth.js";

const router = Router();

// Obtener todos los usuarios (solo admin)
router.get("/", authJwt, authorizeRoles(["admin"]), async (req, res) => {
  try {
    const users = await UserModel.find().populate("cart");
    res.json({ status: "success", payload: users });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
});

// Obtener un usuario por ID (solo admin)
router.get("/:uid", authJwt, authorizeRoles(["admin"]), async (req, res) => {
  try {
    const { uid } = req.params;
    const user = await UserModel.findById(uid).populate("cart");
    if (!user) {
      return res.status(404).json({ status: "error", error: "Usuario no encontrado" });
    }
    res.json({ status: "success", payload: user });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
});

// Crear usuario desde el panel (solo admin) - crea el hash de la contraseña
router.post("/", authJwt, authorizeRoles(["admin"]), async (req, res) => {
  try {
    const { first_name, last_name, email, age, password, cart, role } = req.body;

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
      cart: cart || null,
      role: role || "user",
    });

    res.status(201).json({ status: "success", payload: newUser });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
});

// Actualizar usuario (solo admin)
router.put("/:uid", authJwt, authorizeRoles(["admin"]), async (req, res) => {
  try {
    const { uid } = req.params;
    const updateData = { ...req.body };

    // Si viene password, se vuelve a hashear
    if (updateData.password) {
      updateData.password = createHash(updateData.password);
    }

    const updatedUser = await UserModel.findByIdAndUpdate(uid, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ status: "error", error: "Usuario no encontrado" });
    }

    res.json({ status: "success", payload: updatedUser });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
});

// Eliminar usuario (solo admin)
router.delete("/:uid", authJwt, authorizeRoles(["admin"]), async (req, res) => {
  try {
    const { uid } = req.params;
    const deletedUser = await UserModel.findByIdAndDelete(uid);

    if (!deletedUser) {
      return res.status(404).json({ status: "error", error: "Usuario no encontrado" });
    }

    res.json({ status: "success", payload: deletedUser });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
});

export default router;

