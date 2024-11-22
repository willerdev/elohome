import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, PlusCircle, MessageCircle, User } from 'lucide-react';

const footerLinks = {
  Company: ['About Us', 'Advertising', 'Careers', 'Terms of Use', 'Privacy Policy'],
  UAE: ['Dubai', 'Abu Dhabi', 'Ras Al Khaimah', 'Sharjah', 'Fujairah', 'Ajman', 'Umm Al Quwain', 'Al Ain'],
  'Other Countries': ['Egypt', 'Bahrain', 'Saudi Arabia', 'Lebanon', 'Qatar', 'Oman', 'Pakistan'],
  'Get Social': ['Facebook', 'Twitter', 'YouTube', 'Instagram'],
  Support: ['Help', 'Contact Us', 'Call Us'],
  Languages: ['English', 'العربية'],
};

export function Footer() {
  return (
    <>
      {/* Mobile Footer Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t md:hidden z-50 h-16">
        <div className="flex items-center justify-between px-4 py-2">
          <Link to="/" className="flex flex-col items-center gap-1">
            <Home className="w-6 h-6 text-gray-600" />
            <span className="text-xs text-gray-600">Home</span>
          </Link>
          <Link to="/search" className="flex flex-col items-center gap-1">
            <Search className="w-6 h-6 text-gray-600" />
            <span className="text-xs text-gray-600">Search</span>
          </Link>
          <Link to="/post-ad" className="flex flex-col items-center gap-1">
            <PlusCircle className="w-6 h-6 text-red-600" />
            <span className="text-xs text-red-600">Post an ad</span>
          </Link>
          <Link to="/messages" className="flex flex-col items-center gap-1">
            <MessageCircle className="w-6 h-6 text-gray-600" />
            <span className="text-xs text-gray-600">Chat</span>
          </Link>
          <Link to="/login" className="flex flex-col items-center gap-1">
            <User className="w-6 h-6 text-gray-600" />
            <span className="text-xs text-gray-600">Account</span>
          </Link>
        </div>
      </div>

      {/* Desktop Footer */}
      <footer className="hidden md:block bg-gray-100 pt-12 pb-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h3 className="font-semibold text-gray-900 mb-4">{category}</h3>
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-sm text-gray-600 hover:text-[#0487b3]">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-12 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center">
              © {new Date().getFullYear()} Elohome.com. All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}