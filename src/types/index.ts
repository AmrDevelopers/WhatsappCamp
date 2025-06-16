export interface Campaign {
  _id?: string;
  id?: string;
  name: string;
  description: string;
  status: 'draft' | 'scheduled' | 'active' | 'completed' | 'paused';
  messageTemplate: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'document' | '';
  targetAudience: string[];
  scheduledDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  sentCount: number;
  deliveredCount: number;
  readCount: number;
  replyCount: number;
  createdBy?: {
    _id: string;
    name: string;
    email: string;
  };
}

export interface Contact {
  _id?: string;
  id?: string;
  name: string;
  phone: string;
  email?: string;
  tags: string[];
  lastActivity?: Date;
  status: 'active' | 'blocked' | 'unsubscribed';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MessageTemplate {
  _id?: string;
  id?: string;
  name: string;
  content: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'document' | '';
  variables: string[];
  category: 'marketing' | 'utility' | 'authentication';
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: {
    _id: string;
    name: string;
    email: string;
  };
}

export interface Analytics {
  totalCampaigns: number;
  activeCampaigns: number;
  totalContacts: number;
  activeContacts: number;
  blockedContacts: number;
  unsubscribedContacts: number;
  messagesSent: number;
  messagesDelivered: number;
  messagesRead: number;
  replies: number;
  deliveryRate: number;
  openRate: number;
  responseRate: number;
  recentActivity: {
    date: string;
    sent: number;
    delivered: number;
    read: number;
  }[];
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  company?: string;
  phone?: string;
  avatar?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}