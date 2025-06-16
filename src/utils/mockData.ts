import { Campaign, Contact, MessageTemplate, Analytics } from '../types';

export const mockCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Summer Sale 2024',
    description: 'Promote our summer collection with exclusive discounts',
    status: 'active',
    messageTemplate: 'Hi {{name}}! 🌞 Our Summer Sale is now live with up to 50% off! Shop now: {{link}}',
    targetAudience: ['summer-shoppers', 'vip-customers'],
    scheduledDate: new Date('2024-01-15T10:00:00'),
    createdDate: new Date('2024-01-10'),
    sentCount: 1250,
    deliveredCount: 1180,
    readCount: 890,
    replyCount: 156
  },
  {
    id: '2',
    name: 'Product Launch Announcement',
    description: 'Announce our new smartphone launch to tech enthusiasts',
    status: 'scheduled',
    messageTemplate: 'Hey {{name}}! 📱 The future is here. Check out our latest smartphone launching tomorrow!',
    targetAudience: ['tech-enthusiasts'],
    scheduledDate: new Date('2024-01-20T09:00:00'),
    createdDate: new Date('2024-01-12'),
    sentCount: 0,
    deliveredCount: 0,
    readCount: 0,
    replyCount: 0
  },
  {
    id: '3',
    name: 'Holiday Greetings',
    description: 'Send personalized holiday wishes to all customers',
    status: 'completed',
    messageTemplate: 'Happy Holidays {{name}}! 🎄 Thank you for being an amazing customer. Enjoy 20% off your next purchase!',
    targetAudience: ['all-customers'],
    scheduledDate: new Date('2023-12-24T08:00:00'),
    createdDate: new Date('2023-12-20'),
    sentCount: 5200,
    deliveredCount: 4980,
    readCount: 4150,
    replyCount: 320
  }
];

export const mockContacts: Contact[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    phone: '+1234567890',
    email: 'sarah@example.com',
    tags: ['vip-customer', 'summer-shopper'],
    lastActivity: new Date('2024-01-14'),
    status: 'active'
  },
  {
    id: '2',
    name: 'Mike Chen',
    phone: '+1234567891',
    email: 'mike@example.com',
    tags: ['tech-enthusiast'],
    lastActivity: new Date('2024-01-13'),
    status: 'active'
  },
  {
    id: '3',
    name: 'Emily Davis',
    phone: '+1234567892',
    email: 'emily@example.com',
    tags: ['regular-customer'],
    lastActivity: new Date('2024-01-12'),
    status: 'active'
  }
];

export const mockTemplates: MessageTemplate[] = [
  {
    id: '1',
    name: 'Welcome Message',
    content: 'Welcome to {{company}}! We\'re excited to have you on board. Get 10% off your first purchase with code WELCOME10.',
    variables: ['company'],
    category: 'marketing',
    createdDate: new Date('2024-01-01')
  },
  {
    id: '2',
    name: 'Order Confirmation',
    content: 'Hi {{name}}, your order #{{orderNumber}} has been confirmed and will be delivered by {{deliveryDate}}.',
    variables: ['name', 'orderNumber', 'deliveryDate'],
    category: 'utility',
    createdDate: new Date('2024-01-05')
  }
];

export const mockAnalytics: Analytics = {
  totalCampaigns: 15,
  activeCampaigns: 3,
  totalContacts: 12500,
  messagesSent: 45000,
  deliveryRate: 94.2,
  openRate: 78.5,
  responseRate: 12.3,
  recentActivity: [
    { date: '2024-01-14', sent: 850, delivered: 805, read: 620 },
    { date: '2024-01-13', sent: 920, delivered: 875, read: 680 },
    { date: '2024-01-12', sent: 780, delivered: 740, read: 590 },
    { date: '2024-01-11', sent: 650, delivered: 620, read: 480 },
    { date: '2024-01-10', sent: 1100, delivered: 1045, read: 820 },
    { date: '2024-01-09', sent: 590, delivered: 560, read: 440 },
    { date: '2024-01-08', sent: 720, delivered: 685, read: 530 }
  ]
};