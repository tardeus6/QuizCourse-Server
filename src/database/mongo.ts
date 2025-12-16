import mongoose from "mongoose";



export default function connectMongo() {
  mongoose.connect(process.env.MONGO_URI as string)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.error("MongoDB Error:", err));
}
