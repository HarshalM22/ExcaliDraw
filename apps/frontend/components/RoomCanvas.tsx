"use client"

import { useEffect, useState } from "react";
import { WS_URL } from "@/config";
import { Canvas } from "./Canvas";

export function RoomCanvas({ roomId,token }: { roomId: string ,token :string}) {


  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(`${WS_URL}?token=${token}`)
    console.log(token);
    
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