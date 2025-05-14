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

export default function CreateRoomModal({ isOpen, onClose }: CreateRoomModalProps) {
  const [roomName, setRoomName] = useState("");
  const [existingRoom, setExistingRoom] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();
  if (!isOpen) return null;

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!roomName.trim()) {
      setError("Room name is required.");
      return;
    }

    try {
      const res = await axios.post(
        `${HTTP_BACKEND}/document`,
        { roomName },
        { withCredentials: true }
      );

      const roomId = res.data.documentId;
      if (!roomId) {
        setError("Room ID was not returned.");
        return;
      }

      router.push(`/dashboard/${roomId}`);
    } catch (err) {
      console.error("Create room error:", err);
      setError("Failed to create room. Please try again.");
    }
  };

  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!existingRoom.trim()) {
      setError("Room name is required to join.");
      return;
    }

    try {
      const res = await axios.get(`${HTTP_BACKEND}/document/${existingRoom}`, {
        withCredentials: true,
      });

      const roomId = res.data.roomId;
      if (!roomId) {
        setError("Room not found or invalid ID.");
        return;
      }

      router.push(`/dashboard/${roomId}`);
    } catch (err) {
      console.error("Join room error:", err);
      setError("Failed to join room. Please ensure the name is correct.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full shadow-xl">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-medium">Canvas Room Options</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {error && <p className="text-red-600 text-sm">{error}</p>}

          {/* Create Room */}
          <form onSubmit={handleCreateRoom} className="space-y-4">
            <div>
              <label htmlFor="room-name" className="block text-sm font-medium text-gray-700 mb-1">
                Create Room
              </label>
              <input
                id="room-name"
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter new room name"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:opacity-90"
              >
                Create Room
              </button>
            </div>
          </form>

          {/* Join Room */}
          <form onSubmit={handleJoinRoom} className="space-y-4">
            <div>
              <label htmlFor="existing-room-name" className="block text-sm font-medium text-gray-700 mb-1">
                Join Room
              </label>
              <input
                id="existing-room-name"
                type="text"
                value={existingRoom}
                onChange={(e) => setExistingRoom(e.target.value)}
                className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter existing room name"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:opacity-90"
              >
                Join Room
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
