import { Router } from "express"
import { validate } from "../middleware/validateBody.js"
import {register_sch} from "../schema/auth/register.schema.js"
import { createDB } from "../db.js"
import bcrypt from "bcrypt"
import {login_shc} from "../schema/auth/login.schema.js"
import crypto from "crypto"
import  jwt  from "jsonwebtoken"

process.loadEnvFile()

const db=createDB()
export const authRouter=Router()
process.loadEnvFile()
authRouter.post("/register",validate(register_sch),async(req,res)=>{
    //validate body

    //check email is uniqe
    const data =await db.getAll("auth_users")
    const checking=data.find((x)=>x.email===req.body.email)
    
    
    if(checking){
        return res.status(422).json({
    "errors": {
    "email": { "errors": ["email already in use"] },
    "password": { "errors": ["password must contain..."] }
    }
    })
}
    //hash passwod 
    const hash=await bcrypt.hash(req.body.password,10)
    //store data 
await db.create("auth_users",{
    username:req.body.username,
    email:req.body.email,
    password:hash ,
    role:req.body.role
    })
    res.status(201).json({ "message": "register successful, you can now login" })

    
})
    authRouter.post("/login", validate(login_shc), async (req, res) => {
    //chack the email existing in db

    const data = await db.getAll("auth_users");
    const checking = data.find((x) => x.email === req.body.email);
    if (!checking) {
        res.status(422).json({ error: "email or password are invalid" });
    }
    //check password
    const check_pass = bcrypt.compare(req.body.password, checking.password);
    if (!check_pass) {
        res.status(422).json({ error: "email or password are invalid" });
    }

    //create token

    const token = jwt.sign(
        { id: checking.id, role: checking.role, email: checking.email },
        process.env.JWT_SECRET,
        {
        expiresIn: "1h",
        },
    );

    res.cookie("node_api_token", token, {
        httpOnly: "true",
    });

    res.status(200).json({
        "message": "login successful",
        "data": {
        "user": {
            "id": checking.id,
            "email": checking.email,
            "username": checking.username,
            "role": checking.role,
        },
        },
    });
    });


authRouter.post("/logout",async(req,res)=>{

    res.clearCookie("node_api_token")
    return res.status(200).json({ "message": "logout successful" })
})
