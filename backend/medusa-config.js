const dotenv = require("dotenv")

dotenv.config({ path: process.cwd() + "/.env" })

const DATABASE_URL = process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/medusa"

module.exports = {
  projectConfig: {
    databaseUrl: DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS || "http://localhost:3000,http://localhost:8000",
      adminCors: process.env.ADMIN_CORS || "http://localhost:3000,http://localhost:7001",
      authCors: process.env.AUTH_CORS || "http://localhost:3000,http://localhost:7001",
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },
  },
  admin: {
    backendUrl: process.env.MEDUSA_BACKEND_URL || "http://localhost:9000",
  },
  modules: {},
}

