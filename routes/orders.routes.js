import { Router } from "express";
import { createDB } from "../db.js";

export const ordersRouter=Router()
const db=createDB()

ordersRouter.get("/",async(req,res)=>{
    const orders=await db.getAll("orders")
    const order=orders.filter((x)=>x.userId===req.user.id)

    res.status(200).json({  "data": order}
)
})
ordersRouter.post("/checkout",async(req,res)=>{
    const data =await db.getAll("carts")
    const cart=data.find((x)=>x.userId==req.user.id)
    if(!cart){
        return res.status(422).json({ "error": "cart is empty" })
    }
    const t=cart.products.reduce((sum,product)=>{
        return sum+product.price*product.quantity
    },0)

    const order = await db.create("orders", {
    userId: req.user.id,
    products: cart.products,
    total:t,
    status: "pending",
    createdAt: new Date().toISOString(),
    })

    await db.delete("carts",cart.id)
    res.status(201).json({
    "message": "order placed successfully",
    "data": order
    } )

})