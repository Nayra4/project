import { createDB } from "../db.js"
const db=createDB()
export const check_auth=async(req,res,next)=>{
        const session_id =req.cookies.node_api_session

        try{
        //check if i have this session un my database
        const data =await db.getAll("session")
        const session=data.find((s)=>s.sessionid===session_id)

        if(!session){
            return res.status(401).json({ error: "invalid token" })
        }  
        req.user=session
            next()
        }
        catch{
            return res.status(401).json({ error: "invalid token" })
        }
}