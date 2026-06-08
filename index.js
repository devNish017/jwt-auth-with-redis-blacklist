import express from "express";
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import userRoutes from "./routes/user.routes.js"
import cookieParser from "cookie-parser";
import {client} from "./config/redis.js"
import rateLimiter from "./middleware/rateLimiter.js";



const app=express();



app.use(express.json());
app.use(cookieParser())


app.use(rateLimiter);
app.use("/api",userRoutes);

app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "JWT Auth API is running 🚀"
  });
});

const PORT=process.env.PORT ||4000;
const mongoURL=process.env.URL;


const Initialize= async ()=>{
    try{
       await Promise.all([client.connect(),mongoose.connect(mongoURL)])
   
    console.log("Database and redis get connected...")
    
    app.listen(PORT,()=>{
    console.log(`server listening at PORT ${PORT}`)})    
   }
    catch(err){
        console.log(" connection failed ",err)
    }
}

Initialize();





