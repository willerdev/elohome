import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Filter, Search, Heart, Phone, MessageSquare, X } from 'lucide-react';

const listings = {
  motors: [
    {
      id: 1,
      title: '2023 Mercedes-Benz G63 AMG',
      price: 'AED 950,000',
      location: 'Dubai Marina',
      specs: {
        beds: null,
        baths: null,
        sqft: null,
        type: 'Car',
        year: '2023',
        mileage: '57,000 km'
      },
      image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80',
      verified: true,
    },
  ],
  property: [
    {
      id: 101,
      title: 'Luxury Apartment with Gate Avenue View',
      price: 'AED 120,000',
      location: 'Central Park Residence Tower, DIFC',
      specs: {
        beds: 2,
        baths: 3,
        sqft: '1,610',
        type: 'Apartment',
        year: null,
        mileage: null
      },
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80',
      verified: true,
    },
    {
      id: 102,
      title: 'Furnished Studio in JVC',
      price: 'AED 80,000',
      location: 'Oakley Square Residence, JVC District 11',
      specs: {
        beds: 1,
        baths: 2,
        sqft: '668',
        type: 'Apartment',
        year: null,
        mileage: null
      },
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80',
      verified: true,
    },
  ],
};

const filters = {
  property: {
    type: ['Apartment', 'Villa', 'Townhouse'],
    beds: ['Studio', '1', '2', '3', '4+'],
    price: ['0-50,000', '50,000-100,000', '100,000+'],
  },
  motors: {
    make: ['Mercedes-Benz', 'BMW', 'Audi', 'Porsche'],
    year: ['2023', '2022', '2021', '2020'],
    price: ['0-50,000', '50,000-100,000', '100,000+'],
  },
};

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  agentName: string;
  agentCompany: string;
  propertyReference: string;
}

export function ContactModal({ isOpen, onClose, agentName, agentCompany, propertyReference }: ContactModalProps) {
  const [isAnimating, setIsAnimating] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isAnimating ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />
      <div 
        className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6 z-50 transition-all duration-300 transform
          ${isAnimating ? 'translate-y-0' : 'translate-y-full'}
          max-h-[85vh] overflow-y-auto`}
        onAnimationEnd={() => setIsAnimating(true)}
      >
        <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-6" />
        
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-xl font-semibold">{agentName}</h3>
            <p className="text-gray-600 text-sm">{agentCompany}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="bg-red-50 p-4 rounded-xl mb-6">
          <p className="text-sm text-red-700">
            Don't forget to mention the property reference <span className="font-semibold">{propertyReference}</span> when you call.
          </p>
        </div>

        <a
          href="tel:+971501234567"
          className="block w-full bg-red-600 text-white text-center py-4 rounded-xl font-semibold mb-4 hover:bg-red-700 transition-colors"
        >
          Call
        </a>
      </div>
    </>
  );
}

function CategoryListingSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
      <div className="relative aspect-video bg-gray-200" />
      <div className="p-4 space-y-4">
        <div className="space-y-2">
          <div className="h-6 w-32 bg-gray-200 rounded" />
          <div className="h-4 w-48 bg-gray-200 rounded" />
        </div>
        
        <div className="flex gap-4">
          <div className="h-4 w-20 bg-gray-200 rounded" />
          <div className="h-4 w-20 bg-gray-200 rounded" />
          <div className="h-4 w-20 bg-gray-200 rounded" />
        </div>
        
        <div className="h-4 w-40 bg-gray-200 rounded" />
        
        <div className="flex gap-2 pt-2">
          <div className="flex-1 h-12 bg-gray-200 rounded-xl" />
          <div className="flex-1 h-12 bg-gray-200 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function CategoryPage() {
  const { category } = useParams();
  const [showFilters, setShowFilters] = React.useState(false);
  const [showCallModal, setShowCallModal] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<(typeof listings.motors)[0] | null>(null);
  const [loading, setLoading] = React.useState(true);

  // Convert category parameter to match your data structure
  const normalizedCategory = category?.toLowerCase() || 'property';
  
  const categoryListings = listings[normalizedCategory as keyof typeof listings] || [];
  const categoryFilters = filters[normalizedCategory as keyof typeof filters] || {};

  React.useEffect(() => {
    // Simulate API loading
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, [category]);

  const handleWhatsAppClick = (item: typeof listings.motors[0]) => {
    const phone = "971501234567";
    const message = `Hi, I'm interested in your ${item.title} (Ref: ${item.id}) listed on EloHome.`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Search and Filter Header */}
      <div className="bg-white sticky top-0 z-10 border-b">
        <div className="p-4 space-y-4">
          <div className="flex gap-3">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search in this category..."
                className="w-full pl-10 pr-4 py-4 rounded-md border bg-gray-50"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2.5 border rounded-md flex items-center gap-2 bg-white"
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>

          {/* Filter Pills */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button className="px-4 py-1.5 rounded-full text-sm whitespace-nowrap bg-gray-100">
              Filters
            </button>
            <button className="px-4 py-1.5 rounded-full text-sm whitespace-nowrap bg-gray-100">
              Rent
            </button>
            <button className="px-4 py-1.5 rounded-full text-sm whitespace-nowrap bg-gray-100">
              All in Residential
            </button>
            <button className="px-4 py-1.5 rounded-full text-sm whitespace-nowrap bg-gray-100">
              Price
            </button>
          </div>
        </div>
      </div>

      {/* Listings */}
      <div className="px-4 py-4 space-y-4">
        {loading ? (
          <>
            <CategoryListingSkeleton />
            <CategoryListingSkeleton />
            <CategoryListingSkeleton />
          </>
        ) : (
          categoryListings.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <Link to={`/product/${item.id}`} className="block">
                <div className="relative aspect-video">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  {item.verified && (
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 shadow-sm">
                      <svg 
                        viewBox="0 0 24 24" 
                        className="w-3.5 h-3.5 text-green-500 fill-current"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-.997-6l7.07-7.071-1.414-1.414-5.656 5.657-2.829-2.829-1.414 1.414L11.003 16z"/>
                      </svg>
                      <span className="text-gray-700">Verified</span>
                    </div>
                  )}
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      // Add your favorite logic here
                    }} 
                    className="absolute top-3 right-3 p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors group"
                  >
                    <Heart className="w-5 h-5 text-gray-600 group-hover:text-red-500 transition-colors" />
                  </button>
                </div>
              </Link>
              <div className="p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xl font-semibold">{item.price}</p>
                    <Link 
                      to={`/product/${item.id}`} 
                      className="text-sm text-gray-600 hover:text-[#0487b3]"
                    >
                      {item.title}
                    </Link>
                  </div>
                </div>
                
                {item.specs.beds ? (
                  <div className="flex gap-4 text-sm text-gray-600">
                    <span>{item.specs.beds} beds</span>
                    <span>{item.specs.baths} baths</span>
                    <span>{item.specs.sqft} sqft</span>
                  </div>
                ) : (
                  <div className="flex gap-4 text-sm text-gray-600">
                    <span>{item.specs.year}</span>
                    <span>{item.specs.mileage}</span>
                  </div>
                )}
                
                <p className="text-sm text-gray-600">{item.location}</p>
                
                <div className="flex gap-2 pt-2">
                  <button 
                    onClick={() => {
                      setSelectedItem(item);
                      setShowCallModal(true);
                    }}
                    className="flex-1 h-12 bg-white border border-gray-200 text-gray-700 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
                  >
                    <Phone className="w-5 h-5 text-red-500" />
                    <span className="font-semibold text-sm">Call</span>
                  </button>
                  <button 
                    onClick={() => handleWhatsAppClick(item)}
                    className="flex-1 h-12 bg-white border border-gray-200 text-gray-700 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
                  >
                    <MessageSquare className="w-5 h-5 text-green-500" />
                    <span className="font-semibold text-sm text-green-500">WhatsApp</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedItem && (
        <ContactModal
          isOpen={showCallModal}
          onClose={() => setShowCallModal(false)}
          agentName="Muhammed Ansad"
          agentCompany="AZCO - Arjan"
          propertyReference={`ARJ-SM-VNCPAL-IBR-${selectedItem.id}`}
        />
      )}
    </div>
  );
}