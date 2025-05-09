import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import AdminLayout from '../../components/layout/AdminLayout';
import { BarChart2, Users, Flag, Clock, ArrowUpRight } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../../config';

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  pendingReports: number;
  contentItems: number;
  topUsers: Array<{ _id: string; name: string; credits: number }>;
  recentReports: Array<{ _id: string; content: { title: string }; user: { name: string }; createdAt: string }>;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`https://learning-hub-ciio.onrender.com/api/admin/dashboard-stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setStats(res.data);
      } catch (error) {
        toast.error('Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardStats();
  }, []);
  
  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary-600"></div>
        </div>
      </AdminLayout>
    );
  }
  
  if (!stats) {
    return (
      <AdminLayout>
        <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-700">
          Failed to load dashboard data. Please try again.
        </div>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Overview of platform activity and statistics</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-primary-100 text-primary-600 mr-4">
              <Users size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats.totalUsers}</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats.activeUsers}</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4">
              <Flag size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Reports</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats.pendingReports}</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <BarChart2 size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Content Items</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats.contentItems}</h3>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Top Users</h2>
          </div>
          
          <div className="p-6">
            {stats.topUsers.length === 0 ? (
              <p className="text-gray-500 text-center">No data available</p>
            ) : (
              <div className="space-y-4">
                {stats.topUsers.map((user, index) => (
                  <div key={user._id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mr-3">
                        <span className="font-semibold">{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <span className="text-lg font-semibold text-accent-600">{user.credits}</span>
                      <span className="text-sm text-gray-500 ml-1">credits</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Recent Reports</h2>
            
            <a href="/admin/reports" className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center">
              View all <ArrowUpRight size={14} className="ml-1" />
            </a>
          </div>
          
          <div className="p-6">
            {stats.recentReports.length === 0 ? (
              <p className="text-gray-500 text-center">No reports available</p>
            ) : (
              <div className="space-y-4">
                {stats.recentReports.map((report) => (
                  <div key={report._id} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                    <p className="font-medium text-gray-900 mb-1">{report.content.title}</p>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-600">
                        Reported by {report.user.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;



