import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017/ecommerce";
    await mongoose.connect(mongoUrl, {
      dbName: process.env.MONGO_DB_NAME || "ecommerce",
    });
    console.log("✅ Conectado a MongoDB");
  } catch (error) {
    console.error("❌ Error al conectar a MongoDB:", error.message);
    process.exit(1);
  }
};

