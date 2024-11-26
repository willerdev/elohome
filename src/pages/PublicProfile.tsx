import React from 'react';
import { PageHeader } from '../components/PageHeader';
import { 
  MapPin, 
  Calendar, 
  Star, 
  MessageCircle,
  Share2,
  Flag
} from 'lucide-react';

export function PublicProfile() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader title="Public Profile" />
      
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-3xl font-bold text-gray-600">J</span>
            </div>
            
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-2">John Doe</h1>
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>Dubai, UAE</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Member since Mar 2024</span>
                </div>
              </div>
              
              <div className="flex gap-4">
                <button className="flex items-center gap-1 text-gray-600">
                  <MessageCircle className="w-5 h-5" />
                  <span>Message</span>
                </button>
                <button className="flex items-center gap-1 text-gray-600">
                  <Share2 className="w-5 h-5" />
                  <span>Share</span>
                </button>
                <button className="flex items-center gap-1 text-gray-600">
                  <Flag className="w-5 h-5" />
                  <span>Report</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Listings */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Active Listings</h2>
          <div className="space-y-4">
            {[1, 2].map((item) => (
              <div key={item} className="flex gap-4 p-4 border rounded-lg">
                <div className="w-24 h-24 bg-gray-200 rounded-lg" />
                <div>
                  <h3 className="font-medium">iPhone 13 Pro Max</h3>
                  <p className="text-[#0487b3] font-bold">AED 3,500</p>
                  <p className="text-sm text-gray-600">Dubai Marina</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Reviews</h2>
          <div className="space-y-4">
            {[1, 2].map((item) => (
              <div key={item} className="border-b last:border-0 pb-4 last:pb-0">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">1 month ago</span>
                </div>
                <p className="text-gray-600">
                  Great seller! Very responsive and item was exactly as described.
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}