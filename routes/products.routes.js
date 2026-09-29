import { Router } from "express"
import { createDB } from "../db.js"
import { validate } from "../middleware/validateBody.js"
import {product_sch} from "../schema/product.schema.js"
import {checkAuth} from "../middleware/checkAuth.js"
import {checkRole} from "../middleware/checkRole.js"

export const productsRouter=Router()
const db =createDB()
productsRouter.get("/", async (req, res) => {

    let products = await db.getAll("products")
    const q = req.query.search?.toLowerCase()
    if (q) {
        products = products.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
        )
    }
    return res.status(200).json({ data: products })
    })
productsRouter.get("/:id",async(req,res)=>{
    const id =req.params.id
    const data=await db.getById("products",id)
    if(!data){
        return res.status(404).json({ "error": "product not found" })
    }
    return res.status(200).json(data)
})

productsRouter.post("/",checkAuth,checkRole("merchant"),validate(product_sch),async(req,res)=>{
    await db.create("products",req.body)
    return res.status(201).json({
    "message": "product created successfully"
    })
}) 
productsRouter.patch("/:id",checkAuth,checkRole("merchant"),async(req,res)=>{
    //check if exist in database
    const id=req.params.id
    const exist =await db.getById("products",id)
    if(!exist){
        return res.status(404).json({"error":"not found "})
    }
    await db.update("products",id,req.body)
    return res.status(200).json({
    "message": "product updated successfully",
    "data": req.body 
})
})
productsRouter.delete("/:id",checkAuth,checkRole("merchant"),async(req,res)=>{
    const id=req.params.id
    const exist =await db.getById("products",id)
    if(!exist){
        return res.status(404).json({"error":"not found "})
    }
    await db.delete("products",id)
    res.status(204).json({massage:"no body"})
})