import express from "express";
import dotenv from "dotenv";
import router from "./routes/index";
import connectMongo from "./database/mongo";
import morgan from "morgan";
import cors from "cors"; // 👈 ДОДАТИ

dotenv.config();
connectMongo();

declare global {
  namespace Express {
    interface Request { user?: { id: string; }; userID?: string; }
  }
}
const app = express();

// ✅ CORS — ОБОВʼЯЗКОВО ПЕРШИМ
app.use(cors());



app.use(morgan("dev"));
app.use(express.json());

// ⬇️ РОУТИ ПІСЛЯ CORS
app.use("/api", router);

app.listen(
  Number(process.env.PORT),
  "0.0.0.0",
  () => console.log("Server started")
);
