import {z} from "Zod"

export const CreateUSerSchema = z.object({
    name : z.string(),
    password : z.string(),
    username : z.string(),
    email : z.string().min(3).max(50)
})
export const SigninSchema = z.object({
    email : z.string().min(3).max(50),
    password : z.string()

})
export const CreateRoomSchema = z.object({
    roomName : z.string().min(3).max(20)
})