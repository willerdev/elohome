import React, { useEffect, useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { 
  Briefcase, 
  GraduationCap, 
  Award, 
  Languages, 
  Plus,
  Pencil,
  X,
  Save
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface JobProfileData {
  full_name: string;
  professional_title: string;
  years_experience: string;
}

interface WorkExperience {
  id: string;
  title: string;
  company: string;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  description?: string;
}

interface Education {
  id: string;
  degree: string;
  institution: string;
  start_date: string;
  end_date: string;
  field_of_study?: string;
}

export function JobProfile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState<'basic' | 'work' | 'education' | 'skills' | null>(null);
  
  const [profile, setProfile] = useState<JobProfileData>({
    full_name: '',
    professional_title: '',
    years_experience: ''
  });
  
  const [workExperiences, setWorkExperiences] = useState<WorkExperience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  
  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      // Load basic profile
      const { data: profileData } = await supabase
        .from('job_profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (profileData) {
        setProfile(profileData);
      }

      // Load work experiences
      const { data: workData } = await supabase
        .from('work_experiences')
        .select('*')
        .eq('profile_id', user?.id)
        .order('start_date', { ascending: false });

      if (workData) {
        setWorkExperiences(workData);
      }

      // Load education
      const { data: eduData } = await supabase
        .from('education')
        .select('*')
        .eq('profile_id', user?.id)
        .order('start_date', { ascending: false });

      if (eduData) {
        setEducation(eduData);
      }

      // Load skills
      const { data: skillsData } = await supabase
        .from('profile_skills')
        .select('skill')
        .eq('profile_id', user?.id);

      if (skillsData) {
        setSkills(skillsData.map(s => s.skill));
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBasicInfoSave = async () => {
    try {
      const { error } = await supabase
        .from('job_profiles')
        .upsert({
          id: user?.id,
          ...profile,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      setEditMode(null);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const handleAddWorkExperience = async () => {
    try {
      const { data, error } = await supabase
        .from('work_experiences')
        .insert({
          profile_id: user?.id,
          title: '',
          company: '',
          start_date: new Date().toISOString(),
          is_current: true,
          description: ''
        })
        .select()
        .single();

      if (error) throw error;
      
      if (data) {
        setWorkExperiences(prev => [...prev, data]);
        setEditMode('work');
      }
    } catch (error) {
      console.error('Error adding work experience:', error);
    }
  };

  const handleAddEducation = async () => {
    try {
      const { data, error } = await supabase
        .from('education')
        .insert({
          profile_id: user?.id,
          degree: '',
          institution: '',
          start_date: new Date().toISOString(),
          end_date: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      
      if (data) {
        setEducation(prev => [...prev, data]);
        setEditMode('education');
      }
    } catch (error) {
      console.error('Error adding education:', error);
    }
  };

  const handleAddSkill = async () => {
    if (!newSkill.trim()) return;

    try {
      const { error } = await supabase
        .from('profile_skills')
        .insert({
          profile_id: user?.id,
          skill: newSkill.trim()
        });

      if (error) throw error;

      setSkills(prev => [...prev, newSkill.trim()]);
      setNewSkill('');
    } catch (error) {
      console.error('Error adding skill:', error);
    }
  };

  const handleRemoveSkill = async (skill: string) => {
    try {
      const { error } = await supabase
        .from('profile_skills')
        .delete()
        .eq('profile_id', user?.id)
        .eq('skill', skill);

      if (error) throw error;

      setSkills(prev => prev.filter(s => s !== skill));
    } catch (error) {
      console.error('Error removing skill:', error);
    }
  };

  const handleSkillsSave = async () => {
    try {
      // First delete all existing skills
      await supabase
        .from('profile_skills')
        .delete()
        .eq('profile_id', user?.id);

      // Then insert all current skills
      const { error } = await supabase
        .from('profile_skills')
        .insert(
          skills.map(skill => ({
            profile_id: user?.id,
            skill: skill
          }))
        );

      if (error) throw error;
      setEditMode(null);
    } catch (error) {
      console.error('Error saving skills:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader title="My Job Profile" />
      
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Basic Info */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-semibold">Basic Information</h2>
            {editMode !== 'basic' ? (
              <button 
                onClick={() => setEditMode('basic')}
                className="text-[#0487b3] hover:underline flex items-center gap-1"
              >
                <Pencil className="w-4 h-4" />
                Edit
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => setEditMode(null)}
                  className="text-gray-600 hover:underline flex items-center gap-1"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  onClick={handleBasicInfoSave}
                  className="text-[#0487b3] hover:underline flex items-center gap-1"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
              </div>
            )}
          </div>

          {editMode === 'basic' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profile.full_name}
                  onChange={(e) => setProfile(prev => ({ ...prev, full_name: e.target.value }))}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Professional Title
                </label>
                <input
                  type="text"
                  value={profile.professional_title}
                  onChange={(e) => setProfile(prev => ({ ...prev, professional_title: e.target.value }))}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Years of Experience
                </label>
                <input
                  type="text"
                  value={profile.years_experience}
                  onChange={(e) => setProfile(prev => ({ ...prev, years_experience: e.target.value }))}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <p><span className="font-medium">Full Name:</span> {profile.full_name}</p>
              <p><span className="font-medium">Professional Title:</span> {profile.professional_title}</p>
              <p><span className="font-medium">Years of Experience:</span> {profile.years_experience}</p>
            </div>
          )}
        </div>

        {/* Work Experience Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-semibold">Work Experience</h2>
            <button 
              onClick={handleAddWorkExperience}
              className="text-[#0487b3] hover:underline flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              Add Experience
            </button>
          </div>

          <div className="space-y-4">
            {workExperiences.map((experience) => (
              <div key={experience.id} className="border-b pb-4 last:border-0 last:pb-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{experience.title}</h3>
                    <p className="text-gray-600">{experience.company}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(experience.start_date).toLocaleDateString()} - 
                      {experience.is_current ? 'Present' : new Date(experience.end_date!).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button className="text-gray-400 hover:text-[#0487b3]">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button className="text-gray-400 hover:text-red-500">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Education Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-semibold">Education</h2>
            <button 
              onClick={handleAddEducation}
              className="text-[#0487b3] hover:underline flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              Add Education
            </button>
          </div>

          <div className="space-y-4">
            {education.map((edu) => (
              <div key={edu.id} className="border-b pb-4 last:border-0 last:pb-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{edu.degree}</h3>
                    <p className="text-gray-600">{edu.institution}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(edu.start_date).toLocaleDateString()} - 
                      {new Date(edu.end_date).toLocaleDateString()}
                    </p>
                    {edu.field_of_study && (
                      <p className="text-sm text-gray-600">{edu.field_of_study}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button className="text-gray-400 hover:text-[#0487b3]">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button className="text-gray-400 hover:text-red-500">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skills Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-semibold">Skills</h2>
            {editMode !== 'skills' ? (
              <button 
                onClick={() => setEditMode('skills')}
                className="text-[#0487b3] hover:underline flex items-center gap-1"
              >
                <Pencil className="w-4 h-4" />
                Edit
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => setEditMode(null)}
                  className="text-gray-600 hover:underline flex items-center gap-1"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  onClick={handleSkillsSave}
                  className="text-[#0487b3] hover:underline flex items-center gap-1"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
              </div>
            )}
          </div>

          {editMode === 'skills' ? (
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  className="flex-1 p-2 border rounded-lg"
                  placeholder="Add a skill"
                />
                <button
                  onClick={handleAddSkill}
                  className="px-4 py-2 bg-[#0487b3] text-white rounded-lg hover:bg-[#037299]"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full"
                  >
                    <span>{skill}</span>
                    <button
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-gray-100 px-3 py-1 rounded-full text-gray-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}