import z from "zod"
export const register_sch=z.object({
    username:z.string().min(2),
    email:z.string().regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
    password:z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
    password_confirmation:z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
    role:z.enum(["customer" , "merchant"])
}).refine((x)=>x.password===x.password_confirmation,{error:"password and password_confirm don`t match "})



