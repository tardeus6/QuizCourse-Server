import express from "express";
import dotenv from "dotenv";

dotenv.config(); // <--- load .env

const app = express();
app.use(express.json());

import("@/database/mongo");
import("@/database/redis");

app.listen(process.env.PORT, () => console.log("Server started"));
