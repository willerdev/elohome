import React from 'react';
import { useParams } from 'react-router-dom';
import { Heart, Share2, Flag, MessageCircle, Phone } from 'lucide-react';

export function ProductView() {
  const { id } = useParams();
  const [activeImage, setActiveImage] = React.useState(0);

  const product = {
    title: '2023 Mercedes-Benz G63 AMG',
    price: 'AED 950,000',
    location: 'Dubai Marina',
    description: 'Brand new Mercedes-Benz G63 AMG with full options. Zero kilometers, fresh import, and ready for registration. Full service history available.',
    seller: {
      name: 'Premium Motors',
      memberSince: 'Jan 2020',
      listings: 45,
    },
    images: [
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&q=80',
    ],
    specs: {
      year: 2023,
      kilometers: 0,
      reginalSpecs: 'GCC',
      warranty: 'Yes',
      color: 'Black',
      transmission: 'Automatic',
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Images */}
        <div className="space-y-4">
          <div className="aspect-video rounded-lg overflow-hidden md:w-full w-[80%] mx-auto">
            <img
              src={product.images[activeImage]}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setActiveImage(index)}
                className={`flex-none w-24 aspect-video rounded-lg overflow-hidden ${
                  activeImage === index ? 'ring-2 ring-[#0487b3]' : ''
                }`}
              >
                <img src={image} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">{product.title}</h1>
            <p className="text-3xl font-bold text-[#0487b3]">{product.price}</p>
            <p className="text-gray-500">{product.location}</p>
          </div>

          <div className="flex gap-4">
            <button className="flex-1 bg-[#0487b3] text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2">
              <Phone className="w-5 h-5" />
              <span>Call</span>
            </button>
            <button className="flex-1 border border-[#0487b3] text-[#0487b3] px-4 py-2 rounded-lg flex items-center justify-center gap-2">
              <MessageCircle className="w-5 h-5" />
              <span>Chat</span>
            </button>
          </div>

          <div className="flex gap-4">
            <button className="text-gray-600 flex items-center gap-1">
              <Heart className="w-5 h-5" />
              <span>Save</span>
            </button>
            <button className="text-gray-600 flex items-center gap-1">
              <Share2 className="w-5 h-5" />
              <span>Share</span>
            </button>
            <button className="text-gray-600 flex items-center gap-1">
              <Flag className="w-5 h-5" />
              <span>Report</span>
            </button>
          </div>

          <div className="border-t pt-6">
            <h2 className="font-semibold mb-4">Specifications</h2>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(product.specs).map(([key, value]) => (
                <div key={key}>
                  <p className="text-gray-500 capitalize">{key}</p>
                  <p className="font-medium">{value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-6">
            <h2 className="font-semibold mb-4">Description</h2>
            <p className="text-gray-600">{product.description}</p>
          </div>

          <div className="border-t pt-6">
            <h2 className="font-semibold mb-4">Seller Information</h2>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-gray-600">
                  {product.seller.name[0]}
                </span>
              </div>
              <div>
                <p className="font-medium">{product.seller.name}</p>
                <p className="text-sm text-gray-500">
                  Member since {product.seller.memberSince} • {product.seller.listings} listings
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}