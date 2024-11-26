import React, { useEffect, useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { 
  Package, 
  Eye, 
  MessageCircle, 
  Edit, 
  Trash2,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface Listing {
  id: number;
  title: string;
  price: string;
  location: string;
  images: string[];
  status: 'active' | 'pending';
  views: number;
  messages: number;
  created_at: string;
  user_id: string;
}

export function MyAds() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    price: '',
    location: '',
    description: ''
  });
  const { user } = useAuth();

  useEffect(() => {
    async function fetchListings() {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('listings')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setListings(data || []);
      } catch (error) {
        console.error('Error fetching listings:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchListings();
  }, [user]);

  const handleUpdate = async () => {
    if (!selectedListing || !user) return;

    try {
      const { error } = await supabase
        .from('listings')
        .update({
          title: editFormData.title,
          price: editFormData.price,
          location: editFormData.location,
          description: editFormData.description
        })
        .eq('id', selectedListing.id)
        .eq('user_id', user.id);

      if (error) throw error;

      // Update local state
      setListings(prevListings =>
        prevListings.map(listing =>
          listing.id === selectedListing.id
            ? { ...listing, ...editFormData }
            : listing
        )
      );

      setShowEditModal(false);
    } catch (error) {
      console.error('Error updating listing:', error);
      alert('Error updating listing. Please try again.');
    }
  };

  const handleDelete = async () => {
    if (!selectedListing || !user) return;

    try {
      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', selectedListing.id)
        .eq('user_id', user.id);

      if (error) throw error;

      // Update local state
      setListings(prevListings =>
        prevListings.filter(listing => listing.id !== selectedListing.id)
      );

      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting listing:', error);
      alert('Error deleting listing. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PageHeader title="My Ads" />
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm h-40" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader title="My Ads" />
      
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Package className="w-6 h-6" />
            <h1 className="text-2xl font-bold">My Ads</h1>
          </div>
          <Link 
            to="/post-ad"
            className="bg-[#0487b3] text-white px-4 py-2 rounded-lg hover:bg-[#037299]"
          >
            Post New Ad
          </Link>
        </div>

        {listings.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-medium text-gray-900 mb-2">No ads yet</h2>
            <p className="text-gray-600 mb-6">Start selling by posting your first ad</p>
            <Link 
              to="/post-ad"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0487b3] hover:bg-[#037299]"
            >
              Post New Ad
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {listings.map((ad) => (
              <div key={ad.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="flex">
                  <div className="w-48 h-32">
                    <img
                      src={ad.images[0]}
                      alt={ad.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <Link 
                          to={`/product/${ad.id}`}
                          className="text-lg font-medium hover:text-[#0487b3]"
                        >
                          {ad.title}
                        </Link>
                        <p className="text-[#0487b3] font-bold">{ad.price} Frw</p>
                        <p className="text-sm text-gray-500">{ad.location}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {ad.status === 'active' ? (
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Active
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            Pending
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{ad.views} views</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="w-4 h-4" />
                          <span>{ad.messages} messages</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <button 
                          className="p-2 text-gray-600 hover:text-[#0487b3]"
                          onClick={() => {
                            setSelectedListing(ad);
                            setEditFormData({
                              title: ad.title,
                              price: ad.price,
                              location: ad.location,
                              description: ad.description || ''
                            });
                            setShowEditModal(true);
                          }}
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button 
                          className="p-2 text-gray-600 hover:text-red-500"
                          onClick={() => {
                            setSelectedListing(ad);
                            setShowDeleteModal(true);
                          }}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Edit Listing</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={editFormData.title}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price
                </label>
                <input
                  type="text"
                  value={editFormData.price}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, price: e.target.value }))}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={editFormData.location}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={editFormData.description}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-2 border rounded-lg h-32"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-[#0487b3] text-white rounded-lg hover:bg-[#037299]"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Delete Listing</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this listing? This action cannot be undone.
            </p>
            
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}