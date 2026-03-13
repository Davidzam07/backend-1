import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { createHash } from "../utils/crypto.js";
import { UserRepository } from "../repositories/user.repository.js";
import { UserCurrentDTO } from "../dtos/userCurrent.dto.js";
import { PasswordResetService } from "../services/passwordReset.service.js";

const userRepository = new UserRepository();
const passwordResetService = new PasswordResetService(userRepository);

export const register = async (req, res, next) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;
    if (!first_name || !last_name || !email || !age || !password) {
      return res.status(400).json({ status: "error", error: "Faltan campos obligatorios" });
    }

    const exists = await userRepository.findByEmail(email);
    if (exists) {
      return res.status(409).json({ status: "error", error: "El email ya está registrado" });
    }

    const hashedPassword = createHash(password);
    const newUser = await userRepository.create({
      first_name,
      last_name,
      email,
      age,
      password: hashedPassword,
    });

    res.status(201).json({ status: "success", payload: new UserCurrentDTO(newUser) });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
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
    const token = jwt.sign(tokenPayload, env.jwtSecret, { expiresIn: "1h" });
    res.json({ status: "success", message: "Login exitoso", token });
  } catch (err) {
    next(err);
  }
};

export const current = async (req, res) => {
  res.json({ status: "success", payload: new UserCurrentDTO(req.user) });
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ status: "error", error: "Email requerido" });
    const result = await passwordResetService.requestReset(email);
    res.json({ status: "success", payload: result });
  } catch (err) {
    next(err);
  }
};

export const resetPasswordPage = async (req, res) => {
  const { token } = req.query;
  if (!token) return res.status(400).send("Token requerido");

  res.setHeader("Content-Type", "text/html");
  res.send(`<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Restablecer contraseña</title>
  </head>
  <body style="font-family: Arial, sans-serif; margin: 32px; max-width: 520px;">
    <h2>Restablecer contraseña</h2>
    <form id="form">
      <label>Nueva contraseña</label>
      <input id="pw" type="password" required style="display:block;width:100%;padding:10px;margin:8px 0 12px;" />
      <button type="submit" style="padding:10px 14px;">Guardar</button>
    </form>
    <pre id="out" style="white-space: pre-wrap;"></pre>
    <script>
      const token = ${JSON.stringify(String(token))};
      const form = document.getElementById('form');
      const out = document.getElementById('out');
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const newPassword = document.getElementById('pw').value;
        const r = await fetch('/api/sessions/reset-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, newPassword })
        });
        const data = await r.json().catch(() => ({}));
        out.textContent = JSON.stringify(data, null, 2);
      });
    </script>
  </body>
</html>`);
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ status: "error", error: "Token y newPassword requeridos" });
    }
    const result = await passwordResetService.resetPassword({ token, newPassword });
    res.json({ status: "success", payload: result });
  } catch (err) {
    next(err);
  }
};

