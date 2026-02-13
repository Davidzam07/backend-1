import "dotenv/config";
import express from "express";
import cors from "cors";
import passport from "passport";
import { connectDB } from "./config/db.js";
import { initializePassport } from "./config/passport.config.js";
import usersRouter from "./routes/users.router.js";
import sessionsRouter from "./routes/sessions.router.js";
import "./models/cart.model.js"; // registra el modelo de carts para los populate

const app = express();
const PORT = process.env.PORT || 8080;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Passport
initializePassport();
app.use(passport.initialize());

// Rutas
app.use("/api/users", usersRouter);
app.use("/api/sessions", sessionsRouter);

// Ruta base
app.get("/", (req, res) => {
  res.json({ status: "success", message: "API Ecommerce funcionando" });
});

// Iniciar servidor
const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
  });
};

startServer();

