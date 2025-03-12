import { useState } from 'react';
import { X } from 'lucide-react';

type CreateRoomModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreateRoom: (data: { name: string; description: string }) => void;
};

export default function CreateRoomModal({ isOpen, onClose, onCreateRoom }: CreateRoomModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<{ name?: string; description?: string }>({});

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors: { name?: string; description?: string } = {};
    
    if (!name.trim()) {
      newErrors.name = 'Room name is required';
    }
    
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onCreateRoom({ name, description });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full shadow-xl">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-medium">Create New Canvas Room</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label htmlFor="room-name" className="block text-sm font-medium text-gray-700 mb-1">
              Room Name
            </label>
            <input
              id="room-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-primary`}
              placeholder="Enter room name"
            />
            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
          </div>
          
          <div className="mb-6">
            <label htmlFor="room-description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="room-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-primary`}
              rows={3}
              placeholder="What's this room for?"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-500">{errors.description}</p>
            )}
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
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:opacity-90"
            >
              Create Room
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}