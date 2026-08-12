import app from "./app.js";
import { env } from "./config/env.js";
import { prisma } from "./src/config/database.js";

const server = app.listen(
  env.PORT,
  () => {
    console.log(
      `🚀 Mini ERP CRM API running on http://localhost:${env.PORT}`,
    );
  },
);

const shutdown = async () => {
  console.log(
    "\nShutting down server...",
  );

  server.close(
    async () => {
      await prisma.$disconnect();

      console.log(
        "Database connection closed.",
      );

      console.log(
        "Server closed.",
      );

      process.exit(0);
    },
  );
};

process.on(
  "SIGINT",
  shutdown,
);

process.on(
  "SIGTERM",
  shutdown,
);