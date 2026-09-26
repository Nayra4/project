import z, { email } from "zod"
export const login_shc=z.object({
    email:z.email(),
    password:z.string().min(8)
})