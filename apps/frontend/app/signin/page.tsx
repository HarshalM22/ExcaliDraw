'use client'
import { HTTP_BACKEND } from "@/config"
import axios from "axios"
import { useRouter } from "next/navigation"
import {  useState } from "react"


export default function Signin() {

  const[username,setUsername] = useState('')
  const[password,setPassword] = useState('')
  const router = useRouter()
  async function signin(){
   const succes = await axios.post(`${HTTP_BACKEND}/signin`,{
      username,
      password
    })
    if(succes){
      router.replace("/dashboard")
    }
  }

  return (
    <div className="flex justify-center items-center h-dvh">
     <div className="flex flex-col gap-4 bg-amber-200 rounded h-60 w-52 text-black items-center justify-evenly ">
      <input placeholder="username" onChange={(e)=>setUsername(e.target.value)} type="text"/>
      <input placeholder="password"  onChange={(e)=>setPassword(e.target.value)} type="text"/>
      <button className="bg-black text-white p-2 rounded" onClick={signin} >sign in </button>
     </div>
    </div>
  )
}



  
  