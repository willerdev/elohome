import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Bell, 
  Heart, 
  MessageCircle, 
  User, 
  Plus,
  Settings,
  LogOut,
  BookmarkPlus,
  Car,
  Search,
  CheckCircle2,
  MessageSquare,
  UserCircle,
  FileText
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Toast } from './Toast';

const categories = [
  { name: 'Motors', path: '/?category=motors', isNew: true },
  { name: 'Property', path: '/?category=property', isNew: true },
  { name: 'Jobs', path: '/?category=jobs' },
  { name: 'Classifieds', path: '/?category=classifieds' },
  { name: 'Furniture & Garden', path: '/?category=furniture' },
  { name: 'Mobiles & Tablets', path: '/?category=mobile' },
  { name: 'Community', path: '/?category=community' },
];

export function Header() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const menuItems = [
    { label: 'My Job Applications', path: '/job-applications' },
    { label: 'My Profile', path: '/profile' },
    { label: 'My Job Profile', path: '/job-profile' },
    { label: 'My Public Profile', path: '/public-profile' },
    { label: 'My Ads', path: '/my-ads' },
    { label: 'Get Verified', path: '/get-verified', icon: CheckCircle2, badge: true },
    { label: 'Chats', path: '/messages', icon: MessageSquare },
    { label: 'Favorites', path: '/favorites', icon: Heart },
    { label: 'My Searches', path: '/searches', icon: Search },
    { label: 'Car Appointments', path: '/car-appointments', icon: Car, badge: 'NEW' },
    { label: 'My Bookmarks', path: '/bookmarks', icon: BookmarkPlus },
    { label: 'Account Settings', path: '/settings', icon: Settings },
    { label: 'Sign out', path: '/logout', icon: LogOut },
  ];

  const handlePostAdClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login', { state: { from: '/post-ad' } });
    } else {
      navigate('/post-ad');
    }
  };

  const handleMenuClick = (path: string) => {
    if (!user) {
      setToastMessage('Please log in first');
      setShowToast(true);
    } else {
      navigate(path);
    }
  };

  return (
    <header className="bg-white border-b">
      <div className="max-w-7xl mx-auto">
        {/* Mobile Header */}
        <div className="md:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <Link to="/" className="text-2xl font-bold text-red-600">ELOHOME</Link>
            <div className="flex items-center gap-4">
              {user && (
                <Link to="/notifications" className="text-gray-600">
                  <Bell className="w-5 h-5" />
                </Link>
              )}
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                  className="text-sm flex items-center gap-2 hover:text-gray-900"
                >
                  {user?.user_metadata?.full_name || user?.email}
                </button>
                
                {showDropdown && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border py-2 z-50">
                    {menuItems.map((item, index) => (
                      <React.Fragment key={item.path}>
                        <Link
                          to={item.path}
                          className="px-4 py-2 hover:bg-gray-50 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            {item.icon && <item.icon className="w-4 h-4 text-gray-500" />}
                            <span className="text-sm text-gray-700">{item.label}</span>
                          </div>
                          {item.badge && (
                            <span className={`text-xs px-1.5 py-0.5 rounded ${
                              item.badge === true 
                                ? 'bg-blue-500 text-white' 
                                : 'bg-green-500 text-white'
                            }`}>
                              {item.badge === true ? '✓' : item.badge}
                            </span>
                          )}
                        </Link>
                        {(index === 3 || index === 5 || index === 9) && (
                          <div className="my-1 border-b border-gray-100" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:block">
          <div className="flex items-center justify-between px-4 py-2 border-b">
            <Link to="/" className="text-2xl font-bold text-red-600">ELOHOME</Link>
            
            <div className="flex items-center gap-6">
              <Link
                to={user ? '/notifications' : '/login'}
                onClick={(e) => !user && (e.preventDefault(), setToastMessage('Please log in first'), setShowToast(true))}
                className="flex flex-col items-center text-gray-600 hover:text-gray-900"
              >
                <Bell className="w-5 h-5" />
                <span className="text-xs mt-1">Notifications</span>
              </Link>

              <Link
                to={user ? '/searches' : '/login'}
                onClick={(e) => !user && (e.preventDefault(), setToastMessage('Please log in first'), setShowToast(true))}
                className="flex flex-col items-center text-gray-600 hover:text-gray-900"
              >
                <Search className="w-5 h-5" />
                <span className="text-xs mt-1">My Searches</span>
              </Link>

              <Link
                to={user ? '/favorites' : '/login'}
                onClick={(e) => !user && (e.preventDefault(), setToastMessage('Please log in first'), setShowToast(true))}
                className="flex flex-col items-center text-gray-600 hover:text-gray-900"
              >
                <Heart className="w-5 h-5" />
                <span className="text-xs mt-1">Favorites</span>
              </Link>

              <Link
                to={user ? '/chats' : '/login'}
                onClick={(e) => !user && (e.preventDefault(), setToastMessage('Please log in first'), setShowToast(true))}
                className="flex flex-col items-center text-gray-600 hover:text-gray-900"
              >
                <MessageCircle className="w-5 h-5" />
                <span className="text-xs mt-1">Chats</span>
              </Link>

              <Link
                to={user ? '/my-ads' : '/login'}
                onClick={(e) => !user && (e.preventDefault(), setToastMessage('Please log in first'), setShowToast(true))}
                className="flex flex-col items-center text-gray-600 hover:text-gray-900"
              >
                <FileText className="w-5 h-5" />
                <span className="text-xs mt-1">My Ads</span>
              </Link>

              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                    className="text-sm flex items-center gap-2 hover:text-gray-900"
                  >
                    {user?.user_metadata?.full_name || user?.email}
                  </button>
                  
                  {showDropdown && (
                    <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border py-2 z-50">
                      {menuItems.map((item, index) => (
                        <React.Fragment key={item.path}>
                          <Link
                            to={item.path}
                            className="px-4 py-2 hover:bg-gray-50 flex items-center justify-between"
                          >
                            <div className="flex items-center gap-2">
                              {item.icon && <item.icon className="w-4 h-4 text-gray-500" />}
                              <span className="text-sm text-gray-700">{item.label}</span>
                            </div>
                            {item.badge && (
                              <span className={`text-xs px-1.5 py-0.5 rounded ${
                                item.badge === true 
                                  ? 'bg-blue-500 text-white' 
                                  : 'bg-green-500 text-white'
                              }`}>
                                {item.badge === true ? '✓' : item.badge}
                              </span>
                            )}
                          </Link>
                          {(index === 3 || index === 5 || index === 9) && (
                            <div className="my-1 border-b border-gray-100" />
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="text-sm">Log in or sign up</Link>
              )}
              
              <button 
                onClick={handlePostAdClick}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Place Your Ad
              </button>
            </div>
          </div>

          {/* Categories */}
          <nav className="flex items-center gap-8 px-4 py-3 overflow-x-auto">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={category.path}
                className="flex items-center gap-1 text-gray-600 hover:text-gray-900 whitespace-nowrap"
              >
                {category.name}
                {category.isNew && (
                  <span className="text-xs bg-green-500 text-white px-1.5 rounded">NEW</span>
                )}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <Toast 
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </header>
  );
}