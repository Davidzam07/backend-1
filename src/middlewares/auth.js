import passport from "passport";

// Autenticación por JWT (usa la estrategia "jwt" de Passport)
export const authJwt = passport.authenticate("jwt", {
  session: false,
  failWithError: true,
});

// Autorización por rol (por ejemplo: ["admin"])
export const authorizeRoles = (roles = []) => {
  return (req, res, next) => {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({
          status: "error",
          error: "Usuario no autenticado",
        });
      }

      if (!roles.includes(user.role)) {
        return res.status(403).json({
          status: "error",
          error: "No tienes permisos para realizar esta acción",
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        status: "error",
        error: error.message,
      });
    }
  };
};

