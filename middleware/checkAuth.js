import { createDB } from "../db.js"
const db=createDB()
export const checkAuth=async(req,res,next)=>{
        const token =req.cookies.node_api_token

        try{
        //check if i have this session un my database

        req.user=jwt.verify(token,process.env.JWT_SECRET)

            return next()
        }
        catch{
            return res.status(401).json({ error: "invalid token" })
        }
}