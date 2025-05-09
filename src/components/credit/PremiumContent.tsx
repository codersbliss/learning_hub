import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { API_URL, PREMIUM_COSTS } from '../../config';
import { Lock, Award, BookOpen } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface PremiumItem {
  id: string;
  title: string;
  description: string;
  cost: number;
  type: 'course' | 'workshop' | 'mentorship';
  image: string;
}

const PREMIUM_ITEMS: PremiumItem[] = [
  {
    id: 'course1',
    title: 'Advanced Web Development',
    description: 'Master modern web technologies like React, Node.js, and GraphQL',
    cost: PREMIUM_COSTS.COURSE_ACCESS,
    type: 'course',
    image: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: 'workshop1',
    title: 'UI/UX Design Workshop',
    description: 'Learn design principles and create beautiful interfaces',
    cost: PREMIUM_COSTS.WORKSHOP,
    type: 'workshop',
    image: 'https://images.pexels.com/photos/6444/pencil-typography-black-design.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: 'mentorship1',
    title: 'Career Mentorship Session',
    description: 'One-on-one career coaching with industry experts',
    cost: PREMIUM_COSTS.MENTORSHIP,
    type: 'mentorship',
    image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  }
];

const PremiumContent: React.FC = () => {
  const [unlocking, setUnlocking] = useState<string | null>(null);
  const { user } = useAuth();
  
  const handleUnlock = async (item: PremiumItem) => {
    if (!user) {
      toast.error('You must be logged in to unlock premium content');
      return;
    }
    
    if (user.credits < item.cost) {
      toast.error(`Not enough credits. You need ${item.cost - user.credits} more credits.`);
      return;
    }
    
    setUnlocking(item.id);
    
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/api/credits/spend`, {
        amount: item.cost,
        description: `Unlocked ${item.title}`,
        itemId: item.id
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success(`Successfully unlocked "${item.title}"`);
      // Refresh user data (handled by the parent component)
    } catch (error) {
      toast.error('Failed to unlock content');
    } finally {
      setUnlocking(null);
    }
  };
  
  const getIcon = (type: string) => {
    switch (type) {
      case 'course':
        return <BookOpen className="h-5 w-5" />;
      case 'workshop':
        return <Award className="h-5 w-5" />;
      case 'mentorship':
        return <Lock className="h-5 w-5" />;
      default:
        return <Lock className="h-5 w-5" />;
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Premium Content</h3>
        <p className="text-sm text-gray-600 mt-1">
          Unlock exclusive content and resources with your credits
        </p>
      </div>
      
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {PREMIUM_ITEMS.map((item) => (
          <div key={item.id} className="card h-full flex flex-col">
            <div className="h-40 overflow-hidden">
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <div className="flex items-center mb-2">
                <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mr-2">
                  {getIcon(item.type)}
                </div>
                <span className="text-xs font-medium text-primary-600 uppercase">
                  {item.type}
                </span>
              </div>
              
              <h4 className="text-lg font-semibold text-gray-900 mb-1">{item.title}</h4>
              <p className="text-sm text-gray-600 mb-4 flex-1">{item.description}</p>
              
              <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-lg font-semibold text-accent-600">{item.cost}</span>
                  <span className="text-sm text-gray-500 ml-1">credits</span>
                </div>
                
                <button
                  onClick={() => handleUnlock(item)}
                  disabled={unlocking === item.id || (user && user.credits < item.cost)}
                  className={`btn ${
                    user && user.credits >= item.cost 
                      ? 'btn-primary' 
                      : 'btn-outline opacity-70'
                  }`}
                >
                  {unlocking === item.id ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Unlocking
                    </span>
                  ) : user && user.credits < item.cost ? (
                    'Not enough credits'
                  ) : (
                    'Unlock'
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PremiumContent;