export const env = {
  port: Number(process.env.PORT || 8080),
  mongoUrl: process.env.MONGO_URL || "mongodb://localhost:27017",
  mongoDbName: process.env.MONGO_DB_NAME || "ecommerce",
  jwtSecret: process.env.JWT_SECRET || "secretJWTdesarrollo",
  baseUrl: process.env.BASE_URL || `http://localhost:${process.env.PORT || 8080}`,
  mail: {
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT ? Number(process.env.MAIL_PORT) : undefined,
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
    from: process.env.MAIL_FROM || "no-reply@ecommerce.local",
  },
};

