import "dotenv/config";


const requiredEnv =
  (
    name: string,
  ): string => {
    const value =
      process.env[name];

    if (!value) {
      throw new Error(
        `Missing required environment variable: ${name}`,
      );
    }

    return value;
  };


export const env = {
  NODE_ENV:
    process.env.NODE_ENV ??
    "development",

  PORT: Number(
    process.env.PORT ??
      8000,
  ),

  DATABASE_URL:
    requiredEnv(
      "DATABASE_URL",
    ),

  JWT_SECRET:
    requiredEnv(
      "JWT_SECRET",
    ),

  JWT_EXPIRES_IN:
    process.env.JWT_EXPIRES_IN ??
    "1d",

  FRONTEND_URL:
    process.env.FRONTEND_URL ??
    "http://localhost:5173",
};