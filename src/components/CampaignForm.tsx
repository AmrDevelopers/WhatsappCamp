import React, { useState } from 'react';
import { ArrowLeft, Calendar, Users, MessageSquare, Send, Image } from 'lucide-react';
import { Campaign } from '../types';
import MediaUpload from './MediaUpload';

interface CampaignFormProps {
  campaign?: Campaign | null;
  onSave: (campaign: Partial<Campaign>) => void;
  onCancel: () => void;
  loading?: boolean;
}

const CampaignForm: React.FC<CampaignFormProps> = ({ campaign, onSave, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    name: campaign?.name || '',
    description: campaign?.description || '',
    messageTemplate: campaign?.messageTemplate || '',
    mediaUrl: campaign?.mediaUrl || '',
    mediaType: campaign?.mediaType || '',
    targetAudience: campaign?.targetAudience || [],
    scheduledDate: campaign?.scheduledDate ? new Date(campaign.scheduledDate).toISOString().slice(0, 16) : '',
  });
  
  const [step, setStep] = useState(1);
  const [audienceInput, setAudienceInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      scheduledDate: formData.scheduledDate ? new Date(formData.scheduledDate) : undefined,
    });
  };

  const addAudience = () => {
    if (audienceInput.trim() && !formData.targetAudience.includes(audienceInput.trim())) {
      setFormData({
        ...formData,
        targetAudience: [...formData.targetAudience, audienceInput.trim()]
      });
      setAudienceInput('');
    }
  };

  const removeAudience = (audience: string) => {
    setFormData({
      ...formData,
      targetAudience: formData.targetAudience.filter(a => a !== audience)
    });
  };

  const handleMediaUpload = (url: string, type: string) => {
    setFormData({
      ...formData,
      mediaUrl: url,
      mediaType: type
    });
  };

  const isStepValid = (stepNumber: number) => {
    switch (stepNumber) {
      case 1:
        return formData.name.trim() && formData.description.trim();
      case 2:
        return formData.messageTemplate.trim();
      case 3:
        return formData.targetAudience.length > 0;
      default:
        return true;
    }
  };

  const steps = [
    { number: 1, title: 'Basic Info', icon: MessageSquare },
    { number: 2, title: 'Message & Media', icon: Image },
    { number: 3, title: 'Audience', icon: Users },
    { number: 4, title: 'Schedule', icon: Calendar },
  ];

  const renderPreview = () => {
    const previewText = formData.messageTemplate.replace('{{name}}', 'John Doe');
    
    return (
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-2">Message Preview</h3>
        <div className="bg-white rounded-lg p-4 border max-w-sm">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-medium">B</span>
            </div>
            <div className="flex-1">
              <div className="bg-gray-100 rounded-lg p-3">
                {formData.mediaUrl && (
                  <div className="mb-2">
                    {formData.mediaType === 'image' ? (
                      <img
                        src={`http://localhost:3001${formData.mediaUrl}`}
                        alt="Media preview"
                        className="w-full h-32 object-cover rounded"
                      />
                    ) : formData.mediaType === 'video' ? (
                      <video
                        src={`http://localhost:3001${formData.mediaUrl}`}
                        className="w-full h-32 object-cover rounded"
                        controls
                      />
                    ) : (
                      <div className="flex items-center p-2 bg-blue-50 rounded">
                        <MessageSquare className="w-4 h-4 text-blue-600 mr-2" />
                        <span className="text-sm text-blue-800">Document attached</span>
                      </div>
                    )}
                  </div>
                )}
                <p className="text-sm text-gray-900">
                  {previewText || 'Your message will appear here...'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <button
          onClick={onCancel}
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          disabled={loading}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Campaigns
        </button>
        <h1 className="text-3xl font-bold text-gray-900">
          {campaign ? 'Edit Campaign' : 'Create New Campaign'}
        </h1>
        <p className="text-gray-600 mt-2">Set up your WhatsApp marketing campaign</p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((s, index) => {
            const Icon = s.icon;
            return (
              <div key={s.number} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  step === s.number 
                    ? 'border-emerald-600 bg-emerald-600 text-white' 
                    : step > s.number
                    ? 'border-emerald-600 bg-emerald-600 text-white'
                    : 'border-gray-300 bg-white text-gray-400'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  step >= s.number ? 'text-emerald-600' : 'text-gray-400'
                }`}>
                  {s.title}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    step > s.number ? 'bg-emerald-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Campaign Details</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Campaign Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Enter campaign name"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Describe your campaign"
                required
                disabled={loading}
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Message & Media</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Media (Optional)
              </label>
              <MediaUpload
                onUpload={handleMediaUpload}
                currentMedia={formData.mediaUrl ? { url: formData.mediaUrl, type: formData.mediaType } : undefined}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message Content *
              </label>
              <textarea
                value={formData.messageTemplate}
                onChange={(e) => setFormData({ ...formData, messageTemplate: e.target.value })}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Write your message here. Use {{name}} for personalization."
                required
                disabled={loading}
              />
              <p className="text-sm text-gray-500 mt-2">
                Use variables like {{name}}, {{company}}, or {{link}} for personalization
              </p>
            </div>

            {renderPreview()}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Target Audience</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add Audience Segment
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={audienceInput}
                  onChange={(e) => setAudienceInput(e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="e.g., vip-customers, new-subscribers"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAudience())}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={addAudience}
                  className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
                  disabled={loading}
                >
                  Add
                </button>
              </div>
            </div>

            {formData.targetAudience.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Selected Segments</h3>
                <div className="flex flex-wrap gap-2">
                  {formData.targetAudience.map((audience) => (
                    <span
                      key={audience}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-emerald-100 text-emerald-800"
                    >
                      {audience}
                      <button
                        type="button"
                        onClick={() => removeAudience(audience)}
                        className="ml-2 text-emerald-600 hover:text-emerald-800"
                        disabled={loading}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-900 mb-2">Quick Add</h3>
              <div className="flex flex-wrap gap-2">
                {['all-customers', 'vip-customers', 'new-subscribers', 'inactive-users'].map((segment) => (
                  <button
                    key={segment}
                    type="button"
                    onClick={() => {
                      if (!formData.targetAudience.includes(segment)) {
                        setFormData({
                          ...formData,
                          targetAudience: [...formData.targetAudience, segment]
                        });
                      }
                    }}
                    className="px-3 py-1 text-sm bg-white border border-blue-200 rounded-full hover:bg-blue-50 transition-colors disabled:opacity-50"
                    disabled={loading}
                  >
                    {segment}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Schedule Campaign</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Send Date & Time (Optional)
              </label>
              <input
                type="datetime-local"
                value={formData.scheduledDate}
                onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                min={new Date().toISOString().slice(0, 16)}
                disabled={loading}
              />
              <p className="text-sm text-gray-500 mt-2">
                Leave empty to save as draft. You can schedule or send it later.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Campaign Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium">{formData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Target Segments:</span>
                  <span className="font-medium">{formData.targetAudience.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Has Media:</span>
                  <span className="font-medium">{formData.mediaUrl ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Schedule:</span>
                  <span className="font-medium">
                    {formData.scheduledDate 
                      ? new Date(formData.scheduledDate).toLocaleString()
                      : 'Save as draft'
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-8 border-t">
          <button
            type="button"
            onClick={() => step > 1 ? setStep(step - 1) : onCancel()}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            disabled={loading}
          >
            {step > 1 ? 'Previous' : 'Cancel'}
          </button>
          
          <div>
            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                disabled={!isStepValid(step) || loading}
                className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                {campaign ? 'Update Campaign' : 'Create Campaign'}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default CampaignForm;