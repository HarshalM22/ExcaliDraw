'use client'

import { useState } from 'react';

import { PlusCircle, Grid, PlusCircleIcon, LucidePlusCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import RoomCard from '@/components/RoomCard';
import CreateRoomModal from '@/components/CreateRoomModal';


// Mock data for rooms - in a real app this would come from a database
const initialRooms = [
  { id: '1', name: 'Wireframe Planning', description: 'Team brainstorming for new feature wireframes', lastEdited: '2 hours ago', participants: 4 },
  { id: '2', name: 'UI Design Review', description: 'Feedback session for dashboard redesign', lastEdited: '1 day ago', participants: 3 },
  { id: '3', name: 'Product Roadmap', description: 'Visual roadmap for Q3 planning', lastEdited: '3 days ago', participants: 5 },
];

export default function Dashboard() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [rooms, setRooms] = useState(initialRooms);


  const handleCreateRoom = (roomData: { name: string; description: string }) => {
    const newRoom = {
      id: `room-${Date.now()}`,
      name: roomData.name,
      description: roomData.description,
      lastEdited: 'Just now',
      participants: 1,
    };
    
    setRooms([newRoom, ...rooms]);
    setIsCreateModalOpen(false);

  };

  const handleRoomClick = (roomId: string) => {
    // In a real app, this would navigate to the specific room's canvas
    console.log(`Navigating to room ${roomId}`);
   
    // This would navigate to a canvas page for the specific room
    // navigate(`/canvas/${roomId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
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
              onClick={() => handleRoomClick(room.id)}
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
          <CreateRoomModal 
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onCreateRoom={handleCreateRoom}
          />
        )}
      </main>
    </div>
  );
}

