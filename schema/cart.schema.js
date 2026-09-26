import z from "zod"

export const cart_schema=z.object({
    
    id: z.string (),
    name: z.string(),
    description: z.string(),
    price:z.number(),
    image:z.string(),
    quantity: z.number().int().positive()

})