import React from 'react';
import { 
  TrendingUp, 
  Users, 
  MessageSquare, 
  Send,
  Eye,
  MessageCircle,
  CheckCircle,
  UserCheck,
  UserX
} from 'lucide-react';
import { useAPI } from '../hooks/useAPI';
import { analyticsAPI, campaignAPI } from '../services/api';
import { Analytics, Campaign } from '../types';

const Dashboard: React.FC = () => {
  const { data: analytics, loading: analyticsLoading } = useAPI<Analytics>(
    () => analyticsAPI.getOverview()
  );

  const { data: campaigns, loading: campaignsLoading } = useAPI<Campaign[]>(
    () => campaignAPI.getAll()
  );

  if (analyticsLoading || campaignsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500">Failed to load analytics data</div>
      </div>
    );
  }

  const stats = [
    {
      name: 'Total Campaigns',
      value: analytics.totalCampaigns,
      icon: MessageSquare,
      change: '+12%',
      changeType: 'positive' as const,
      color: 'bg-blue-500'
    },
    {
      name: 'Active Campaigns',
      value: analytics.activeCampaigns,
      icon: TrendingUp,
      change: '+5%',
      changeType: 'positive' as const,
      color: 'bg-emerald-500'
    },
    {
      name: 'Total Contacts',
      value: analytics.totalContacts.toLocaleString(),
      icon: Users,
      change: '+23%',
      changeType: 'positive' as const,
      color: 'bg-purple-500'
    },
    {
      name: 'Messages Sent',
      value: `${(analytics.messagesSent / 1000).toFixed(1)}k`,
      icon: Send,
      change: '+18%',
      changeType: 'positive' as const,
      color: 'bg-orange-500'
    }
  ];

  const performanceMetrics = [
    {
      name: 'Delivery Rate',
      value: analytics.deliveryRate,
      icon: CheckCircle,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    {
      name: 'Open Rate',
      value: analytics.openRate,
      icon: Eye,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      name: 'Response Rate',
      value: analytics.responseRate,
      icon: MessageCircle,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  const contactStats = [
    {
      name: 'Active Contacts',
      value: analytics.activeContacts,
      icon: UserCheck,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    {
      name: 'Blocked Contacts',
      value: analytics.blockedContacts,
      icon: UserX,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    }
  ];

  const recentCampaigns = campaigns?.slice(0, 3) || [];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className={`text-sm mt-2 flex items-center ${
                    stat.changeType === 'positive' ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    <TrendingUp className="w-4 h-4 mr-1" />
                    {stat.change} from last month
                  </p>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Performance Metrics */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance Metrics</h3>
          <div className="space-y-6">
            {performanceMetrics.map((metric) => {
              const Icon = metric.icon;
              return (
                <div key={metric.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 ${metric.bgColor} rounded-lg flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${metric.color}`} />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{metric.name}</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">{metric.value}%</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Contact Statistics */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Contact Statistics</h3>
          <div className="space-y-6">
            {contactStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{stat.name}</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">{stat.value}</span>
                </div>
              );
            })}
            <div className="pt-4 border-t">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{analytics.totalContacts}</div>
                <div className="text-sm text-gray-600">Total Contacts</div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Campaigns */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Campaigns</h3>
          <div className="space-y-4">
            {recentCampaigns.map((campaign) => (
              <div key={campaign._id || campaign.id} className="p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-semibold text-gray-900">{campaign.name}</h4>
                <p className="text-xs text-gray-600 mt-1">{campaign.description}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="text-xs text-gray-500">Sent: {campaign.sentCount}</span>
                  <span className="text-xs text-gray-500">Read: {campaign.readCount}</span>
                  <span className="text-xs text-gray-500">Replies: {campaign.replyCount}</span>
                </div>
                <div className="mt-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    campaign.status === 'active' ? 'bg-emerald-100 text-emerald-800' :
                    campaign.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                    campaign.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                    campaign.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {campaign.status}
                  </span>
                </div>
              </div>
            ))}
            {recentCampaigns.length === 0 && (
              <div className="text-center text-gray-500 py-4">
                No campaigns yet
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Activity Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">7-Day Activity</h3>
        <div className="grid grid-cols-7 gap-4">
          {analytics.recentActivity.map((day, index) => {
            const maxValue = Math.max(...analytics.recentActivity.map(d => d.sent));
            return (
              <div key={index} className="text-center">
                <div className="space-y-2 mb-3">
                  <div className="bg-gray-100 rounded h-24 flex flex-col justify-end p-1">
                    <div 
                      className="bg-emerald-500 rounded-sm"
                      style={{ height: `${(day.sent / maxValue) * 100}%` }}
                    />
                  </div>
                  <div className="bg-gray-100 rounded h-24 flex flex-col justify-end p-1">
                    <div 
                      className="bg-blue-500 rounded-sm"
                      style={{ height: `${(day.delivered / maxValue) * 100}%` }}
                    />
                  </div>
                  <div className="bg-gray-100 rounded h-24 flex flex-col justify-end p-1">
                    <div 
                      className="bg-purple-500 rounded-sm"
                      style={{ height: `${(day.read / maxValue) * 100}%` }}
                    />
                  </div>
                </div>
                <p className="text-xs font-medium text-gray-600">
                  {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                </p>
                <p className="text-xs text-gray-500">{day.sent}</p>
              </div>
            );
          })}
        </div>
        <div className="flex justify-center space-x-6 mt-6">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-full" />
            <span className="text-sm text-gray-600">Sent</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full" />
            <span className="text-sm text-gray-600">Delivered</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full" />
            <span className="text-sm text-gray-600">Read</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;