import passport from "passport";

export const requireCurrent = passport.authenticate("current", {
  session: false,
  failWithError: true,
});

export const authorize = (roles = []) => {
  return (req, res, next) => {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ status: "error", error: "No autenticado" });
    }
    if (!roles.includes(user.role)) {
      return res.status(403).json({ status: "error", error: "No autorizado" });
    }
    next();
  };
};

