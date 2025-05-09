import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { BookmarkPlus, Share2, Flag, ExternalLink, BookmarkCheck } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { POINTS } from '../../config';
import axios from 'axios';
import { API_URL } from '../../config';

interface ContentCardProps {
  content: {
    _id: string;
    title: string;
    description: string;
    source: string;
    sourceIcon: string;
    url: string;
    imageUrl: string;
    date: string;
  };
  refreshFeed: () => void;
}

const ContentCard: React.FC<ContentCardProps> = ({ content, refreshFeed }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [isReporting, setIsReporting] = useState(false);
  const { user } = useAuth();
  
  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/api/content/save`, { contentId: content._id }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setIsSaved(true);
      toast.success(`Saved! You earned ${POINTS.SAVE_CONTENT} credits.`);
      refreshFeed();
    } catch (error) {
      toast.error('Error saving content');
    }
  };
  
  const handleShare = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/api/content/share`, { contentId: content._id }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Copy link to clipboard
      navigator.clipboard.writeText(content.url);
      
      toast.success(`Link copied! You earned ${POINTS.SHARE_CONTENT} credits.`);
      refreshFeed();
    } catch (error) {
      toast.error('Error sharing content');
    }
  };
  
  const handleReport = async () => {
    setIsReporting(true);
    
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/api/content/report`, { contentId: content._id }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success(`Report submitted. You earned ${POINTS.REPORT_CONTENT} credits.`);
      refreshFeed();
    } catch (error) {
      toast.error('Error reporting content');
    } finally {
      setIsReporting(false);
    }
  };
  
  const getSourceIconColor = () => {
    switch (content.source.toLowerCase()) {
      case 'twitter':
        return 'text-blue-400';
      case 'reddit':
        return 'text-orange-500';
      case 'linkedin':
        return 'text-blue-600';
      default:
        return 'text-gray-500';
    }
  };
  
  return (
    <div className="card hover:translate-y-[-2px]">
      {content.imageUrl && (
        <div className="h-48 overflow-hidden">
          <img 
            src={content.imageUrl} 
            alt={content.title} 
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      )}
      <div className="p-5">
        <div className="flex items-center mb-3">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${getSourceIconColor()}`}>
            <span className="text-xs font-bold">{content.sourceIcon}</span>
          </div>
          <span className="text-sm text-gray-500 ml-2">{content.source}</span>
          <span className="text-xs text-gray-400 ml-auto">{new Date(content.date).toLocaleDateString()}</span>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{content.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-3">{content.description}</p>
        
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
          <div className="flex space-x-2">
            <button 
              onClick={handleSave}
              disabled={isSaved}
              className={`p-2 rounded-full ${
                isSaved 
                  ? 'text-primary-600 bg-primary-50' 
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
              title="Save for later"
            >
              {isSaved ? <BookmarkCheck size={18} /> : <BookmarkPlus size={18} />}
            </button>
            
            <button 
              onClick={handleShare}
              className="p-2 rounded-full text-gray-500 hover:bg-gray-100"
              title="Share"
            >
              <Share2 size={18} />
            </button>
            
            <button 
              onClick={handleReport}
              disabled={isReporting}
              className="p-2 rounded-full text-gray-500 hover:bg-gray-100"
              title="Report"
            >
              <Flag size={18} />
            </button>
          </div>
          
          <a 
            href={content.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center text-primary-600 hover:text-primary-700 font-medium text-sm"
          >
            View <ExternalLink size={16} className="ml-1" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContentCard;