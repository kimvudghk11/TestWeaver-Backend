require("dotenv").config();

const config = {
    port: process.env.PORT || 4000,
    db: {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT || 3306),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    },
    jwt: {
        secret: process.env.JWT_SECRET || "dev-secret",
        expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    }
}