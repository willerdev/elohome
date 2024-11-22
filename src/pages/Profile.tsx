import React from 'react';
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

export function Profile() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Header */}
      <div className="bg-white p-6 flex flex-col items-center">
        <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-3">
          <span className="text-2xl text-gray-600">J</span>
        </div>
        <button className="bg-[#0487b3] text-white px-8 py-2 rounded-full">
          Log in Or Sign Up
        </button>
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
                <p className="text-xs text-gray-500">Dubai</p>
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
                <p className="text-xs text-gray-500">العربية</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </div>

        <Link to="/full-site" className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-gray-600" />
            <span className="text-sm">Full Site</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </Link>

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
        <button className="w-full flex items-center justify-center gap-2 text-red-600 font-medium">
          <LogOut className="w-5 h-5" />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
}