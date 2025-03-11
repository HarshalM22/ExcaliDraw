import { useEffect, useRef, useState } from "react"

import { TopBar } from "./TopBar";
import { Game } from "@/draw/Game";


export type Tool = "circle" | "rect" | "pencil" | "eraser";
export function Canvas({ roomId, socket }: {
  roomId: string
  socket: WebSocket
}) {

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [game, setGame] = useState<Game>();
  const [selectedTool, setSelectedTool] = useState<Tool>("circle");

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
  </div>


}