"use client"

import { useEffect, useState } from "react";
import { WS_URL } from "@/config";
import { Canvas } from "./Canvas";

export function RoomCanvas({ roomId }: { roomId: string }) {


  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI0NmEyZWVkZS00MDRiLTRkYWYtOWEwZi1lNGM1YmQ0Y2MzMTIiLCJpYXQiOjE3NDE1MTkwNjh9.QrUXay73jTqAFlcX7Ee6pxEqgbEJMudst-drembrd00`)

    ws.onopen = () => {
      setSocket(ws);
      ws.send(JSON.stringify({
        type: "join_room",
        roomId
      }))
    }
  }, [])

  if (!socket) {
    return <div>
      Connecting t the server.......
    </div>
  }


  return (
    <Canvas roomId={roomId} socket={socket} />
  )


}