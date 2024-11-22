import React from 'react';
import { ArrowLeft, ArrowRight, Image as ImageIcon, X, Plus } from 'lucide-react';

interface Step {
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    title: 'Details',
    description: 'Add basic information about your listing'
  },
  {
    title: 'Media',
    description: 'Upload photos and media'
  },
  {
    title: 'Review',
    description: 'Review and post your listing'
  }
];

const categories = [
  { id: 'motors', name: 'Motors', icon: '🚗' },
  { id: 'property', name: 'Property', icon: '🏠' },
  { id: 'jobs', name: 'Jobs', icon: '💼' },
  { id: 'electronics', name: 'Electronics', icon: '📱' },
  { id: 'furniture', name: 'Furniture', icon: '🛋️' },
  { id: 'fashion', name: 'Fashion', icon: '👕' }
];

export function PostListing() {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [formData, setFormData] = React.useState({
    category: '',
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

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(current => current + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(current => current - 1);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newImages]
      }));
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-2 border rounded-lg focus:ring-[#0487b3] focus:border-[#0487b3]"
                placeholder="Enter a descriptive title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="w-full px-4 py-2 border rounded-lg focus:ring-[#0487b3] focus:border-[#0487b3]"
                placeholder="Describe your item in detail"
              />
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {formData.images.map((image, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                  <img src={image} alt="" className="w-full h-full object-cover" />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm hover:bg-gray-100"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {formData.images.length < 8 && (
                <label className="aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:border-[#0487b3] transition-colors">
                  <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">Add Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              )}
            </div>
            <p className="text-sm text-gray-500">
              Add up to 8 photos. First photo will be the cover image.
            </p>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  AED
                </span>
                <input
                  type="number"
                  value={formData.price}
                  onChange={e => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  className="w-full px-4 py-2 pl-12 border rounded-lg focus:ring-[#0487b3] focus:border-[#0487b3]"
                  placeholder="Enter price"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="w-full px-4 py-2 border rounded-lg focus:ring-[#0487b3] focus:border-[#0487b3]"
                placeholder="Enter location"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
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

        {/* Step Content */}
        <div className="bg-white rounded-lg p-6 mb-6">
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            onClick={handleBack}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg ${
              currentStep === 0
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <button
            onClick={handleNext}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg ${
              currentStep === steps.length - 1
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-[#0487b3] text-white hover:bg-[#037299]'
            }`}
          >
            {currentStep === steps.length - 1 ? 'Post Listing' : 'Next'}
            {currentStep < steps.length - 1 && <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}