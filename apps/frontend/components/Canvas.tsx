import { useEffect, useRef } from "react"
import { CanvasDraw } from "./CanvasDraw"

export function Canvas({roomId,socket}:{
    roomId :string
    socket : WebSocket
}){
      const canvasRef = useRef<HTMLCanvasElement>(null) ;
    useEffect(()=>{
  
        if(canvasRef.current){
          CanvasDraw(canvasRef.current,roomId,socket)
        }
    
      },[canvasRef])

      return <div>
                <canvas ref={canvasRef} width={1685} height={845}></canvas>

      </div>
  

}