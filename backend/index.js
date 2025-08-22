import express from "express";
import cors from "cors";
import "dotenv/config";
import helmet from 'helmet'
import xss from 'xss-clean'
import { redisClient } from "./config/redis.js";
import { pool } from "./config/database.js";
import cookieParser from "cookie-parser";
const PORT = process.env.PORT || 3000;
import authRouter from "./routes/auth.route.js";
import analyticsRouter from "./routes/analyticsRoutes.route.js";
import transactionRouter from "./routes/transactionRoutes.route.js";
const app = express();
app.use(helmet());
// app.use(xss());
app.use(express.json());
const corsOptions = {
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser())
redisClient.on('error', err => console.error('Redis error:', err));
app.use("/api/auth", authRouter)
app.use("/api/analytics",analyticsRouter)
app.use("/api/transactions", transactionRouter)
pool.getConnection()
  .then(conn => {
    console.log('MySQL connected');
    conn.release();
  })
  .catch(err => console.error('DB connection error:', err));
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})
