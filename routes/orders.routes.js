import { Router } from "express";
import { createDB } from "../db.js";

export const ordersRouter=Router()
const db=createDB()

ordersRouter.get("/",async(req,res)=>{
    res.status(200).json(await db.getAll("orders"))
})
ordersRouter.post("/checkout",async(req,res)=>{
    const data =await db.getAll("carts")
    const cart=data.find((x)=>x.userId==req.user.id)
    if(!cart){
        res.status(422).json({ "error": "cart is empty" })
    }
    await db.delete("carts",cart.id)
    res.status(201).json({
    "message": "order placed successfully",
    "data": cart} )

})