import {z} from "Zod"

export const CreateUSerSchema = z.object({
    password : z.string(),
    name : z.string(),
    email : z.string().min(3).max(50)
})
export const SigninSchema = z.object({
    username : z.string().min(3).max(20),
    password : z.string(),

})
export const CreateRoomSchema = z.object({
    name : z.string().min(3).max(20)
})