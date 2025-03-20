import axios from "axios"
import { HTTP_BACKEND } from "../config";

export async function getExistingShapes(roomId: string) {
    const res = await axios.get(`${HTTP_BACKEND}/chats/${roomId}`,{withCredentials:true});
    const messages = res.data.messages;
  
    const shapes = messages.map((e: { message: string }) => {
      const messageData = JSON.parse(e.message)
      return messageData.shape;
    })
  
    return shapes;
  }

export async function getShapeIdsFromDB(shapes: Shape[]): Promise<number[]>{
  const res = await axios.get(``)
}