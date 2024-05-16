import mongoose from "mongoose";
import bcrypt from "bcryptjs";
export type Usertype = {           //user schema which tells what properties we will store st goven doc.      
    _id:string;
    email: string;
    password: string;
    firstName: string;
    lastname: string;
};

const userSchema = new mongoose.Schema({
    email:{ type:String , required: true, unique:true},
    password:{type:String , required: true},
    firstName:{type:String , required: true},
    lastName:{type:String , required: true},
});

userSchema.pre("save",async function (next) {      // {need to be check} 

    if(this.isModified('password')){                         // if password is change then convert it into hash code 
        this.password = await bcrypt.hash(this.password,8)
    }
    next();
    
})

const User = mongoose.model<Usertype>("User",userSchema);

export default User;

 

