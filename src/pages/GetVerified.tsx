import React, { useState, useEffect } from 'react';
import { PageHeader } from '../components/PageHeader';
import { 
  CheckCircle2, 
  Shield, 
  TrendingUp, 
  Users,
  ChevronRight,
  Upload,
  X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface VerificationStatus {
  type: string;
  status: string;
  documents: {
    document_type: string;
    document_url: string;
    status: string;
  }[];
}

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
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedType, setSelectedType] = useState<'basic' | 'business' | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus | null>(null);
  const [files, setFiles] = useState<{ [key: string]: File }>({});
  const [requirements, setRequirements] = useState<any[]>([]);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [supportForm, setSupportForm] = useState({
    subject: '',
    message: '',
    priority: 'normal'
  });

  useEffect(() => {
    if (user) {
      fetchVerificationStatus();
      fetchRequirements();
    }
  }, [user]);

  const fetchVerificationStatus = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_verifications')
        .select(`
          type: verification_type,
          status,
          documents:verification_documents(
            document_type,
            document_url,
            status
          )
        `)
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setVerificationStatus(data);
    } catch (error) {
      console.error('Error fetching verification status:', error);
    }
  };

  const fetchRequirements = async () => {
    try {
      console.log('Fetching requirements...');
      const { data, error } = await supabase
        .from('verification_requirements')
        .select('*')
        .order('verification_type', { ascending: true });

      if (error) throw error;
      
      console.log('Requirements data:', data);
      setRequirements(data || []);
    } catch (error) {
      console.error('Error fetching requirements:', error);
    }
  };

  const handleFileChange = (documentType: string, file: File) => {
    setFiles(prev => ({
      ...prev,
      [documentType]: file
    }));
  };

  const handleSubmitVerification = async () => {
    if (!user || !selectedType) return;
    setLoading(true);

    try {
      // Create verification record
      const { data: verificationData, error: verificationError } = await supabase
        .from('user_verifications')
        .insert({
          user_id: user.id,
          verification_type: selectedType,
          status: 'pending'
        })
        .select()
        .single();

      if (verificationError) throw verificationError;

      // Upload documents and create records
      const uploadPromises = Object.entries(files).map(async ([docType, file]) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${verificationData.id}/${docType}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('verification_documents')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('verification_documents')
          .getPublicUrl(fileName);

        return supabase
          .from('verification_documents')
          .insert({
            verification_id: verificationData.id,
            document_type: docType,
            document_url: publicUrl,
            status: 'pending'
          });
      });

      await Promise.all(uploadPromises);
      
      setShowUploadModal(false);
      fetchVerificationStatus();
    } catch (error) {
      console.error('Error submitting verification:', error);
      alert('Error submitting verification. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSupportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('support_tickets')
        .insert({
          user_id: user.id,
          subject: supportForm.subject,
          message: supportForm.message,
          priority: supportForm.priority
        });

      if (error) throw error;
      
      setShowSupportModal(false);
      setSupportForm({ subject: '', message: '', priority: 'normal' });
      alert('Support ticket submitted successfully!');
    } catch (error) {
      console.error('Error submitting support ticket:', error);
      alert('Error submitting support ticket. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
                <button 
                  className="flex items-center gap-1 text-[#0487b3]" 
                  onClick={() => { 
                    console.log('Start button clicked');
                    console.log('Selected type:', selectedType);
                    setSelectedType('basic'); 
                    console.log('Modal state before:', showUploadModal);
                    setShowUploadModal(true);
                    console.log('Modal state after:', true);
                  }}
                >
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
                <button className="flex items-center gap-1 text-[#0487b3]" onClick={() => { setSelectedType('business'); setShowUploadModal(true); }}>
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
          <button 
            onClick={() => setShowSupportModal(true)}
            className="text-[#0487b3] font-medium hover:underline"
          >
            Contact Support
          </button>
        </div>
      </div>
      
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-lg w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {selectedType === 'basic' ? 'Basic Verification' : 'Business Verification'}
              </h2>
              <button 
                onClick={() => setShowUploadModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {requirements
                .filter(req => req.verification_type === selectedType)
                .map((requirement) => (
                  <div key={requirement.id} className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">{requirement.document_name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{requirement.description}</p>
                    
                    <div className="flex items-center gap-3">
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => handleFileChange(requirement.document_type, e.target.files?.[0]!)}
                        className="hidden"
                        id={`file-${requirement.id}`}
                      />
                      <label
                        htmlFor={`file-${requirement.id}`}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Upload Document</span>
                      </label>
                      {files[requirement.document_type] && (
                        <span className="text-sm text-green-600">
                          {files[requirement.document_type].name}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitVerification}
                disabled={loading || Object.keys(files).length === 0}
                className="px-4 py-2 bg-[#0487b3] text-white rounded-lg hover:bg-[#037299] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Submit for Verification'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showSupportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-lg w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Contact Support</h2>
              <button 
                onClick={() => setShowSupportModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSupportSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  value={supportForm.subject}
                  onChange={(e) => setSupportForm(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Enter subject"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  value={supportForm.priority}
                  onChange={(e) => setSupportForm(prev => ({ ...prev, priority: e.target.value }))}
                  className="w-full p-2 border rounded-lg"
                  required
                >
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  value={supportForm.message}
                  onChange={(e) => setSupportForm(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full p-2 border rounded-lg h-32"
                  placeholder="Describe your issue..."
                  required
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowSupportModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-[#0487b3] text-white rounded-lg hover:bg-[#037299] disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : 'Submit Ticket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}