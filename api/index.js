import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoute from "./routes/auth.route.js"
import bushRoute from "./routes/buses.route.js"

dotenv.config();

mongoose.connect(process.env.MONGO).then(()=>{
    console.log('Connected to MongoDB')
}).catch((err)=>{
    console.log(err)
});


const app = express();
app.use(express.json());

app.listen(3000,()=>{
    console.log("Server is Running on Port 3000")
})

app.use("/api/auth",authRoute);
app.use("/api/buses",bushRoute);