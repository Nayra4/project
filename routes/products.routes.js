import { Router } from "express"
import { createDB } from "../db.js"
import { validate } from "../middleware/validateBody.js"
import {product_sch} from "../schema/product.schema.js"
import {check_auth} from "../middleware/checkAuth.js"
import {check_role} from "../middleware/checkRole.js"
export const product_app=Router()
const db =createDB()
product_app.get("/",async(req,res)=>{ 
    res.status(200).json( await db.getAll("products"))
})
product_app.get("/:id",async(req,res)=>{
    const id =req.params.id
    const data=await db.getById("products",id)
    if(!data){
        return res.status(404).json({ "error": "product not found" })
    }
    res.status(200).json(data)
})
product_app.get("/",async(req,res)=>{
    const name =req.query.search 
    const data=await db.getOne("products",name)
    if(!data){
        return res.status(404).json({ "error": "product not found" })
    }
    res.status(200).json(data)
})
product_app.post("/",check_auth,check_role("merchant"),validate(product_sch),async(req,res)=>{
    await db.create("products",req.body)
    res.status(201).json({
    "message": "product created successfully",
    "data": { "id": "string", "name": "...", "description": "...", "price": "...", "image": "..." }
    })
}) 
product_app.patch("/:id",check_auth,check_role("merchant"),async(req,res)=>{
    //check if exist in database
    const id=req.params.id
    const exist =await db.getById("products",id)
    if(!exist){
        return res.status(404).json({"error":"not found "})
    }
    await db.update("products",req.body)
    res.status(200).json({
    "message": "product updated successfully",
    "data": req.body 
})
})
product_app.delete("/:id",check_auth,check_role("merchant"),async(req,res)=>{
    const id=req.params.id
    const exist =await db.getById("products",id)
    if(!exist){
        return res.status(404).json({"error":"not found "})
    }
    await db.delete("products",id)
    res.status(204).json({massage:"no body"})
})