"use client";

import { useState } from "react";
import { X } from "lucide-react";
import axios from "axios";
import { HTTP_BACKEND } from "@/config";
import { useRouter } from "next/navigation";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function CreateRoomModal({ isOpen, onClose }: Props) {
  const [roomName, setRoomName] = useState("");
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
      router.push(`/dashboard/${roomId}`);
    } catch (err) {
      console.error("Create room error:", err);
      setError("Failed to create room. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full shadow-xl">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-medium">Create Canvas Room</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleCreateRoom} className="p-6 space-y-4">
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <div>
            <label htmlFor="room-name" className="block text-sm font-medium text-gray-700 mb-1">
              Room Name
            </label>
            <input
              id="room-name"
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter room name"
            />
          </div>
          <div className="flex justify-end">
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:opacity-90">
              Create Room
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
