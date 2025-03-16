import { useEffect, useRef, useState } from "react"

import { TopBar } from "./TopBar";
import { Game } from "@/draw/Game";
import { LogOut, LucideLogOut } from "lucide-react";
import { IconButton } from "./IconButton";
import { useRouter } from "next/navigation";


export type Tool = "circle" | "rect" | "line" | "eraser";
export function Canvas({ roomId, socket }: {
  roomId: string
  socket: WebSocket
}) {

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [game, setGame] = useState<Game>();
  const [selectedTool, setSelectedTool] = useState<Tool>("circle");
  const router = useRouter();
  useEffect(() => {
    game?.setTool(selectedTool);


  }, [selectedTool, game])

  useEffect(() => {

    if (canvasRef.current) {
      const g = new Game(canvasRef.current, roomId, socket);
      setGame(g) ;

      return()=>{
        g.destroy() ;
      }
    }

  }, [canvasRef])

  return <div className="overflow-hidden flex justify-center">
    <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight}></canvas>
    <div className="fixed mt-5">
      <TopBar selectedTool={selectedTool} setSelectedTool={setSelectedTool} />
    </div>
      <div className="bg-white w-10 rounded-lg absolute bottom-1 right-1 mb-10 mr-10">
      <IconButton icon={<LucideLogOut/>}  onClick={()=>router.replace("/dashboard")}/>
      </div> 
    
   
  </div>


}