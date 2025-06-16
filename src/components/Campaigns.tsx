import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Play, 
  Pause, 
  Copy, 
  Trash2,
  Calendar,
  Users,
  MessageSquare,
  TrendingUp
} from 'lucide-react';
import { Campaign } from '../types';
import { useAPI, useAsyncOperation } from '../hooks/useAPI';
import { campaignAPI } from '../services/api';
import CampaignForm from './CampaignForm';

const Campaigns: React.FC = () => {
  const { data: campaigns, loading, refetch } = useAPI<Campaign[]>(
    () => campaignAPI.getAll()
  );
  const { execute, loading: operationLoading } = useAsyncOperation();

  const [showForm, setShowForm] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredCampaigns = campaigns?.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  const handleCreateCampaign = async (campaignData: Partial<Campaign>) => {
    const result = await execute(() => campaignAPI.create(campaignData));
    if (result) {
      refetch();
      setShowForm(false);
    }
  };

  const handleEditCampaign = async (campaignData: Partial<Campaign>) => {
    if (editingCampaign) {
      const id = editingCampaign._id || editingCampaign.id;
      if (id) {
        const result = await execute(() => campaignAPI.update(id, campaignData));
        if (result) {
          refetch();
          setEditingCampaign(null);
          setShowForm(false);
        }
      }
    }
  };

  const handleDeleteCampaign = async (campaign: Campaign) => {
    if (window.confirm('Are you sure you want to delete this campaign?')) {
      const id = campaign._id || campaign.id;
      if (id) {
        const result = await execute(() => campaignAPI.delete(id));
        if (result) {
          refetch();
        }
      }
    }
  };

  const handleStatusChange = async (campaign: Campaign, newStatus: string) => {
    const id = campaign._id || campaign.id;
    if (id) {
      const result = await execute(() => campaignAPI.updateStatus(id, newStatus));
      if (result) {
        refetch();
      }
    }
  };

  const getStatusColor = (status: Campaign['status']) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusIcon = (status: Campaign['status']) => {
    switch (status) {
      case 'active': return <Play className="w-3 h-3" />;
      case 'scheduled': return <Calendar className="w-3 h-3" />;
      case 'paused': return <Pause className="w-3 h-3" />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (showForm) {
    return (
      <CampaignForm
        campaign={editingCampaign}
        onSave={editingCampaign ? handleEditCampaign : handleCreateCampaign}
        onCancel={() => {
          setShowForm(false);
          setEditingCampaign(null);
        }}
        loading={operationLoading}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Campaigns</h2>
          <p className="text-gray-600">Manage your WhatsApp marketing campaigns</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Campaign
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search campaigns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCampaigns.map((campaign) => (
          <div key={campaign._id || campaign.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{campaign.name}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{campaign.description}</p>
                </div>
                <div className="relative">
                  <button className="p-1 rounded-md hover:bg-gray-100">
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                  {getStatusIcon(campaign.status)}
                  <span className="ml-1 capitalize">{campaign.status}</span>
                </span>
                {campaign.scheduledDate && (
                  <span className="text-xs text-gray-500">
                    {new Date(campaign.scheduledDate).toLocaleDateString()}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 text-gray-600 mb-1">
                    <Users className="w-4 h-4" />
                    <span className="text-xs">Audience</span>
                  </div>
                  <p className="text-sm font-medium">{campaign.targetAudience.length}</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 text-gray-600 mb-1">
                    <MessageSquare className="w-4 h-4" />
                    <span className="text-xs">Sent</span>
                  </div>
                  <p className="text-sm font-medium">{campaign.sentCount}</p>
                </div>
              </div>

              {campaign.sentCount > 0 && (
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Performance</span>
                    <span>{Math.round((campaign.readCount / campaign.sentCount) * 100)}% read</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-emerald-600 h-2 rounded-full"
                      style={{ width: `${(campaign.readCount / campaign.sentCount) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setEditingCampaign(campaign);
                    setShowForm(true);
                  }}
                  className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Edit
                </button>
                {campaign.status === 'draft' || campaign.status === 'paused' ? (
                  <button 
                    onClick={() => handleStatusChange(campaign, 'active')}
                    className="px-3 py-2 text-sm font-medium text-emerald-700 bg-emerald-50 rounded-md hover:bg-emerald-100 transition-colors"
                  >
                    <Play className="w-4 h-4" />
                  </button>
                ) : campaign.status === 'active' ? (
                  <button 
                    onClick={() => handleStatusChange(campaign, 'paused')}
                    className="px-3 py-2 text-sm font-medium text-yellow-700 bg-yellow-50 rounded-md hover:bg-yellow-100 transition-colors"
                  >
                    <Pause className="w-4 h-4" />
                  </button>
                ) : null}
                <button 
                  onClick={() => handleDeleteCampaign(campaign)}
                  className="px-3 py-2 text-sm font-medium text-red-700 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCampaigns.length === 0 && (
        <div className="text-center py-12">
          <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No campaigns found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : 'Get started by creating your first campaign'
            }
          </p>
          {!searchTerm && statusFilter === 'all' && (
            <div className="mt-6">
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Campaign
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Campaigns;