// my name is yasik

import express ,{ Request , Response}from 'express';
import cors from 'cors';
import "dotenv/config";
import mongoose from 'mongoose';
import userRoutes from './routes/users';
import authRoutes from './routes/auth';
import cookieParser from 'cookie-parser';
import path from 'path';
import { v2 as cloudinary} from 'cloudinary';
import myHotelRoutes from './routes/my-hotels';
import hotelRoutes from'./routes/hotels';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,

});


//helps to connect to database 
mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string)

// this is for testing purpose to see test db is connected sucesfully or not 
// .then(()=>{
//     console.log("Connected to database: " , process.env.MONGODB_CONNECTION_STRING);
    
// });


const app = express(); // create an instance 
app.use(cookieParser());

app.use(express.json()) // helps to get api req. and convert it into json auto. 
app.use(express.urlencoded({extended:true})); // helps to parse the url to create parameteres
app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials:true,
})) // prevent certain request from certain url used for security purpose

app.use(express.static(path.join(__dirname,"../../frontend/dist")))

app.use("/api/auth",authRoutes);
app.use("/api/users",userRoutes)  // whenever user goes /api/users pass the request on user routes
app.use("/api/my-hotels",myHotelRoutes);
app.use("/api/hotels", hotelRoutes);


//  This line defines a route handler for the GET request to the /api/test endpoint. 
//When a GET request is made to this endpoint,
// the provided callback function is executed.
// The req object represents the incoming request, 
//and the res object is used to send a response back to the client.

app.get("*" ,(req:Request , res : Response)=>{
    res.sendFile(path.join(__dirname,"../../frontend/dist/index.html"));
});


app.listen(2000,()=>{
    console.log("server is rumnning");
    
})


