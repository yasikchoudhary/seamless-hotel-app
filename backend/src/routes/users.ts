import express,{Request , Response} from 'express';
import User from '../models/user';
import jwt from "jsonwebtoken";
import { check, validationResult } from 'express-validator';

const router = express.Router();


// /api/users/register

router.post("/register",[
    check("firstName","first name is required").isString(),
    check("lastName","last name is required").isString(),
    check("email","email is required").isEmail(),
    check("password","password with 6 or more characters is required").isLength({min:6}),
],async (req: Request, res: Response)=>{
    
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ message: errors.array()});
    }
    try {
        let user = await User.findOne({

            email:req.body.email,          // checking if user provided mail is same or not 
        });
        if(user){
            return res.status(400).json({message: "user already exists"});   // if no 
        }

        user = new User(req.body);   // if yes 
        await user.save();
      

        // making jwt token

        const token = jwt.sign({userId : user.id},process.env.JWT_SECRET_KEY as string , {
            expiresIn: "1d"
        });

        // maiking respone cookie

        res.cookie("auth_token" , token , {
            httpOnly : true,
            secure: process.env.NODE_ENV === "production",
            maxAge:86400000,
        })
        return res.status(200).send({message: "User registered OK"})


    } catch (error) {
        res.status(500).send({message: "Something went wrong"});   
        
    }



});


export default router;