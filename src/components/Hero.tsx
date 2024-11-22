import React from 'react';
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const searchCategories = [
  { name: 'All', path: '/' },
  { name: 'Motors', path: '/category/motors' },
  { name: 'Jobs', path: '/category/jobs' },
  { name: 'Classifieds', path: '/category/classifieds' },
  { name: 'Property', path: '/category/property' },
  { name: 'New Projects', path: '/category/new-projects', isNew: true },
  { name: 'Community', path: '/category/community' },
];

export function Hero() {
  return (
    <>
      {/* Mobile Hero - Simple padding for search categories */}
      <div className="md:hidden px-4 py-3">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {searchCategories.map((category) => (
            <Link
              key={category.name}
              to={category.path}
              className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap ${
                category.name === 'All' 
                  ? 'bg-red-600 text-white' 
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {category.name}
              {category.isNew && (
                <span className="ml-1 text-xs bg-green-500 text-white px-1.5 rounded">NEW</span>
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* Desktop Hero - Keep existing code */}
      <div className="hidden md:block">
        <div className="relative h-[400px]">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&q=80"
              className="w-full h-full object-cover"
              alt="Dubai Skyline"
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 py-16">
            <h1 className="text-4xl font-bold text-white mb-8">
              The best place to buy your house, sell your car or find a job in Dubai
            </h1>
            
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-gray-600">Searching in</span>
                <div className="flex gap-2 overflow-x-auto">
                  {searchCategories.map((category) => (
                    <Link
                      key={category.name}
                      to={category.path}
                      className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap ${
                        category.name === 'All' 
                          ? 'bg-red-600 text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {category.name}
                      {category.isNew && (
                        <span className="ml-1 text-xs bg-green-500 text-white px-1.5 rounded">NEW</span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-2">
                <div className="flex-grow relative">
                  <input
                    type="text"
                    placeholder="Search for anything..."
                    className="w-full pl-10 pr-4 py-3 rounded-md border-gray-300 border"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
                <button className="bg-red-600 text-white px-8 py-2 rounded-md hover:bg-red-700">
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}