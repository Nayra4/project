import z from "zod"
export const validate=(schema)=>{
    return (req,res,next)=>{
        const body =req.body
        const v=schema.safeParse(body)
        if(v.success){
            next()
        }
        else{
            res.status(400).json({
                error:z.treeifyError(v.error)
            })
        }
    }
}