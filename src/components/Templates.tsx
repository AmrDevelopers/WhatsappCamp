import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Copy, 
  Edit, 
  Trash2, 
  Eye,
  MessageSquare,
  Clock,
  Image,
  Video,
  FileText
} from 'lucide-react';
import { MessageTemplate } from '../types';
import { useAPI, useAsyncOperation } from '../hooks/useAPI';
import { templateAPI } from '../services/api';
import MediaUpload from './MediaUpload';

const Templates: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<MessageTemplate | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<MessageTemplate | null>(null);

  const { data: templates, loading, refetch } = useAPI<MessageTemplate[]>(
    () => templateAPI.getAll({ search: searchTerm, category: categoryFilter }),
    [searchTerm, categoryFilter]
  );
  const { execute, loading: operationLoading } = useAsyncOperation();

  const [formData, setFormData] = useState({
    name: '',
    content: '',
    mediaUrl: '',
    mediaType: '',
    category: 'marketing' as MessageTemplate['category']
  });

  const handleCreateTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await execute(() => templateAPI.create(formData));
    if (result) {
      refetch();
      resetForm();
    }
  };

  const handleEditTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTemplate) {
      const id = editingTemplate._id || editingTemplate.id;
      if (id) {
        const result = await execute(() => templateAPI.update(id, formData));
        if (result) {
          refetch();
          resetForm();
        }
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: '', content: '', mediaUrl: '', mediaType: '', category: 'marketing' });
    setShowForm(false);
    setEditingTemplate(null);
  };

  const startEdit = (template: MessageTemplate) => {
    setFormData({
      name: template.name,
      content: template.content,
      mediaUrl: template.mediaUrl || '',
      mediaType: template.mediaType || '',
      category: template.category
    });
    setEditingTemplate(template);
    setShowForm(true);
  };

  const deleteTemplate = async (template: MessageTemplate) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      const id = template._id || template.id;
      if (id) {
        const result = await execute(() => templateAPI.delete(id));
        if (result) {
          refetch();
        }
      }
    }
  };

  const duplicateTemplate = async (template: MessageTemplate) => {
    const newTemplate = {
      name: `${template.name} (Copy)`,
      content: template.content,
      mediaUrl: template.mediaUrl,
      mediaType: template.mediaType,
      category: template.category
    };
    const result = await execute(() => templateAPI.create(newTemplate));
    if (result) {
      refetch();
    }
  };

  const handleMediaUpload = (url: string, type: string) => {
    setFormData({
      ...formData,
      mediaUrl: url,
      mediaType: type
    });
  };

  const getCategoryColor = (category: MessageTemplate['category']) => {
    switch (category) {
      case 'marketing': return 'bg-emerald-100 text-emerald-800';
      case 'utility': return 'bg-blue-100 text-blue-800';
      case 'authentication': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getMediaIcon = (type: string) => {
    switch (type) {
      case 'image': return <Image className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      case 'document': return <FileText className="w-4 h-4" />;
      default: return null;
    }
  };

  const renderPreview = (content: string, mediaUrl?: string, mediaType?: string) => {
    const previewText = content
      .replace(/\{\{name\}\}/g, 'John Doe')
      .replace(/\{\{company\}\}/g, 'Your Company')
      .replace(/\{\{orderNumber\}\}/g, '#12345')
      .replace(/\{\{deliveryDate\}\}/g, 'Tomorrow')
      .replace(/\{\{link\}\}/g, 'https://example.com');

    return (
      <div className="bg-white rounded-lg p-4 border max-w-sm">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-medium">B</span>
          </div>
          <div className="flex-1">
            <div className="bg-gray-100 rounded-lg p-3">
              {mediaUrl && (
                <div className="mb-2">
                  {mediaType === 'image' ? (
                    <img
                      src={`http://localhost:3001${mediaUrl}`}
                      alt="Media preview"
                      className="w-full h-24 object-cover rounded"
                    />
                  ) : mediaType === 'video' ? (
                    <video
                      src={`http://localhost:3001${mediaUrl}`}
                      className="w-full h-24 object-cover rounded"
                      controls
                    />
                  ) : (
                    <div className="flex items-center p-2 bg-blue-50 rounded">
                      <FileText className="w-4 h-4 text-blue-600 mr-2" />
                      <span className="text-sm text-blue-800">Document attached</span>
                    </div>
                  )}
                </div>
              )}
              <p className="text-sm text-gray-900 whitespace-pre-wrap">
                {previewText}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  const templateList = templates || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Message Templates</h2>
          <p className="text-gray-600">Create and manage reusable message templates with media</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Template
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="all">All Categories</option>
            <option value="marketing">Marketing</option>
            <option value="utility">Utility</option>
            <option value="authentication">Authentication</option>
          </select>
        </div>
      </div>

      {/* Template Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingTemplate ? 'Edit Template' : 'Create New Template'}
            </h3>
            <form onSubmit={editingTemplate ? handleEditTemplate : handleCreateTemplate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Template Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="e.g., Welcome Message"
                  required
                  disabled={operationLoading}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as MessageTemplate['category'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  disabled={operationLoading}
                >
                  <option value="marketing">Marketing</option>
                  <option value="utility">Utility</option>
                  <option value="authentication">Authentication</option>
                </select>
              </div>

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
                <label className="block text-sm font-medium text-gray-700 mb-1">Message Content *</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Write your message template here. Use {{variable}} for dynamic content."
                  required
                  disabled={operationLoading}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Use variables like {{name}}, {{company}}, {{orderNumber}} for personalization
                </p>
              </div>

              {formData.content && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
                  <div className="bg-gray-50 rounded-lg p-4">
                    {renderPreview(formData.content, formData.mediaUrl, formData.mediaType)}
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={operationLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
                  disabled={operationLoading}
                >
                  {operationLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    `${editingTemplate ? 'Update' : 'Create'} Template`
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Template Preview</h3>
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              {renderPreview(previewTemplate.content, previewTemplate.mediaUrl, previewTemplate.mediaType)}
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setPreviewTemplate(null)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templateList.map((template) => (
          <div key={template._id || template.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{template.name}</h3>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(template.category)}`}>
                      <MessageSquare className="w-3 h-3 mr-1" />
                      {template.category}
                    </span>
                    {template.mediaUrl && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {getMediaIcon(template.mediaType)}
                        <span className="ml-1">Media</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600 line-clamp-3">
                  {template.content}
                </p>
              </div>

              {template.variables.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-xs font-medium text-gray-700 mb-2">Variables:</h4>
                  <div className="flex flex-wrap gap-1">
                    {template.variables.map((variable) => (
                      <span key={variable} className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-800">
                        {variable}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                <div className="flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {template.createdAt ? new Date(template.createdAt).toLocaleDateString() : 'Unknown'}
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => setPreviewTemplate(template)}
                  className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  <Eye className="w-4 h-4 mx-auto" />
                </button>
                <button
                  onClick={() => startEdit(template)}
                  className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                  disabled={operationLoading}
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => duplicateTemplate(template)}
                  className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                  disabled={operationLoading}
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteTemplate(template)}
                  className="px-3 py-2 text-sm font-medium text-red-700 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
                  disabled={operationLoading}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {templateList.length === 0 && (
        <div className="text-center py-12">
          <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No templates found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || categoryFilter !== 'all'
              ? 'Try adjusting your search or filter criteria'
              : 'Get started by creating your first message template'
            }
          </p>
          {!searchTerm && categoryFilter === 'all' && (
            <div className="mt-6">
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Template
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Templates;