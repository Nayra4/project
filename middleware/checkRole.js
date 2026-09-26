export function check_role(...roles){
    return (req,res,next)=>{
        //get role 
        const role=req.user.role
        
        
        if(roles.includes(role)){
            next()
        }
        else{
            res.status(403).json({ "error": "forbidden" })
        }
    }
}