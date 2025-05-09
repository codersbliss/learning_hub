// import React, { useState } from 'react';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { useAuth } from '../../contexts/AuthContext';
// import { 
//   BarChart2, 
//   Users, 
//   Flag, 
//   Home, 
//   LogOut, 
//   Menu, 
//   X, 
//   Shield, 
//   ChevronRight 
// } from 'lucide-react';

// interface AdminLayoutProps {
//   children: React.ReactNode;
// }

// const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const { logout } = useAuth();
//   const location = useLocation();
//   const navigate = useNavigate();
  
//   const handleLogout = () => {
//     logout();
//     navigate('/');
//   };
  
//   const isActive = (path: string) => {
//     return location.pathname === path;
//   };
  
//   return (
//     <div className="min-h-screen bg-gray-100">
//       {/* Mobile Sidebar Toggle */}
//       <div className="lg:hidden fixed top-0 left-0 z-50 w-full bg-white shadow-sm">
//         <div className="flex items-center justify-between p-4">
//           <div className="flex items-center">
//             <Shield className="h-8 w-8 text-primary-600" />
//             <span className="ml-2 text-xl font-semibold text-gray-900">Admin Panel</span>
//           </div>
//           <button
//             onClick={() => setIsSidebarOpen(!isSidebarOpen)}
//             className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
//           >
//             {isSidebarOpen ? (
//               <X className="h-6 w-6" />
//             ) : (
//               <Menu className="h-6 w-6" />
//             )}
//           </button>
//         </div>
//       </div>
      
//       {/* Sidebar */}
//       <div
//         className={`fixed inset-0 z-40 lg:translate-x-0 transform transition-transform ease-in-out duration-300 ${
//           isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
//         } lg:static lg:z-auto lg:top-0 lg:left-0 lg:w-64 lg:h-screen bg-white shadow-lg lg:shadow-none`}
//       >
//         <div className="h-full flex flex-col">
//           {/* Sidebar Header */}
//           <div className="p-4 border-b border-gray-200 hidden lg:flex items-center">
//             <Shield className="h-8 w-8 text-primary-600" />
//             <span className="ml-2 text-xl font-semibold text-gray-900">Admin Panel</span>
//           </div>
          
//           {/* Sidebar Links */}
//           <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
//             <Link
//               to="/admin"
//               onClick={() => setIsSidebarOpen(false)}
//               className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
//                 isActive('/admin')
//                   ? 'bg-primary-50 text-primary-700'
//                   : 'text-gray-700 hover:bg-gray-100'
//               }`}
//             >
//               <Home className="h-5 w-5 mr-3" />
//               <span className="font-medium">Dashboard</span>
//               {isActive('/admin') && <ChevronRight className="h-5 w-5 ml-auto" />}
//             </Link>
            
//             <Link
//               to="/admin/reports"
//               onClick={() => setIsSidebarOpen(false)}
//               className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
//                 isActive('/admin/reports')
//                   ? 'bg-primary-50 text-primary-700'
//                   : 'text-gray-700 hover:bg-gray-100'
//               }`}
//             >
//               <Flag className="h-5 w-5 mr-3" />
//               <span className="font-medium">Reports</span>
//               {isActive('/admin/reports') && <ChevronRight className="h-5 w-5 ml-auto" />}
//             </Link>
            
//             <Link
//               to="/admin/users"
//               onClick={() => setIsSidebarOpen(false)}
//               className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
//                 isActive('/admin/users')
//                   ? 'bg-primary-50 text-primary-700'
//                   : 'text-gray-700 hover:bg-gray-100'
//               }`}
//             >
//               <Users className="h-5 w-5 mr-3" />
//               <span className="font-medium">Users</span>
//               {isActive('/admin/users') && <ChevronRight className="h-5 w-5 ml-auto" />}
//             </Link>
            
//             <Link
//               to="/admin/stats"
//               onClick={() => setIsSidebarOpen(false)}
//               className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
//                 isActive('/admin/stats')
//                   ? 'bg-primary-50 text-primary-700'
//                   : 'text-gray-700 hover:bg-gray-100'
//               }`}
//             >
//               <BarChart2 className="h-5 w-5 mr-3" />
//               <span className="font-medium">Statistics</span>
//               {isActive('/admin/stats') && <ChevronRight className="h-5 w-5 ml-auto" />}
//             </Link>
//           </nav>
          
//           {/* Sidebar Footer */}
//           <div className="p-4 border-t border-gray-200">
//             <Link
//               to="/dashboard"
//               onClick={() => setIsSidebarOpen(false)}
//               className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
//             >
//               <Home className="h-5 w-5 mr-3" />
//               <span className="font-medium">Back to Platform</span>
//             </Link>
            
//             <button
//               onClick={handleLogout}
//               className="flex items-center w-full px-4 py-2 mt-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
//             >
//               <LogOut className="h-5 w-5 mr-3" />
//               <span className="font-medium">Sign out</span>
//             </button>
//           </div>
//         </div>
//       </div>
      
//       {/* Main Content */}
//       <div className="pt-16 lg:pt-0 lg:ml-64">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//           {children}
//         </div>
//       </div>

//     </div>
//   );
// };

// export default AdminLayout;





import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  BarChart2,
  Users,
  Flag,
  Home,
  LogOut,
  Menu,
  X,
  Shield,
  ChevronRight,
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 bg-white shadow-lg lg:shadow-none w-64 lg:static lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 flex items-center">
            <Shield className="h-8 w-8 text-primary-600" />
            <span className="ml-2 text-xl font-semibold text-gray-900">Admin Panel</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {[
              { path: '/admin', label: 'Dashboard', icon: <Home className="h-5 w-5 mr-3" /> },
              { path: '/admin/reports', label: 'Reports', icon: <Flag className="h-5 w-5 mr-3" /> },
              { path: '/admin/users', label: 'Users', icon: <Users className="h-5 w-5 mr-3" /> },
              { path: '/admin/stats', label: 'Statistics', icon: <BarChart2 className="h-5 w-5 mr-3" /> },
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
                {isActive(item.path) && <ChevronRight className="h-5 w-5 ml-auto" />}
              </Link>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <Link
              to="/dashboard"
              onClick={() => setIsSidebarOpen(false)}
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <Home className="h-5 w-5 mr-3" />
              <span>Back to Platform</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 mt-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <LogOut className="h-5 w-5 mr-3" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Navbar */}
        <div className="lg:hidden flex items-center justify-between bg-white px-4 py-3 shadow fixed top-0 left-0 right-0 z-50">
          <div className="flex items-center">
            <Shield className="h-6 w-6 text-primary-600" />
            <span className="ml-2 text-lg font-semibold text-gray-900">Admin Panel</span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          >
            {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Content */}
        <main className="flex-1 pt-16 lg:pt-0 px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

