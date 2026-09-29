import { createDB } from "../db.js"
import jwt  from "jsonwebtoken"
const db=createDB()
export const checkAuth=async(req,res,next)=>{
    
    const token =req.cookies.node_api_token
    if(!token){
        return res.status(401).json({ error: "token doesnot exist" })
    }
    try{
        req.user=jwt.verify(token,process.env.JWT_SECRET)
            return next()
        }
        catch{
            return res.status(401).json({ error: "invalid_token" })
        }
}