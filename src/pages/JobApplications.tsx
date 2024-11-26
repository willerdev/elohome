import React from 'react';
import { PageHeader } from '../components/PageHeader';
import { Briefcase, MapPin, Calendar, ExternalLink } from 'lucide-react';

interface JobApplication {
  id: number;
  jobTitle: string;
  company: string;
  location: string;
  appliedDate: string;
  status: 'pending' | 'reviewed' | 'rejected' | 'shortlisted';
}

const applications: JobApplication[] = [
  {
    id: 1,
    jobTitle: 'Senior Frontend Developer',
    company: 'Tech Solutions LLC',
    location: 'Dubai Marina',
    appliedDate: '2024-03-15',
    status: 'pending'
  },
  {
    id: 2,
    jobTitle: 'UI/UX Designer',
    company: 'Creative Agency',
    location: 'Business Bay',
    appliedDate: '2024-03-14',
    status: 'reviewed'
  },
  {
    id: 3,
    jobTitle: 'Product Manager',
    company: 'StartUp Hub',
    location: 'DIFC',
    appliedDate: '2024-03-10',
    status: 'shortlisted'
  }
];

const getStatusColor = (status: JobApplication['status']) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'reviewed':
      return 'bg-blue-100 text-blue-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    case 'shortlisted':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export function JobApplications() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader title="My Job Applications" />
      
      <div className="max-w-3xl mx-auto px-4 py-8">
        {applications.map((application) => (
          <div 
            key={application.id}
            className="bg-white rounded-lg shadow-sm mb-4 p-4"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold mb-1">{application.jobTitle}</h3>
                <p className="text-gray-600">{application.company}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm capitalize ${getStatusColor(application.status)}`}>
                {application.status}
              </span>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{application.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Applied {new Date(application.appliedDate).toLocaleDateString()}</span>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t flex justify-between items-center">
              <button className="text-[#0487b3] hover:underline flex items-center gap-1">
                <ExternalLink className="w-4 h-4" />
                View Job
              </button>
              <button className="text-red-600 hover:underline">
                Withdraw Application
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}