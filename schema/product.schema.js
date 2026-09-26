import z from "zod"
export const product_sch=z.object({
    name:z.string().min(1),
    description:z.string().min(1),
    price:z.number().positive(),
    image:z.url().optional()
})

