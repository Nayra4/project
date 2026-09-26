import { Router } from "express"
import { createDB } from "../db.js"
import {cart_schema} from "../schema/cart.schema.js"
import { validate } from "../middleware/validateBody.js"

export const cart_app= Router()
const db=createDB()


cart_app.get("/",async(req,res)=>{
    const carts =await db.getAll("carts")
    const cart=carts.find((p)=>p.userId===req.user.id)
    if(!cart){
        return res.status(200).json({ "data": { "id": null, "userId": "...", "products": [] } })
    }
    res.status(200).json({     "data":cart     })    
    
    })


cart_app.post("/",validate(cart_schema),async(req,res)=>{
    //validate data
    //get all carts
    const carts =await db.getAll("carts")
    //pick our cart
    const cart=carts.find((p)=>p.userId===req.user.id)
    if(!cart){
        const newcart =await db.create("carts",{  userId: req.user.id,
                products: [req.body]
        })
        return res.status(201).json({ "message": "product added to cart", "data": { ...newcart } })
    }
    //get the pruduct that that has this (id)
    const product =cart.products.find((x)=>x.id==req.body.id) //req.body.id) the product id
    //modify the quantity
    product.quantity+=req.body.quantity
        await db.update("carts",cart.id,{products:cart.products  })//cart is the cart what we have modified so we replace it 
        return res.status(201).json({ "message": "product added to cart", "data": { ...cart } })
    

})

cart_app.patch("/:productId",async(req,res)=>{
    //get product by id 
    const id = req.params.productId
    //find the cart 
    const data =await db.getAll("carts")
    const cart=data.find((x)=>x.userId==req.user.id)
    const product=cart.products.find((x)=>x.id==id)
    product.quantity = req.body.quantity
    await db.update("carts",cart.id,{products:cart.products })
    res.status(200).json({ "message": "cart updated", "data": { ...check } })
})

cart_app.delete("/:productId",async(req,res)=>{
    const product_Id=req.params.productId
    //get all cart 
    const data=await db.getAll("carts")
    //the card that we need
    const card=data.find((x)=>x.userId==req.user.id)
    //the product that we will delete
    const product=card.products.filter((x)=>(x.id!==product_Id ))
    await db.update ("carts",card.id,{
        products:product
    })
    res.status(200).json({ "message": "product removed from cart" })

}) 