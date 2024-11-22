import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, Heart, MessageCircle, User, Plus } from 'lucide-react';

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
  return (
    <header className="bg-white border-b">
      <div className="max-w-7xl mx-auto">
        {/* Mobile Header */}
        <div className="md:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <Link to="/" className="text-2xl font-bold text-red-600">ELOHOME</Link>
            <div className="flex items-center gap-4">
              <Link to="/notifications" className="text-gray-600">
                <Bell className="w-5 h-5" />
              </Link>
              <Link to="/login" className="text-gray-600">
                <User className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:block">
          {/* Keep existing desktop header code */}
          <div className="flex items-center justify-between px-4 py-2 border-b">
            <Link to="/" className="text-2xl font-bold text-red-600">ELOHOME</Link>
            
            <div className="flex items-center gap-6">
              <Link to="/notifications" className="text-gray-600 hover:text-gray-900">
                <Bell className="w-5 h-5" />
              </Link>
              <Link to="/searches" className="text-gray-600 hover:text-gray-900">
                <span className="text-sm">My Searches</span>
              </Link>
              <Link to="/favorites" className="text-gray-600 hover:text-gray-900">
                <Heart className="w-5 h-5" />
              </Link>
              <Link to="/messages" className="text-gray-600 hover:text-gray-900">
                <MessageCircle className="w-5 h-5" />
              </Link>
              <Link to="/my-ads" className="text-gray-600 hover:text-gray-900">
                <span className="text-sm">My Ads</span>
              </Link>
              <Link to="/login" className="text-sm">Log in or sign up</Link>
              <Link 
                to="/post-ad"
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Place Your Ad
              </Link>
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
    </header>
  );
}