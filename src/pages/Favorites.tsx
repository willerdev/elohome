import React from 'react';
import { Heart, Share2, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const favorites = [
  {
    id: 1,
    title: '2023 Mercedes-Benz G63 AMG',
    price: 'AED 950,000',
    location: 'Dubai Marina',
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80',
  },
  {
    id: 2,
    title: 'Luxury 3 BHK Apartment',
    price: 'AED 2,500,000',
    location: 'Palm Jumeirah',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80',
  },
];

export function Favorites() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8 flex items-center gap-2">
        <Heart className="w-6 h-6" />
        My Favorites
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map((item) => (
          <div key={item.id} className="bg-white rounded-lg border hover:shadow-lg transition-shadow">
            <Link to={`/product/${item.id}`}>
              <div className="aspect-video relative overflow-hidden rounded-t-lg">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </Link>
            <div className="p-4">
              <Link to={`/product/${item.id}`}>
                <h3 className="font-medium text-lg mb-1 hover:text-[#0487b3]">
                  {item.title}
                </h3>
              </Link>
              <p className="text-xl font-bold text-[#0487b3] mb-1">{item.price}</p>
              <p className="text-sm text-gray-500 mb-4">{item.location}</p>
              <div className="flex gap-4">
                <button className="flex items-center gap-1 text-gray-600 hover:text-[#0487b3]">
                  <MessageCircle className="w-5 h-5" />
                  <span>Chat</span>
                </button>
                <button className="flex items-center gap-1 text-gray-600 hover:text-[#0487b3]">
                  <Share2 className="w-5 h-5" />
                  <span>Share</span>
                </button>
                <button className="flex items-center gap-1 text-red-500">
                  <Heart className="w-5 h-5 fill-current" />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}