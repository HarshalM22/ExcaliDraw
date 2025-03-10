import { RoomCanvas } from "@/components/RoomCanvas";


export default async function dashboard({params}:{
  params :{
    roomId :string
  }
}) {
  const roomId = (await params).roomId ;
  console.log(roomId);
  

  return <RoomCanvas roomId={roomId}/>
 
}
