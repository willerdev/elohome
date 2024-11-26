import React from 'react';
import { PageHeader } from '../components/PageHeader';
import { 
  CheckCircle2, 
  Shield, 
  TrendingUp, 
  Users,
  ChevronRight
} from 'lucide-react';

const benefits = [
  {
    icon: Shield,
    title: 'Enhanced Trust',
    description: 'Build credibility with a verified badge on your profile and listings'
  },
  {
    icon: TrendingUp,
    title: 'Better Visibility',
    description: 'Your listings appear higher in search results'
  },
  {
    icon: Users,
    title: 'Priority Support',
    description: 'Get faster responses from our customer support team'
  }
];

export function GetVerified() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader title="Get Verified" />
      
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <CheckCircle2 className="w-8 h-8 text-[#0487b3]" />
            <h1 className="text-2xl font-bold">Get Verified</h1>
          </div>
          
          <p className="text-gray-600 mb-8">
            Join our verified sellers program to build trust with buyers and increase your sales potential.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <benefit.icon className="w-8 h-8 text-[#0487b3] mb-3" />
                <h3 className="font-semibold mb-2">{benefit.title}</h3>
                <p className="text-sm text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
          
          <div className="space-y-4">
            <div className="border rounded-lg">
              <div className="p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">Basic Verification</h3>
                  <p className="text-sm text-gray-600">Verify your identity with government ID</p>
                </div>
                <button className="flex items-center gap-1 text-[#0487b3]">
                  Start <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="border rounded-lg">
              <div className="p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">Business Verification</h3>
                  <p className="text-sm text-gray-600">Verify your business with trade license</p>
                </div>
                <button className="flex items-center gap-1 text-[#0487b3]">
                  Start <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-6">
          <h2 className="font-semibold mb-2">Need help getting verified?</h2>
          <p className="text-sm text-gray-600 mb-4">
            Our support team is here to assist you with the verification process.
          </p>
          <button className="text-[#0487b3] font-medium">Contact Support</button>
        </div>
      </div>
    </div>
  );
}