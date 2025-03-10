import { useEffect, useRef, useState } from "react"
import { CanvasDraw } from "./CanvasDraw"
import { TopBar } from "./TopBar";

type Shape = "circle"|"rect"|"pencil" |"eraser" ;
export function Canvas({ roomId, socket }: {
  roomId: string
  socket: WebSocket
}) {

  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [selectedTool , setSelectedTool] = useState<Shape>("circle");
  
  useEffect(()=>{
    //@ts-ignore
    window.selectedTool = selectedTool ;
  },[selectedTool])
  
  useEffect(() => {

    if (canvasRef.current) {
      CanvasDraw(canvasRef.current, roomId, socket)
    }

  }, [canvasRef])

  return <div className="overflow-hidden flex justify-center">
    <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight}></canvas>
    <div className="fixed mt-5">
    <TopBar selectedTool= {selectedTool} setSelectedTool={setSelectedTool}/>
    </div>
  </div>


}