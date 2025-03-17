"use client";
import { useState } from "react";
import { X } from "lucide-react";
import axios from "axios";
import { HTTP_BACKEND } from "@/config";
import { useRouter } from "next/navigation";

type CreateRoomModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function CreateRoomModal({
  isOpen,
  onClose,
}: CreateRoomModalProps) {
  const [roomName, setRoomName] = useState("");
  const [existingRoom,setExistingRoom] = useState("");

  const router = useRouter();
  if (!isOpen) return null;

  async function createRoom() {
    const res = await axios.post(
      `${HTTP_BACKEND}/room`,
      {
        roomName,
      },
      {
        withCredentials: true,
      }
    );
    const roomId = res.data.roomId;
    if (!roomId) {
      console.log("Room Id already exist");
      event?.preventDefault();
    }
    router.replace(`/dashboard/${roomId}`);
  }
  async function joinRoom() {
    const res = await axios.get(`${HTTP_BACKEND}/getRoomId/${existingRoom}`)
    // if(!res){return}
    const roomId = res.data.roomId
    
    if(){
      router.replace(`/`)
    }
    
    router.replace(`/dashboard/${roomId}`) 
  }
  function handleEventlistner(event){
    event.preventDefault()
  }
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full shadow-xl">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-medium">Create New Canvas Room</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <form className="p-6" onSubmit={handleEventlistner}>
          <div className="mb-4">
            <label
              htmlFor="room-name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Room Name
            </label>
            <input
              id="room-name"
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className="w-full px-3 py-2 border rounded-md border-gray-300
               focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter room name"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={createRoom}
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:opacity-90"
            >
              Create Room
            </button>
          </div>
          <div className="mb-4 mt-4">
            <label
              htmlFor="room-name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Room Name
            </label>
            <input
              id="existing-room-name"
              type="text"
              value={existingRoom}
              onChange={(e) => setExistingRoom(e.target.value)}
              className="w-full px-3 py-2 border rounded-md border-gray-300
               focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter room name"
            />
          </div>
          <div className="flex justify-end">
            <button
              onClick={joinRoom}
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:opacity-90"
            >
              Join Room
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
