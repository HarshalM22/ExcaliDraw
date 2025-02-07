import express from "express" ;
import jwt from "jsonwebtoken";
import {JWT_SECRET} from "@repo/backend-common/config";
import { middleware } from "./middleware";
import {CreateUSerSchema,SigninSchema,CreateRoomSchema} from "@repo/common/types"
import {client} from "@repo/db/client"
const app = express();
app.use(express.json())

app.post("/signup" , async function (req,res){
    const parsedData = CreateUSerSchema.safeParse(req.body) ;
    if(!parsedData.success){
      res.json({
        message : "incorrect inputs"
      })
      return ;
    }
   try{
    await client.user.create({
        data:{
            email : parsedData.data.name,
            password : parsedData.data.password,
            name:parsedData.data.name
        }
    })
    res.json({
       message : "user has been signed up" 
    })
}catch(e){
  res.status(411).json({
    message : "email is already registered"
  })
}
    
})
app.post("/signin" , function (req,res){
    const parsedData = SigninSchema.safeParse(req.body); 
    if(!parsedData.success){
        res.json({
          message : "incorrect inputs"
        })
        return ;
      }
  
    const userId = 1 ;
    const token = jwt.sign({
        userId
    },JWT_SECRET)

    res.json({
        token : token 
    })
})
app.post("/room" ,middleware, function (req,res){
    const parsedData = CreateRoomSchema.safeParse(req.body); 

    if(!parsedData.success){
        res.json({
          message : "incorrect inputs"
        })
        return ;
      }
//    db call
    res.json({
        roomId : 123 
    })
})

app.listen(3000);