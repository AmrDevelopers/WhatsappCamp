import express from 'express';
import Campaign from '../models/Campaign.js';
import Contact from '../models/Contact.js';

const router = express.Router();

// Get analytics data
router.get('/', async (req, res) => {
  try {
    // Get campaign statistics
    const totalCampaigns = await Campaign.countDocuments();
    const activeCampaigns = await Campaign.countDocuments({ status: 'active' });
    
    // Get contact statistics
    const totalContacts = await Contact.countDocuments();
    const activeContacts = await Contact.countDocuments({ status: 'active' });
    const blockedContacts = await Contact.countDocuments({ status: 'blocked' });
    const unsubscribedContacts = await Contact.countDocuments({ status: 'unsubscribed' });
    
    // Get message statistics
    const campaigns = await Campaign.find();
    const messagesSent = campaigns.reduce((sum, campaign) => sum + campaign.sentCount, 0);
    const messagesDelivered = campaigns.reduce((sum, campaign) => sum + campaign.deliveredCount, 0);
    const messagesRead = campaigns.reduce((sum, campaign) => sum + campaign.readCount, 0);
    const replies = campaigns.reduce((sum, campaign) => sum + campaign.replyCount, 0);
    
    // Calculate rates
    const deliveryRate = messagesSent > 0 ? ((messagesDelivered / messagesSent) * 100).toFixed(1) : 0;
    const openRate = messagesSent > 0 ? ((messagesRead / messagesSent) * 100).toFixed(1) : 0;
    const responseRate = messagesSent > 0 ? ((replies / messagesSent) * 100).toFixed(1) : 0;
    
    // Get recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentCampaigns = await Campaign.find({
      createdAt: { $gte: sevenDaysAgo }
    }).sort({ createdAt: 1 });
    
    // Generate activity data for the last 7 days
    const recentActivity = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      // For demo purposes, generate some activity data
      // In a real app, you'd track actual daily metrics
      const dayActivity = {
        date: dateStr,
        sent: Math.floor(Math.random() * 1000) + 500,
        delivered: Math.floor(Math.random() * 900) + 450,
        read: Math.floor(Math.random() * 700) + 350
      };
      recentActivity.push(dayActivity);
    }
    
    const analytics = {
      totalCampaigns,
      activeCampaigns,
      totalContacts,
      activeContacts,
      blockedContacts,
      unsubscribedContacts,
      messagesSent,
      messagesDelivered,
      messagesRead,
      replies,
      deliveryRate: parseFloat(deliveryRate),
      openRate: parseFloat(openRate),
      responseRate: parseFloat(responseRate),
      recentActivity
    };
    
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get campaign performance
router.get('/campaigns/:id/performance', async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }
    
    const performance = {
      sentCount: campaign.sentCount,
      deliveredCount: campaign.deliveredCount,
      readCount: campaign.readCount,
      replyCount: campaign.replyCount,
      deliveryRate: campaign.sentCount > 0 ? ((campaign.deliveredCount / campaign.sentCount) * 100).toFixed(1) : 0,
      openRate: campaign.sentCount > 0 ? ((campaign.readCount / campaign.sentCount) * 100).toFixed(1) : 0,
      responseRate: campaign.sentCount > 0 ? ((campaign.replyCount / campaign.sentCount) * 100).toFixed(1) : 0
    };
    
    res.json(performance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;