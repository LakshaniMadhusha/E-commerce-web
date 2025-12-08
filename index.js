import express from "express"
import mongoose from  "mongoose";
import bodyParser from "body-parser";
import userRouter from "./routers/userRouter.js"
import productRouter from "./routers/productRouter.js"
import jwt from "jsonwebtoken";
import studentRouter from "./routers/studentRouter.js";


const app=express();

app.use(bodyParser.json());
 
app.use((req, res, next) => {
    const value = req.header("Authorization");

    if (value != null) {
        const token = value.replace("Bearer ", "");

        jwt.verify(token, "cbc-6503", (err, decoded) => {
            if (err || decoded == null) {
                return res.status(403).json({ message: "Unauthorized" });
            }

            req.user = decoded;
            return next();     // go forward
        });

    } else {
        next(); // no token → continue
    }
});


const ConnectionString="mongodb+srv://admin123:123@cluster0.261ebm6.mongodb.net/?appName=Cluster0"
mongoose.connect(ConnectionString).then(
    ()=>{
        console.log("Database cconnection")
    }
).catch(
    ()=>{
        console.log("failed to connect to the database")
    }
)



app.use("/api/students",studentRouter)
app.use("/api/users",userRouter)
app.use("/api/products",productRouter)

app.listen(5000, 
    ()=>{
        console.log("server started")
    }
)

