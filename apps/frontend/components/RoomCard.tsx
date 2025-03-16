import { Users, Clock } from 'lucide-react';

type RoomCardProps = {
  room: {
    id: number;
    slug: string;
    // description: string;
    // lastEdited: string;
    // participants: number;
  };
  onClick: () => void;
};


export default function RoomCard({ room, onClick }: RoomCardProps) {
  return (
    <div 
      onClick={onClick}
      className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer"
    >
      <h3 className="text-xl font-medium mb-2 truncate">{room.slug}</h3>
      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between">
        <div className="flex items-center gap-1 text-muted-foreground text-sm">
          <Clock size={16} />
          {/* <span>{room.lastEdited}</span> */}
        </div>
        <div className="flex items-center gap-1 text-muted-foreground text-sm">
          <Users size={16} />
          {/* <span>{room.participants}</span> */}
        </div>
      </div>
    </div>
  );
}