'use client'

import { useEffect, useState } from 'react';

import { PlusCircle, Grid} from 'lucide-react';

import RoomCard from '@/components/RoomCard';
import CreateRoomModal from '@/components/CreateRoomModal';
import axios from 'axios';
import { HTTP_BACKEND } from '@/config';
import { useRouter } from 'next/navigation';


export default function Dashboard() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [rooms, setRooms] = useState([]);
  const router = useRouter()
  
  
useEffect(()=>{
  async function existingRooms(){
    const res = await axios.get(`${HTTP_BACKEND}/room`,{ withCredentials: true })
    setRooms(res.data.rooms)
  }
  existingRooms() ;
},[])
  


  return (
    <div className="min-h-screen bg-gray-50">
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold">Your Canvas Rooms</h1>
            <p className="text-muted-foreground mt-1">Create and manage collaborative drawing spaces</p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-black text-white px-4 py-2 rounded-full flex items-center gap-2 hover:opacity-90 transition-all"
          >
            <PlusCircle size={20} />
            <span>New Room</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <RoomCard 
              key={room.id}
              room={room}
              onClick={() => router.replace(`/dashboard/${room.id}`)}
            />
          ))}
        </div>

        {rooms.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 bg-secondary/30 rounded-lg border border-dashed border-gray-300">
            <div className="flex flex-col items-center text-center max-w-md">
              <Grid size={48} className="text-gray-400 mb-4" />
              <h3 className="text-xl font-medium mb-2">No Canvas Rooms Yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first canvas room to start collaborating with your team
              </p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-primary text-white px-4 py-2 rounded-full flex items-center gap-2 hover:opacity-90 transition-all"
              >
                <PlusCircle size={20} />
                <span>Create Room</span>
              </button>
            </div>
          </div>
        )}

        {isCreateModalOpen && (
          <CreateRoomModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)}/>
        )}
      </main>
    </div>
  );
}

