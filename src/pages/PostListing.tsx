import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Upload, X } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

// Import categories from Categories component
const categories = [
  {
    title: 'Cars',
    items: ['Cars', 'Rental Cars', 'New Cars', 'Export Cars']
  },
  {
    title: 'Property for Rent',
    items: ['Residential', 'Commercial', 'Rooms For Rent', 'Monthly Short Term']
  },
  {
    title: 'Property for Sale',
    items: ['Residential', 'Commercial', 'New Projects', 'Off-Plan']
  },
  {
    title: 'Classifieds',
    items: ['Electronics', 'Computers & Networking', 'Clothing & Accessories', 'Jewelry & Watches']
  },
  // ... other categories
];

export function PostListing() {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState('');
  const [selectedSubCategory, setSelectedSubCategory] = React.useState('');
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [formData, setFormData] = React.useState({
    category: '',
    subcategory: '',
    title: '',
    description: '',
    images: [] as string[],
    price: '',
    location: '',
    condition: '',
    brand: '',
    model: '',
    year: ''
  });

  const steps = [
    {
      title: 'Choose Category',
      description: 'Select a category for your listing'
    },
    {
      title: 'Add Details',
      description: 'Provide information about your item'
    },
    {
      title: 'Upload Photos',
      description: 'Add photos of your item'
    },
    {
      title: 'Set Price',
      description: 'Set your price and location'
    }
  ];

  const handleNext = () => {
    if (currentStep === 0 && !selectedCategory) {
      alert('Please select a category');
      return;
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(current => current + 1);
    } else {
      handleSubmit();
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !user) return;

    // Check if adding new images would exceed the limit
    if (formData.images.length + files.length > 20) {
      alert('Maximum 8 images allowed per listing');
      return;
    }

    setLoading(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('elohomestorage')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('elohomestorage')
          .getPublicUrl(filePath);

        return publicUrl;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls]
      }));
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Error uploading images. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const listingData = {
        user_id: user.id,
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price) || 0,
        location: formData.location,
        category: formData.category,
        images: formData.images,
        status: 'active'
      };

      const { error } = await supabase
        .from('listings')
        .insert([listingData]);

      if (error) throw error;

      navigate('/my-ads');
    } catch (error) {
      console.error('Error creating listing:', error);
      alert('Error creating listing. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories.map((category) => (
                <div 
                  key={category.title}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors
                    ${selectedCategory === category.title 
                      ? 'border-[#0487b3] bg-blue-50' 
                      : 'border-gray-200 hover:border-[#0487b3]'
                    }`}
                  onClick={() => {
                    setSelectedCategory(category.title);
                    setFormData(prev => ({ 
                      ...prev, 
                      category: category.title,
                      description: getCategoryTemplate(category.title, '') 
                    }));
                  }}
                >
                  <h3 className="font-medium mb-2">{category.title}</h3>
                  {selectedCategory === category.title && (
                    <div className="space-y-2">
                      {category.items.map((item) => (
                        <label key={item} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="subcategory"
                            value={item}
                            checked={selectedSubCategory === item}
                            onChange={(e) => {
                              setSelectedSubCategory(e.target.value);
                              setFormData(prev => ({ 
                                ...prev, 
                                subcategory: e.target.value,
                                description: getCategoryTemplate(selectedCategory, e.target.value) 
                              }));
                            }}
                            className="text-[#0487b3]"
                          />
                          <span className="text-sm">{item}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full p-2 border rounded-lg"
                placeholder="Enter a title for your listing"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full p-2 border rounded-lg h-62"
                placeholder="Describe your item"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <input
                type="file"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
                accept="image/*"
                disabled={formData.images.length >= 20}
              />
              <label
                htmlFor="image-upload"
                className={`cursor-pointer flex flex-col items-center ${
                  formData.images.length >= 20 ? 'opacity-50' : ''
                }`}
              >
                <Upload className="w-12 h-12 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600">
                  Click to upload images ({formData.images.length}/20)
                </span>
                {formData.images.length >= 20 && (
                  <span className="text-xs text-red-500 mt-1">
                    Maximum number of images reached
                  </span>
                )}
              </label>
            </div>
            
            {formData.images.length > 0 && (
              <div className="grid grid-cols-3 gap-4">
                {formData.images.map((url, index) => (
                  <div key={url} className="relative">
                    <img
                      src={url}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          images: prev.images.filter(img => img !== url)
                        }));
                      }}
                      className="absolute top-1 right-1 p-1 bg-white rounded-full shadow-sm"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (Frw)
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                className="w-full p-2 border rounded-lg"
                placeholder="Enter price"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="w-full p-2 border rounded-lg"
                placeholder="Enter location"
              />
            </div>
          </div>
        );
    }
  };

  const getCategoryTemplate = (category: string, subcategory: string) => {
    switch (category) {
      case 'Motors':
        return `Transmission:
Fuel Type:
Year:
Kilometers:
Regional Specs:
Body Type:
Color:
Warranty:
Service History:
Number of Previous Owners:

Additional Details:`;

      case 'Property for Rent':
      case 'Property for Sale':
        return `Property Type:
Bedrooms:
Bathrooms:
Size (sqft):
Furnishing Status:
Parking Spaces:
Building/Community:
Available From:
Maintenance Fee:

Additional Features:
- 
- 

Additional Details:`;

      case 'Classifieds':
        switch (subcategory) {
          case 'Electronics':
          case 'Computers & Networking':
            return `Brand:
Model:
Age:
Condition:
Warranty Status:
Included Accessories:

Technical Specifications:
- 
- 

Additional Details:`;

          case 'Clothing & Accessories':
          case 'Jewelry & Watches':
            return `Brand:
Size/Dimensions:
Condition:
Material:
Color:
Original Price:
Authentication/Certificate (if applicable):

Additional Details:`;

          default:
            return 'Please provide detailed description of your item...';
        }

      default:
        return 'Please provide detailed description of your item...';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader 
        title="Post an Ad"
        rightContent={
          <div className="text-sm text-gray-500">
            Step {currentStep + 1} of {steps.length}
          </div>
        }
      />
      <div className="max-w-3xl mx-auto px-4">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className={`flex-1 relative ${
                  index < steps.length - 1 ? 'after:content-[""] after:absolute after:top-3 after:left-1/2 after:w-full after:h-0.5 after:bg-gray-200' : ''
                }`}
              >
                <div className="relative z-10 flex flex-col items-center">
                  <div
                    className={`w-6 h-6 rounded-full ${
                      index <= currentStep ? 'bg-[#0487b3]' : 'bg-gray-200'
                    } text-white text-sm flex items-center justify-center`}
                  >
                    {index + 1}
                  </div>
                  <span className="mt-2 text-xs text-gray-500">{step.title}</span>
                </div>
              </div>
            ))}
          </div>
          <h2 className="text-2xl font-bold">{steps[currentStep].title}</h2>
          <p className="text-gray-600">{steps[currentStep].description}</p>
        </div>

        {/* Form Steps */}
        <div className="space-y-6">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8 pb-8">
          <button
            onClick={() => setCurrentStep(current => current - 1)}
            disabled={currentStep === 0}
            className="px-6 py-2 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            disabled={loading}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg ${
              currentStep === steps.length - 1
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-[#0487b3] text-white hover:bg-[#037299]'
            }`}
          >
            {loading ? (
              <span>Loading...</span>
            ) : (
              <>
                {currentStep === steps.length - 1 ? 'Post Listing' : 'Next'}
                {currentStep < steps.length - 1 && <ArrowRight className="w-4 h-4" />}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}