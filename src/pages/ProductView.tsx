import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Heart, Share2, Flag, MessageCircle, Phone, Car, Fuel, Calendar, Gauge, Shield, History, Users, Building, Bed, Bath, Square, Sofa, Car as CarIcon, Building2, Calendar as CalendarIcon, DollarSign, Package, Ruler, Tag, Award, Info, PaintBucket } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface Product {
  id: number;
  title: string;
  price: string | number;
  location: string;
  description: string;
  images: string[];
  category: string;
  specs: {
    year?: string;
    kilometers?: number;
    reginalSpecs?: string;
    warranty?: string;
    color?: string;
    transmission?: string;
  };
  seller: {
    id: number;
    user_id: string;
    name: string;
    memberSince: string;
    listings: number;
    phone?: string;
  };
  status: 'active' | 'pending';
}

// Helper function to parse the description
const parseDescription = (description: string) => {
  const lines = description.split('\n').filter(line => line.trim());
  const sections: { [key: string]: string[] } = {
    main: [],
    features: [],
    details: []
  };
  
  let currentSection = 'main';
  
  lines.forEach(line => {
    if (line.includes('Additional Features:')) {
      currentSection = 'features';
      return;
    }
    if (line.includes('Additional Details:')) {
      currentSection = 'details';
      return;
    }
    if (line.trim().startsWith('-')) {
      sections[currentSection].push(line.trim().substring(1).trim());
    } else if (line.includes(':')) {
      const [key, value] = line.split(':').map(s => s.trim());
      if (value) {
        sections[currentSection].push(line);
      }
    }
  });
  
  return sections;
};

// Icon mapping for different specification types
const specIcons: { [key: string]: any } = {
  'Transmission': Car,
  'Fuel Type': Fuel,
  'Year': Calendar,
  'Kilometers': Gauge,
  'Regional Specs': Flag,
  'Body Type': Car,
  'Color': PaintBucket,
  'Warranty': Shield,
  'Service History': History,
  'Number of Previous Owners': Users,
  'Property Type': Building,
  'Bedrooms': Bed,
  'Bathrooms': Bath,
  'Size': Square,
  'Furnishing Status': Sofa,
  'Parking Spaces': CarIcon,
  'Building/Community': Building2,
  'Available From': CalendarIcon,
  'Maintenance Fee': DollarSign,
  'Brand': Package,
  'Model': Package,
  'Size/Dimensions': Ruler,
  'Original Price': Tag,
  'Authentication/Certificate': Award
};

// Add this near the top of your file for debugging
const debugFavorite = async (user: any, product: Product) => {
  if (!user || !product) return;
  
  console.log('Debug info:', {
    userId: user.id,
    userIdType: typeof user.id,
    listingId: product.id,
    listingIdType: typeof product.id,
    parsedListingId: parseInt(product.id.toString()),
  });
  
  // Check if product exists
  const { data: listingCheck } = await supabase
    .from('listings')
    .select('id')
    .eq('id', product.id)
    .single();
    
  console.log('Listing check:', listingCheck);
};

export function ProductView() {
  const { id } = useParams();
  const [activeImage, setActiveImage] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [product, setProduct] = React.useState<Product | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [showChatModal, setShowChatModal] = React.useState(false);
  const [chatMessage, setChatMessage] = React.useState('');
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showCallModal, setShowCallModal] = React.useState(false);
  const [isFavorited, setIsFavorited] = React.useState(false);
  const [similarListings, setSimilarListings] = React.useState<Product[]>([]);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);

  const handleSubmitReport = async () => {
    if (!user || !product) return;
    
    try {
      const { error } = await supabase
        .from('reports')
        .insert({
          user_id: user.id,
          listing_id: product.id,
          reason: reportReason,
          description: reportDescription,
          created_at: new Date().toISOString()
        });

      if (error) throw error;
      
      setShowReportModal(false);
      setReportReason('');
      setReportDescription('');
      alert('Report submitted successfully');
    } catch (err) {
      console.error('Error submitting report:', err);
      alert('Failed to submit report. Please try again.');
    }
  };

  React.useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('listings')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        
        if (!data) {
          setError('Product not found');
          return;
        }

        const formattedProduct: Product = {
          id: data.id,
          title: data.title,
          price: data.price,
          location: data.location,
          description: data.description || '',
          images: data.images || [],
          category: data.category || '',
          specs: data.specs || {},
          seller: {
            id: data.seller_id,
            user_id: data.user_id,
            name: data.seller_name || 'Unknown Seller',
            memberSince: 'Member since 2024',
            listings: 0
          },
          status: data.status || 'pending'
        };

        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('phone_number')
          .eq('id', data.user_id)
          .single();

        if (!profileError && profileData) {
          formattedProduct.seller.phone = profileData.phone_number;
        }

        setProduct(formattedProduct);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Error loading product');
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchProduct();
    }
  }, [id]);

  React.useEffect(() => {
    async function checkFavoriteStatus() {
      if (!user || !product) return;

      try {
        const { data, error } = await supabase
          .from('favorites')
          .select('id')
          .eq('user_id', user.id)
          .eq('listing_id', product.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error checking favorite status:', error);
          return;
        }

        setIsFavorited(!!data);
      } catch (error) {
        console.error('Error checking favorite status:', error);
      }
    }

    checkFavoriteStatus();
  }, [user, product]);

  React.useEffect(() => {
    async function fetchSimilarListings() {
      if (!product) return;
      
      try {
        const { data, error } = await supabase
          .from('listings')
          .select('*')
          .eq('status', 'active')
          .eq('category', product.category)
          .neq('id', product.id)
          .limit(8);

        if (error) throw error;

        const formattedListings: Product[] = data.map(item => ({
          id: item.id,
          title: item.title,
          price: item.price,
          location: item.location,
          description: item.description || '',
          images: item.images || [],
          category: item.category || '',
          specs: item.specs || {},
          seller: {
            id: item.seller_id,
            user_id: item.user_id,
            name: item.seller_name || 'Unknown Seller',
            memberSince: 'Member since 2024',
            listings: 0
          },
          status: item.status || 'pending'
        }));

        setSimilarListings(formattedListings);
      } catch (error) {
        console.error('Error fetching similar listings:', error);
      }
    }

    fetchSimilarListings();
  }, [product]);

  const calculateOffer = (percentage: number) => {
    if (!product?.price) return '0';
    const priceString = typeof product.price === 'number' 
      ? product.price.toString() 
      : product.price;
    const numericPrice = parseFloat(priceString.replace(/[^0-9.]/g, ''));
    const offer = numericPrice * (1 - percentage / 100);
    return offer.toLocaleString('en-US', { 
      style: 'currency', 
      currency: 'AED' 
    });
  };

  const handleSendMessage = async () => {
    if (!user || !product) return;
    
    try {
      const chatUuid = crypto.randomUUID();
      
      // First create a chat
      const { error: chatError } = await supabase
        .from('chats')
        .insert([
          {
            id: chatUuid,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            participant1_id: user.id,
            participant2_id: product.seller.id,
            listing_id: product.id
          }
        ]);

      if (chatError) throw chatError;

      // Then create the message
      const { error: messageError } = await supabase
        .from('messages')
        .insert([
          {
            chat_id: chatUuid,
            sender_id: user.id,
            receiver_id: product.seller.id,
            content: chatMessage,
            created_at: new Date().toISOString()
          }
        ]);

      if (messageError) throw messageError;
      
      setShowChatModal(false);
      setChatMessage('');
      navigate('/messages');
    } catch (err) {
      console.error('Error sending message:', err);
      alert('Failed to send message. Please try again.');
    }
  };

  const handleToggleFavorite = async () => {
    if (!user || !product) {
      // Redirect to login if user is not authenticated
      navigate('/login');
      return;
    }

    try {
      await debugFavorite(user, product);

      if (isFavorited) {
        // Remove from favorites
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('listing_id', product.id);

        if (error) throw error;
        setIsFavorited(false);
      } else {
        // Add to favorites - ensure listing_id is a number
        const { error } = await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            listing_id: parseInt(product.id.toString()), // Ensure it's a number
            created_at: new Date().toISOString()
          });

        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }
        setIsFavorited(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      alert('Error updating favorite status. Please try again.');
    }
  };

  const handleShare = (platform: 'whatsapp' | 'sms' | 'facebook') => {
    if (!product) return;

    const shareUrl = window.location.href;
    const shareText = `Check out this listing: ${product.title} - ${product.price}`;

    switch (platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText + '\n' + shareUrl)}`);
        break;
      case 'sms':
        window.open(`sms:?body=${encodeURIComponent(shareText + '\n' + shareUrl)}`);
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`);
        break;
    }
    setShowShareModal(false);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="aspect-video bg-gray-200 rounded-lg" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-6 bg-gray-200 rounded w-1/2" />
            <div className="h-4 bg-gray-200 rounded w-1/4" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900">
            {error || 'Product not found'}
          </h2>
        </div>
      </div>
    );
  }

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
          <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
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
            <h1 className="text-2xl font-bold mb-2">{product?.title}</h1>
            <p className="text-3xl font-bold text-[#0487b3]">{product?.price}</p>
            <p className="text-gray-500">{product?.location}</p>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={() => setShowCallModal(true)}
              className="flex-1 bg-[#0487b3] text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2"
            >
              <Phone className="w-5 h-5" />
              <span>Call</span>
            </button>
            <button 
              onClick={() => setShowChatModal(true)}
              className="flex-1 border border-[#0487b3] text-[#0487b3] px-4 py-2 rounded-lg flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Chat</span>
            </button>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={handleToggleFavorite}
              className={`flex items-center gap-1 ${
                isFavorited ? 'text-red-500' : 'text-gray-600'
              }`}
            >
              <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
              <span>{isFavorited ? 'Saved' : 'Save'}</span>
            </button>
            <button 
              onClick={() => setShowShareModal(true)}
              className="text-gray-600 flex items-center gap-1"
            >
              <Share2 className="w-5 h-5" />
              <span>Share</span>
            </button>
            <button 
              onClick={() => setShowReportModal(true)} 
              className="text-gray-600 flex items-center gap-1"
            >
              <Flag className="w-5 h-5" />
              <span>Report</span>
            </button>
          </div>

          {product?.specs && Object.keys(product.specs).length > 0 && (
            <div className="border-t pt-6">
              <h2 className="font-semibold mb-4">Specifications</h2>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(product.specs).map(([key, value]) => (
                  value && (
                    <div key={key}>
                      <p className="text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                      <p className="font-medium">{value}</p>
                    </div>
                  )
                ))}
              </div>
            </div>
          )}

          {product?.description && (
            <div className="border-t pt-6">
              <h2 className="font-semibold mb-4">Specifications & Details</h2>
              
              {(() => {
                const sections = parseDescription(product.description);
                
                return (
                  <div className="space-y-6">
                    {/* Main Specifications */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {sections.main.map((spec, index) => {
                        const [key, value] = spec.split(':').map(s => s.trim());
                        const IconComponent = specIcons[key] || Info;
                        
                        return value && (
                          <div key={index} className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                              <IconComponent className="w-4 h-4 text-gray-600" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">{key}</p>
                              <p className="font-medium">{value}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Additional Features */}
                    {sections.features.length > 0 && (
                      <div>
                        <h3 className="font-medium mb-3">Additional Features</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {sections.features.map((feature, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-[#0487b3] rounded-full" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Additional Details */}
                    {sections.details.length > 0 && (
                      <div>
                        <h3 className="font-medium mb-3">Additional Details</h3>
                        <p className="text-gray-600 whitespace-pre-line">
                          {sections.details.join('\n')}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}

          {product?.seller && (
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
          )}
        </div>
      </div>

      {showChatModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Send Message</h2>
              <button 
                onClick={() => setShowChatModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex gap-2">
                {[5, 10, 15].map((percentage) => (
                  <button
                    key={percentage}
                    onClick={() => setChatMessage(`I would like to offer ${calculateOffer(percentage)} for this item. Is this okay?`)}
                    className="flex-1 px-3 py-2 border rounded-lg hover:bg-gray-50"
                  >
                    {percentage}% off
                    <div className="text-sm text-gray-500">
                      {calculateOffer(percentage)}
                    </div>
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Message
                </label>
                <textarea
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  className="w-full p-2 border rounded-lg h-32"
                  placeholder="Type your message here..."
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowChatModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendMessage}
                  disabled={!chatMessage.trim()}
                  className="px-4 py-2 bg-[#0487b3] text-white rounded-lg hover:bg-[#037299] disabled:opacity-50"
                >
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showCallModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Elohome is concerned about your safety</h2>
              <button 
                onClick={() => setShowCallModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-medium text-yellow-800 mb-2">Important Safety Tips:</h3>
                <ul className="text-yellow-700 space-y-2 list-disc pl-4">
                  <li>Always inspect the product in person before making any payment</li>
                  <li>Never pay for delivery before seeing the product</li>
                  <li>Meet in a safe, public location when possible</li>
                  <li>Be cautious of deals that seem too good to be true</li>
                </ul>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowCallModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (product?.seller.phone) {
                      window.location.href = `tel:${product.seller.phone}`;
                      setShowCallModal(false);
                    } else {
                      alert('Seller phone number not available');
                    }
                  }}
                  className="px-4 py-2 bg-[#0487b3] text-white rounded-lg hover:bg-[#037299]"
                >
                  Continue with Call
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {similarListings.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Similar Ads</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {similarListings.map((item) => (
              <Link
                key={item.id}
                to={`/product/${item.id}`}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="aspect-video">
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <p className="text-xl font-semibold text-[#0487b3] mb-1">{item.price}</p>
                  <h3 className="font-medium mb-2 line-clamp-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.location}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Report Listing</h2>
              <button 
                onClick={() => setShowReportModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason for Report
                </label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  required
                >
                  <option value="">Select a reason</option>
                  <option value="inappropriate">Inappropriate Content</option>
                  <option value="spam">Spam</option>
                  <option value="fake">Fake Listing</option>
                  <option value="offensive">Offensive Content</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Details
                </label>
                <textarea
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                  className="w-full p-2 border rounded-lg h-32"
                  placeholder="Please provide more details about your report..."
                  required
                />
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitReport}
                  disabled={!reportReason || !reportDescription.trim()}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  Submit Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Share Listing</h2>
              <button 
                onClick={() => setShowShareModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => handleShare('whatsapp')}
                className="w-full p-3 flex items-center gap-3 rounded-lg hover:bg-gray-50 border"
              >
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </div>
                <span className="font-medium">Share via WhatsApp</span>
              </button>

              <button
                onClick={() => handleShare('sms')}
                className="w-full p-3 flex items-center gap-3 rounded-lg hover:bg-gray-50 border"
              >
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <span className="font-medium">Share via SMS</span>
              </button>

              <button
                onClick={() => handleShare('facebook')}
                className="w-full p-3 flex items-center gap-3 rounded-lg hover:bg-gray-50 border"
              >
                <div className="w-10 h-10 bg-[#1877f2] rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </div>
                <span className="font-medium">Share via Facebook</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}