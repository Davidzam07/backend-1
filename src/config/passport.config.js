import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { UserModel } from "../models/user.model.js";
import { isValidPassword } from "../utils/crypto.js";
import { env } from "./env.js";

export const initializePassport = () => {
  // Estrategia Local para login por email/password
  passport.use(
    "login",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        session: false,
      },
      async (email, password, done) => {
        try {
          const user = await UserModel.findOne({ email });
          if (!user) {
            return done(null, false, { message: "Usuario no encontrado" });
          }

          if (!isValidPassword(user, password)) {
            return done(null, false, { message: "Contraseña incorrecta" });
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: env.jwtSecret,
  };

  // Estrategia JWT genérica para proteger rutas
  passport.use(
    "jwt",
    new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
      try {
        const user = await UserModel.findById(jwtPayload.user._id);
        if (!user) {
          return done(null, false, { message: "Usuario no encontrado" });
        }
        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    })
  );

  // Estrategia "current" que reutiliza JWT pero enfocada en extraer los datos actuales del usuario
  passport.use(
    "current",
    new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
      try {
        const user = await UserModel.findById(jwtPayload.user._id);
        if (!user) {
          return done(null, false, { message: "Usuario no encontrado" });
        }
        // Aquí podríamos filtrar campos sensibles si fuera necesario
        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    })
  );
};

