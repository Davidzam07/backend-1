import crypto from "crypto";
import bcrypt from "bcrypt";
import { UserRepository } from "../repositories/user.repository.js";
import { createHash } from "../utils/crypto.js";
import { env } from "../config/env.js";
import { sendMail } from "../config/mailer.js";

export class PasswordResetService {
  constructor(userRepository = new UserRepository()) {
    this.userRepository = userRepository;
  }

  async requestReset(email) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      return { message: "Si el email existe, se enviará un correo de recuperación." };
    }

    const tokenPlain = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(tokenPlain).digest("hex");
    const expires = new Date(Date.now() + 60 * 60 * 1000);

    await this.userRepository.updateById(user._id, {
      resetPasswordToken: tokenHash,
      resetPasswordExpires: expires,
    });

    const resetLink = `${env.baseUrl}/api/sessions/reset-password?token=${tokenPlain}`;

    const { previewUrl } = await sendMail({
      to: user.email,
      subject: "Recuperación de contraseña",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.4">
          <h2>Restablecer contraseña</h2>
          <p>Este enlace expira en 1 hora.</p>
          <p>
            <a href="${resetLink}" style="display:inline-block;padding:10px 14px;background:#111827;color:#fff;text-decoration:none;border-radius:6px">
              Restablecer contraseña
            </a>
          </p>
          <p>Si no solicitaste esto, ignora este correo.</p>
        </div>
      `,
      text: `Restablecer contraseña (expira en 1 hora): ${resetLink}`,
    });

    return {
      message: "Si el email existe, se enviará un correo de recuperación.",
      previewUrl,
    };
  }

  async resetPassword({ token, newPassword }) {
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const user = await this.userRepository.findByResetToken(tokenHash);
    if (!user) {
      const err = new Error("Token inválido o expirado");
      err.statusCode = 400;
      throw err;
    }

    // evita que la nueva contraseña sea igual a la anterior
    // (user.password ya es hash bcrypt)
    const isSame = bcrypt.compareSync(newPassword, user.password);
    if (isSame) {
      const err = new Error("La nueva contraseña no puede ser igual a la anterior");
      err.statusCode = 400;
      throw err;
    }

    const newHash = createHash(newPassword);
    await this.userRepository.updateById(user._id, {
      password: newHash,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    });

    return { message: "Contraseña actualizada correctamente" };
  }
}

