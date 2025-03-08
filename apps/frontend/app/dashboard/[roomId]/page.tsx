'use client'
import { CanvasDraw } from "@/components/CanvasDraw";
import { useEffect, useRef } from "react"


export default function Dashboard() {
  const canvasRef = useRef<HTMLCanvasElement>(null) ;
  useEffect (()=>{

    if(canvasRef.current){
      CanvasDraw(canvasRef.current)
    }

  },[canvasRef])
  return (
    <div>
      <canvas ref={canvasRef} width={1685} height={845}></canvas>
    </div>

  )
}
