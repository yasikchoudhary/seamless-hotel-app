import express,{Request , Response} from "express";
import { check, validationResult } from 'express-validator';
import User from "../models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { verify } from "crypto";
import verifyToken from "../middleware/auth";


const router = express.Router();


router.post("/login" , [
    check("email","email is required").isEmail(),
    check("password","password with 6 or more characters is required").isLength({min:6}),

  ] , async(req : Request , res: Response)=>{

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({ message: errors.array()});
    }

    const{email,password} = req.body;

    try {
           // checking user email and password 
        // fething user details 
        const user  = await User.findOne({email});

        if(!user){
            return res.status(400).json({message:"Invalid Credentials"});
        }

        const isMatch = await bcrypt.compare(password , user.password);  // bcryping given password and coparing with user password 
       
        if(!isMatch){
            return res.status(400).json({message:"Invalid Credentials"});
        }

        // converting it into http cookie 

        const token = jwt.sign({userId : user.id},process.env.JWT_SECRET_KEY as string , {
            expiresIn: "1d"
        });

        // sending cookie

        res.cookie("auth_token" , token , {
            httpOnly : true,
            secure: process.env.NODE_ENV === "production",
            maxAge:86400000,
        })
        return res.status(200).json({userId:user._id});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "something went wrong"});
    }
  });

  router.get("/validate-token",verifyToken, (req: Request , res: Response)=>{
         res.status(200).send({userId : req.userId})
  })

  // verify troke check if that cookie passes or not 

  router.post("/logout" , (req: Request , res: Response)=>{

    res.cookie("auth_token" , "",{
        expires: new Date(0),
    });

    res.send();

  });

  export default router;