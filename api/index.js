import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoute from "./routes/auth.route.js"
import bushRoute from "./routes/buses.route.js"
import userRoute from "./routes/user.route.js"
import cookieParser from 'cookie-parser';
import path from "path";




dotenv.config();

mongoose.connect(process.env.MONGO).then(()=>{
    console.log('Connected to MongoDB')
}).catch((err)=>{
    console.log(err)
});


const __dirname = path.resolve();
const app = express();



app.use(cookieParser());

app.use(express.json());
app.use(express.static(path.join(__dirname,"Frontend/dist")));
app.get('*',(req,res)=>{
    res.sendFile(path.join(__dirname,'Frontend' , 'dist' , 'index.html'));
})

app.listen(3000,()=>{
    console.log("Server is Running on Port 3000")
})

app.use("/api/auth",authRoute);
app.use("/api/buses",bushRoute);
app.use("/api/user",userRoute);

app.use((err,req,res,next)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
        success:false,
        message,
        statusCode
    });
})

