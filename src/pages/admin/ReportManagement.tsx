import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import AdminLayout from '../../components/layout/AdminLayout';
import { Eye, CheckCircle, XCircle, Shield } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../../config';

interface Report {
  _id: string;
  content: {
    _id: string;
    title: string;
    description: string;
    source: string;
    url: string;
  };
  user: {
    _id: string;
    name: string;
    email: string;
  };
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

const ReportManagement: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  useEffect(() => {
    fetchReports();
  }, []);
  
  const fetchReports = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/api/admin/reports`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setReports(res.data);
    } catch (error) {
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };
  
  const handleViewReport = (report: Report) => {
    setSelectedReport(report);
    setIsModalOpen(true);
  };
  
  const handleApproveReport = async (reportId: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${API_URL}/api/admin/reports/${reportId}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success('Report approved and content removed');
      fetchReports();
      setIsModalOpen(false);
    } catch (error) {
      toast.error('Failed to approve report');
    }
  };
  
  const handleRejectReport = async (reportId: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${API_URL}/api/admin/reports/${reportId}/reject`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success('Report rejected');
      fetchReports();
      setIsModalOpen(false);
    } catch (error) {
      toast.error('Failed to reject report');
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pending</span>;
      case 'approved':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Approved</span>;
      case 'rejected':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Rejected</span>;
      default:
        return null;
    }
  };
  
  return (
    <AdminLayout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Report Management</h1>
          <p className="text-gray-600">Review and manage reported content</p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary-600"></div>
          </div>
        ) : reports.length === 0 ? (
          <div className="p-8 text-center">
            <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Reports Found</h3>
            <p className="text-gray-600">
              There are currently no content reports to review.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Content
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reporter
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reports.map((report) => (
                  <tr key={report._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 line-clamp-1">{report.content.title}</div>
                      <div className="text-xs text-gray-500">{report.content.source}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{report.user.name}</div>
                      <div className="text-xs text-gray-500">{report.user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(report.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        onClick={() => handleViewReport(report)} 
                        className="text-primary-600 hover:text-primary-900 mr-4"
                      >
                        <Eye size={18} />
                      </button>
                      
                      {report.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => handleApproveReport(report._id)} 
                            className="text-green-600 hover:text-green-900 mr-4"
                          >
                            <CheckCircle size={18} />
                          </button>
                          
                          <button 
                            onClick={() => handleRejectReport(report._id)} 
                            className="text-red-600 hover:text-red-900"
                          >
                            <XCircle size={18} />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Report Detail Modal */}
      {isModalOpen && selectedReport && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                      Report Details
                    </h3>
                    
                    <div className="mb-4 pb-4 border-b border-gray-200">
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Reported Content</h4>
                      <p className="text-base font-medium text-gray-900 mb-2">{selectedReport.content.title}</p>
                      <p className="text-sm text-gray-600 mb-2">{selectedReport.content.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">{selectedReport.content.source}</span>
                        <a 
                          href={selectedReport.content.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-primary-600 hover:text-primary-700"
                        >
                          View Original
                        </a>
                      </div>
                    </div>
                    
                    <div className="mb-4 pb-4 border-b border-gray-200">
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Report Reason</h4>
                      <p className="text-sm text-gray-900">{selectedReport.reason || 'No reason provided'}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Reporter</h4>
                      <p className="text-sm text-gray-900">{selectedReport.user.name}</p>
                      <p className="text-xs text-gray-500">{selectedReport.user.email}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                {selectedReport.status === 'pending' ? (
                  <>
                    <button
                      type="button"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={() => handleApproveReport(selectedReport._id)}
                    >
                      Remove Content
                    </button>
                    <button
                      type="button"
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={() => handleRejectReport(selectedReport._id)}
                    >
                      Dismiss Report
                    </button>
                  </>
                ) : (
                  <div className="text-sm text-gray-500">
                    This report has been {selectedReport.status}
                  </div>
                )}
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={() => setIsModalOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default ReportManagement;