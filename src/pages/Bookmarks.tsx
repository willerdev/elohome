import React from 'react';
import { PageHeader } from '../components/PageHeader';
import { BookmarkPlus, MapPin, Calendar, Trash2, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const bookmarks = [
  {
    id: 1,
    title: 'Dubai Marina Apartments',
    description: 'All 2BHK apartments in Dubai Marina under AED 120,000',
    filters: {
      location: 'Dubai Marina',
      type: 'Apartment',
      beds: '2',
      priceRange: 'Up to AED 120,000'
    },
    lastUpdated: '2024-03-15',
    totalListings: 45
  },
  {
    id: 2,
    title: 'Toyota Land Cruiser Search',
    description: 'GCC Spec Land Cruisers from 2020-2024',
    filters: {
      make: 'Toyota',
      model: 'Land Cruiser',
      yearRange: '2020-2024',
      specs: 'GCC'
    },
    lastUpdated: '2024-03-14',
    totalListings: 28
  }
];

export function Bookmarks() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader title="Bookmarks" />
      
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <BookmarkPlus className="w-6 h-6 text-[#0487b3]" />
          <h1 className="text-2xl font-bold">My Bookmarks</h1>
        </div>

        <div className="space-y-4">
          {bookmarks.map((bookmark) => (
            <div key={bookmark.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-medium">{bookmark.title}</h3>
                  <p className="text-gray-600 text-sm">{bookmark.description}</p>
                </div>
                <button className="p-2 text-gray-400 hover:text-red-500">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {Object.entries(bookmark.filters).map(([key, value]) => (
                  <span 
                    key={key}
                    className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                  >
                    {key.replace(/([A-Z])/g, ' $1').toLowerCase()}: {value}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between text-sm border-t pt-4">
                <div className="flex items-center gap-4 text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Updated {bookmark.lastUpdated}</span>
                  </div>
                  <span>{bookmark.totalListings} listings</span>
                </div>
                <Link 
                  to={`/search?bookmark=${bookmark.id}`}
                  className="flex items-center gap-1 text-[#0487b3] hover:underline"
                >
                  <span>View Results</span>
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}