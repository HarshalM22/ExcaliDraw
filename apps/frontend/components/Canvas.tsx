import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { LucideLogOut } from "lucide-react"

import { TopBar } from "./TopBar"
import { Game } from "@/draw/Game"
import { IconButton } from "./IconButton"

export type Tool = "circle" | "rect" | "line" | "eraser"

export function Canvas({ roomId, socket }: { roomId: string; socket: WebSocket }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [game, setGame] = useState<Game | null>(null)
  const [selectedTool, setSelectedTool] = useState<Tool>("circle")
  const router = useRouter()

  // Handle tool changes
  useEffect(() => {
    game?.setTool(selectedTool)
  }, [selectedTool, game])

  // Setup game instance
  useEffect(() => {
    if (!canvasRef.current || !socket) return

    const g = new Game(canvasRef.current, roomId, socket)
    setGame(g)

    return () => {
      setGame(null) // Cleanup game on unmount
    }
  }, [roomId, socket])

  return (
    <div className="overflow-hidden flex justify-center">
      <canvas
        ref={canvasRef}
        width={typeof window !== "undefined" ? window.innerWidth : 800}
        height={typeof window !== "undefined" ? window.innerHeight : 600}
        className="bg-black"
      />

      <div className="fixed mt-5">
        <TopBar selectedTool={selectedTool} setSelectedTool={setSelectedTool} />
      </div>

      <div className="bg-white w-10 rounded-lg absolute bottom-1 right-1 mb-10 mr-10">
        <IconButton icon={<LucideLogOut />} onClick={() => router.replace("/dashboard")} />
      </div>
    </div>
  )
}
