import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  FileText, 
  Search, 
  Bell,
  MapPin,
  Globe,
  HelpCircle,
  Phone,
  FileTerminal,
  ChevronRight,
  LogOut
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function Profile() {
  const { user, logout } = useAuth(); // Get user and logout function from AuthContext

  const handleLogout = async () => {
    try {
      await logout(); // Call the logout function
      // Optionally, redirect or show a success message
    } catch (error) {
      console.error('Logout error:', error);
      alert('Error logging out. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Header */}
      <div className="bg-white p-6 flex flex-col items-center">
        <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-3">
          <span className="text-2xl text-gray-600">{user ? user.email.charAt(0) : 'J'}</span>
        </div>
        {!user && ( // Show button only when user is not logged in
          <button className="bg-[#0487b3] text-white px-8 py-2 rounded-full">
            Log in Or Sign Up
          </button>
        )}
        {user && ( // Display name and email if user data is available
          <div className="mt-2 text-center">
            <p className="text-lg font-medium">{user.email}</p>
            <p className="text-sm text-gray-500">{user.username}</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white mt-2 p-4 grid grid-cols-2 gap-4">
        <Link 
          to="/favorites" 
          className="flex flex-col items-center p-4 bg-blue-50 rounded-lg"
        >
          <Heart className="w-6 h-6 text-[#0487b3] mb-2" />
          <span className="text-sm">Favorites</span>
        </Link>
        <Link 
          to="/my-ads" 
          className="flex flex-col items-center p-4 bg-blue-50 rounded-lg"
        >
          <FileText className="w-6 h-6 text-[#0487b3] mb-2" />
          <span className="text-sm">My Ads</span>
        </Link>
        <Link 
          to="/searches" 
          className="flex flex-col items-center p-4 bg-blue-50 rounded-lg"
        >
          <Search className="w-6 h-6 text-[#0487b3] mb-2" />
          <span className="text-sm">My Searches</span>
        </Link>
        <Link 
          to="/notifications" 
          className="flex flex-col items-center p-4 bg-blue-50 rounded-lg"
        >
          <Bell className="w-6 h-6 text-[#0487b3] mb-2" />
          <span className="text-sm">Notifications</span>
        </Link>
      </div>

      {/* Settings List */}
      <div className="bg-white mt-2">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-sm font-medium">City</p>
                <p className="text-xs text-gray-500">Kigali</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </div>

        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-sm font-medium">Language</p>
                <p className="text-xs text-gray-500">English</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </div>

     

        <Link to="/help" className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <HelpCircle className="w-5 h-5 text-gray-600" />
            <span className="text-sm">Help</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </Link>

        <Link to="/call-us" className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-gray-600" />
            <span className="text-sm">Call Us</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </Link>

        <Link to="/terms" className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileTerminal className="w-5 h-5 text-gray-600" />
            <span className="text-sm">Terms of Use</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </Link>
      </div>

      {/* Logout Button */}
      <div className="p-4">
        <a href="/logout"
          className="w-full flex items-center justify-center gap-2 text-red-600 font-medium"
         
        >
          <LogOut className="w-5 h-5" />
          <span>Log Out</span>
        </a>
      </div>
    </div>
  );
}