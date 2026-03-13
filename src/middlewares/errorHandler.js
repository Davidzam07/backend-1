export const notFoundHandler = (req, res) => {
  res.status(404).json({ status: "error", error: "Ruta no encontrada" });
};

export const errorHandler = (err, req, res, next) => {
  const status = err?.statusCode || 500;
  res.status(status).json({
    status: "error",
    error: err?.message || "Error interno del servidor",
  });
};

