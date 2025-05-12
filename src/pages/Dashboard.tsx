import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Layout from '../components/layout/Layout';
import ContentCard from '../components/feed/ContentCard';
import FeedFilters from '../components/feed/FeedFilters';
import CreditHistory from '../components/credit/CreditHistory';
import PremiumContent from '../components/credit/PremiumContent';
import { useAuth } from '../contexts/AuthContext';
import { FEED_SOURCES, API_URL } from '../config';
import axios from 'axios';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';

interface Content {
  _id: string;
  title: string;
  description: string;
  source: string;
  sourceIcon: string;
  url: string;
  imageUrl: string;
  date: string;
}

const Dashboard: React.FC = () => {
  const [content, setContent] = useState<Content[]>([]);
  const [savedContent, setSavedContent] = useState<Content[]>([]);
  const [filters, setFilters] = useState<string[]>(FEED_SOURCES);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  useEffect(() => {
    fetchContent();
    fetchSavedContent();
  }, [filters]);
  
  const fetchContent = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/api/content?sources=${filters.join(',')}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setContent(res.data);
    } catch (error) {
      toast.error('Failed to load content feed');
    } finally {
      setLoading(false);
    }
  };
  
  const fetchSavedContent = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/api/content/saved`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setSavedContent(res.data);
    } catch (error) {
      toast.error('Failed to load saved content');
    }
  };
  
  const refreshFeed = () => {
    fetchContent();
    fetchSavedContent();
  };
  
  const handleFilterChange = (newFilters: string[]) => {
    setFilters(newFilters);
  };
  
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
          <p className="text-gray-600 mt-2">
            Discover, learn, and earn credits by engaging with content.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="feed">
              <TabsList>
                <TabsTrigger value="feed">Content Feed</TabsTrigger>
                <TabsTrigger value="saved">Saved Items</TabsTrigger>
              </TabsList>
              
              <TabsContent value="feed">
                <div className="mb-4">
                  <FeedFilters onFilterChange={handleFilterChange} />
                </div>
                
                {loading ? (
                  <div className="flex justify-center p-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary-600"></div>
                  </div>
                ) : content.length === 0 ? (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No content found</h3>
                    <p className="text-gray-600">
                      Try changing your filters or check back later for new content.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {content.map((item) => (
                      <ContentCard 
                        key={item._id} 
                        content={item} 
                        refreshFeed={refreshFeed} 
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="saved">
                {savedContent.length === 0 ? (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No saved content</h3>
                    <p className="text-gray-600">
                      Items you save will appear here for easy access.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {savedContent.map((item) => (
                      <ContentCard 
                        key={item._id} 
                        content={item} 
                        refreshFeed={refreshFeed} 
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg shadow-sm overflow-hidden">
              <div className="p-6 text-white">
                <h2 className="text-xl font-semibold mb-1">Your Credits</h2>
                <div className="text-4xl font-bold">{user?.credits || 0}</div>
                <p className="text-primary-100 mt-2 text-sm">
                  Earn credits by engaging with content
                </p>
              </div>
            </div>
            
            <PremiumContent />
            <CreditHistory />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;