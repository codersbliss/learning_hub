import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { BookOpen, Menu, X, LogOut, User, BarChart2, Settings } from 'lucide-react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center">
              <BookOpen className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-semibold text-gray-900">Learning Hub</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {user && (
              <>
                <div className="flex items-center px-3 py-1 rounded-full bg-primary-50 text-primary-700">
                  <BarChart2 className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">{user.credits} Credits</span>
                </div>
                
                <div className="relative group">
                  <button className="flex items-center text-gray-700 hover:text-primary-600 focus:outline-none">
                    <User className="h-5 w-5 mr-1" />
                    <span className="font-medium">{user.name}</span>
                  </button>
                  
                  <div className="absolute right-0 w-48 mt-2 origin-top-right bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="py-1">
                      {isAdmin && (
                        <Link to="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          <div className="flex items-center">
                            <Settings className="h-4 w-4 mr-2" />
                            Admin Dashboard
                          </div>
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <div className="flex items-center">
                          <LogOut className="h-4 w-4 mr-2" />
                          Sign out
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          
          {/* Mobile Navigation Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1 border-t border-gray-200">
            {user && (
              <>
                <div className="flex items-center justify-between px-4 py-2">
                  <div className="flex items-center">
                    <User className="h-5 w-5 mr-2 text-gray-500" />
                    <span className="font-medium">{user.name}</span>
                  </div>
                  <div className="flex items-center px-3 py-1 rounded-full bg-primary-50 text-primary-700">
                    <BarChart2 className="h-4 w-4 mr-1" />
                    <span className="text-sm font-medium">{user.credits} Credits</span>
                  </div>
                </div>
                
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                  >
                    <div className="flex items-center">
                      <Settings className="h-5 w-5 mr-2" />
                      Admin Dashboard
                    </div>
                  </Link>
                )}
                
                <button
                  onClick={handleLogout}
                  className="w-full text-left block px-4 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                >
                  <div className="flex items-center">
                    <LogOut className="h-5 w-5 mr-2" />
                    Sign out
                  </div>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;