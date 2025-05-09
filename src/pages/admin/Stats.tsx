import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import AdminLayout from '../../components/layout/AdminLayout';
import { CreditCard, Eye, Share2, Flag, BookmarkPlus } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../../config';

interface ContentStats {
  mostViewed: Array<{ _id: string; title: string; views: number }>;
  mostSaved: Array<{ _id: string; title: string; saves: number }>;
  mostShared: Array<{ _id: string; title: string; shares: number }>;
  mostReported: Array<{ _id: string; title: string; reports: number }>;
}

interface CreditStats {
  totalCreditsEarned: number;
  totalCreditsSpent: number;
  topEarners: Array<{ _id: string; name: string; earned: number }>;
  topSpenders: Array<{ _id: string; name: string; spent: number }>;
}

const Stats: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'content' | 'credits'>('content');
  const [contentStats, setContentStats] = useState<ContentStats | null>(null);
  const [creditStats, setCreditStats] = useState<CreditStats | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (activeTab === 'content') {
      fetchContentStats();
    } else {
      fetchCreditStats();
    }
  }, [activeTab]);
  
  const fetchContentStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(`https://learning-hub-ciio.onrender.com/api/admin/stats/content`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setContentStats(res.data);
    } catch (error) {
      toast.error('Failed to load content statistics');
    } finally {
      setLoading(false);
    }
  };
  
  const fetchCreditStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(`https://learning-hub-ciio.onrender.com/api/admin/stats/credits`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setCreditStats(res.data);
    } catch (error) {
      toast.error('Failed to load credit statistics');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Statistics</h1>
        <p className="text-gray-600">Platform engagement and performance metrics</p>
      </div>
      
      <div className="mb-6">
        <div className="flex border-b border-gray-200">
          <button
            className={`py-4 px-6 font-medium text-sm focus:outline-none ${
              activeTab === 'content'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('content')}
          >
            Content Engagement
          </button>
          <button
            className={`py-4 px-6 font-medium text-sm focus:outline-none ${
              activeTab === 'credits'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('credits')}
          >
            Credit Activity
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary-600"></div>
        </div>
      ) : activeTab === 'content' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {contentStats && (
            <>
              <StatCard 
                title="Most Viewed Content" 
                icon={<Eye className="h-5 w-5 text-blue-600" />}
                items={contentStats.mostViewed.map(item => ({
                  title: item.title,
                  value: item.views,
                  label: 'views'
                }))}
              />
              
              <StatCard 
                title="Most Saved Content" 
                icon={<BookmarkPlus className="h-5 w-5 text-green-600" />}
                items={contentStats.mostSaved.map(item => ({
                  title: item.title,
                  value: item.saves,
                  label: 'saves'
                }))}
              />
              
              <StatCard 
                title="Most Shared Content" 
                icon={<Share2 className="h-5 w-5 text-purple-600" />}
                items={contentStats.mostShared.map(item => ({
                  title: item.title,
                  value: item.shares,
                  label: 'shares'
                }))}
              />
              
              <StatCard 
                title="Most Reported Content" 
                icon={<Flag className="h-5 w-5 text-red-600" />}
                items={contentStats.mostReported.map(item => ({
                  title: item.title,
                  value: item.reports,
                  label: 'reports'
                }))}
              />
            </>
          )}
        </div>
      ) : (
        <div>
          {creditStats && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center mb-4">
                    <div className="p-2 rounded-md bg-green-100 text-green-600 mr-3">
                      <CreditCard className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Credits Earned</h3>
                  </div>
                  <div className="text-3xl font-bold text-gray-900">{creditStats.totalCreditsEarned}</div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center mb-4">
                    <div className="p-2 rounded-md bg-accent-100 text-accent-600 mr-3">
                      <CreditCard className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Credits Spent</h3>
                  </div>
                  <div className="text-3xl font-bold text-gray-900">{creditStats.totalCreditsSpent}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <StatCard 
                  title="Top Credit Earners" 
                  icon={<CreditCard className="h-5 w-5 text-green-600" />}
                  items={creditStats.topEarners.map(item => ({
                    title: item.name,
                    value: item.earned,
                    label: 'credits earned'
                  }))}
                />
                
                <StatCard 
                  title="Top Credit Spenders" 
                  icon={<CreditCard className="h-5 w-5 text-accent-600" />}
                  items={creditStats.topSpenders.map(item => ({
                    title: item.name,
                    value: item.spent,
                    label: 'credits spent'
                  }))}
                />
              </div>
            </>
          )}
        </div>
      )}
    </AdminLayout>
  );
};

interface StatCardProps {
  title: string;
  icon: React.ReactNode;
  items: Array<{ title: string; value: number; label: string }>;
}

const StatCard: React.FC<StatCardProps> = ({ title, icon, items }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center">
          <div className="mr-2">
            {icon}
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
      </div>
      
      <div className="p-4">
        {items.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No data available</p>
        ) : (
          <ul className="space-y-4">
            {items.map((item, index) => (
              <li key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                    <span className="text-xs font-semibold text-gray-700">{index + 1}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900 truncate max-w-xs">{item.title}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-lg font-semibold text-gray-900 mr-1">{item.value}</span>
                  <span className="text-xs text-gray-500">{item.label}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Stats;