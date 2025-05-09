import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/learning-hub');
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Models
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  credits: { type: Number, default: 50 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const contentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  source: { type: String, required: true },
  sourceIcon: { type: String, required: true },
  url: { type: String, required: true },
  imageUrl: { type: String },
  date: { type: Date, default: Date.now },
  views: { type: Number, default: 0 },
  saves: { type: Number, default: 0 },
  shares: { type: Number, default: 0 },
  reports: { type: Number, default: 0 }
});

const savedContentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: mongoose.Schema.Types.ObjectId, ref: 'Content', required: true },
  createdAt: { type: Date, default: Date.now }
});

const reportSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: mongoose.Schema.Types.ObjectId, ref: 'Content', required: true },
  reason: { type: String },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

const creditTransactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['earn', 'spend'], required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Content = mongoose.model('Content', contentSchema);
const SavedContent = mongoose.model('SavedContent', savedContentSchema);
const Report = mongoose.model('Report', reportSchema);
const CreditTransaction = mongoose.model('CreditTransaction', creditTransactionSchema);

// Helper functions
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '30d' }
  );
};

// Middleware
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Not authorized, user not found or inactive' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as admin' });
  }
};

// Mock data for development
const mockContent = [
  {
    title: 'How to Build a Modern Web Application',
    description: 'Learn the latest techniques for building fast, responsive web applications with modern JavaScript frameworks.',
    source: 'twitter',
    sourceIcon: 'T',
    url: 'https://example.com/web-app',
    imageUrl: 'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    date: new Date(),
    views: 120,
    saves: 45,
    shares: 23,
    reports: 2
  },
  {
    title: 'Introduction to Machine Learning',
    description: 'Get started with the basics of machine learning and understand how algorithms learn from data.',
    source: 'reddit',
    sourceIcon: 'R',
    url: 'https://example.com/machine-learning',
    imageUrl: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    date: new Date(),
    views: 89,
    saves: 32,
    shares: 15,
    reports: 0
  },
  {
    title: 'Career Advancement Tips for Developers',
    description: 'Expert advice on how to advance your career as a software developer and stand out in the industry.',
    source: 'linkedin',
    sourceIcon: 'In',
    url: 'https://example.com/career-tips',
    imageUrl: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    date: new Date(),
    views: 156,
    saves: 67,
    shares: 41,
    reports: 1
  },
  {
    title: 'The Future of Artificial Intelligence',
    description: 'Exploring the potential future developments in AI and how they might impact various industries.',
    source: 'twitter',
    sourceIcon: 'T',
    url: 'https://example.com/ai-future',
    imageUrl: 'https://images.pexels.com/photos/8438923/pexels-photo-8438923.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    date: new Date(),
    views: 203,
    saves: 89,
    shares: 54,
    reports: 3
  },
  {
    title: 'Understanding Blockchain Technology',
    description: 'A beginners guide to blockchain, explaining the core concepts and potential applications.',
    source: 'reddit',
    sourceIcon: 'R',
    url: 'https://example.com/blockchain',
    imageUrl: 'https://images.pexels.com/photos/844124/pexels-photo-844124.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    date: new Date(),
    views: 134,
    saves: 52,
    shares: 29,
    reports: 1
  },
  {
    title: 'Effective Remote Work Strategies',
    description: 'Tips and best practices for staying productive and maintaining work-life balance when working remotely.',
    source: 'linkedin',
    sourceIcon: 'In',
    url: 'https://example.com/remote-work',
    imageUrl: 'https://images.pexels.com/photos/4348401/pexels-photo-4348401.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    date: new Date(),
    views: 178,
    saves: 83,
    shares: 47,
    reports: 0
  }
];

// Initialize database with mock data
const initializeDB = async () => {
  try {
    // Check if we already have content
    const contentCount = await Content.countDocuments();
    
    if (contentCount === 0) {
      await Content.insertMany(mockContent);
      console.log('Mock content initialized');
    }
    
    // Check if admin user exists, if not create one
    const adminExists = await User.findOne({ role: 'admin' });
    
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin',
        credits: 1000
      });
      console.log('Admin user created');
    }
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

// Routes

// Auth Routes
app.post('https://learning-hub-ciio.onrender.com/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });
    
    // Create initial credit transaction for signup bonus
    await CreditTransaction.create({
      user: user._id,
      amount: 50,
      type: 'earn',
      description: 'Welcome bonus'
    });
    
    // Generate token
    const token = generateToken(user);
    
    res.status(201).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        credits: user.credits
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


app.post('https://learning-hub-ciio.onrender.com/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({ message: 'Your account has been deactivated' });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Generate token
    const token = generateToken(user);
    
    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        credits: user.credits
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// User Routes
app.get('https://learning-hub-ciio.onrender.com/api/users/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Content Routes
app.get('https://learning-hub-ciio.onrender.com/api/content', authMiddleware, async (req, res) => {
  try {
    const { sources } = req.query;
    let filter = {};
    
    if (sources) {
      filter.source = { $in: sources.split(',') };
    }
    
    const content = await Content.find(filter).sort({ date: -1 });
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('https://learning-hub-ciio.onrender.com/api/content/saved', authMiddleware, async (req, res) => {
  try {
    const savedContent = await SavedContent.find({ user: req.user._id })
      .populate('content')
      .sort({ createdAt: -1 });
    
    const content = savedContent.map(item => item.content);
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('https://learning-hub-ciio.onrender.com/api/content/save', authMiddleware, async (req, res) => {
  try {
    const { contentId } = req.body;
    
    // Check if already saved
    const alreadySaved = await SavedContent.findOne({
      user: req.user._id,
      content: contentId
    });
    
    if (alreadySaved) {
      return res.status(400).json({ message: 'Content already saved' });
    }
    
    // Save content
    await SavedContent.create({
      user: req.user._id,
      content: contentId
    });
    
    // Update content save count
    await Content.findByIdAndUpdate(contentId, { $inc: { saves: 1 } });
    
    // Add credits
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $inc: { credits: 1 } },
      { new: true }
    );
    
    // Record transaction
    await CreditTransaction.create({
      user: req.user._id,
      amount: 1,
      type: 'earn',
      description: 'Saved content'
    });
    
    res.json({ message: 'Content saved', credits: user.credits });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('https://learning-hub-ciio.onrender.com/api/content/share', authMiddleware, async (req, res) => {
  try {
    const { contentId } = req.body;
    
    // Update content share count
    await Content.findByIdAndUpdate(contentId, { $inc: { shares: 1 } });
    
    // Add credits
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $inc: { credits: 3 } },
      { new: true }
    );
    
    // Record transaction
    await CreditTransaction.create({
      user: req.user._id,
      amount: 3,
      type: 'earn',
      description: 'Shared content'
    });
    
    res.json({ message: 'Content shared', credits: user.credits });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('https://learning-hub-ciio.onrender.com/api/content/report', authMiddleware, async (req, res) => {
  try {
    const { contentId, reason } = req.body;
    
    // Check if already reported
    const alreadyReported = await Report.findOne({
      user: req.user._id,
      content: contentId
    });
    
    if (alreadyReported) {
      return res.status(400).json({ message: 'Content already reported' });
    }
    
    // Create report
    await Report.create({
      user: req.user._id,
      content: contentId,
      reason
    });
    
    // Update content report count
    await Content.findByIdAndUpdate(contentId, { $inc: { reports: 1 } });
    
    // Add credits
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $inc: { credits: 2 } },
      { new: true }
    );
    
    // Record transaction
    await CreditTransaction.create({
      user: req.user._id,
      amount: (reason ? 2 : 1), // Bonus credit for providing reason
      type: 'earn',
      description: 'Reported inappropriate content'
    });
    
    res.json({ message: 'Content reported', credits: user.credits });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Credit Routes
app.get('https://learning-hub-ciio.onrender.com/api/credits/history', authMiddleware, async (req, res) => {
  try {
    const transactions = await CreditTransaction.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('https://learning-hub-ciio.onrender.com/api/credits/spend', authMiddleware, async (req, res) => {
  try {
    const { amount, description, itemId } = req.body;
    
    // Check if user has enough credits
    if (req.user.credits < amount) {
      return res.status(400).json({ message: 'Not enough credits' });
    }
    
    // Deduct credits
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $inc: { credits: -amount } },
      { new: true }
    );
    
    // Record transaction
    await CreditTransaction.create({
      user: req.user._id,
      amount,
      type: 'spend',
      description
    });
    
    res.json({ message: 'Credits spent', credits: user.credits });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Admin Routes
app.get('https://learning-hub-ciio.onrender.com/api/admin/dashboard-stats', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const pendingReports = await Report.countDocuments({ status: 'pending' });
    const contentItems = await Content.countDocuments();
    
    const topUsers = await User.find()
      .sort({ credits: -1 })
      .limit(5)
      .select('name credits');
    
    const recentReports = await Report.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name')
      .populate('content', 'title');
    
    res.json({
      totalUsers,
      activeUsers,
      pendingReports,
      contentItems,
      topUsers,
      recentReports
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('https://learning-hub-ciio.onrender.com/api/admin/reports', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const reports = await Report.find()
      .sort({ createdAt: -1 })
      .populate('user', 'name email')
      .populate('content', 'title description source url');
    
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.patch('https://learning-hub-ciio.onrender.com/api/admin/reports/:id/approve', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    );
    
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    
    // Remove content
    await Content.findByIdAndUpdate(report.content, { isActive: false });
    
    res.json({ message: 'Report approved and content removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.patch('https://learning-hub-ciio.onrender.com/api/admin/reports/:id/reject', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    );
    
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    
    res.json({ message: 'Report rejected' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('https://learning-hub-ciio.onrender.com/api/admin/users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.patch('https://learning-hub-ciio.onrender.com/api/admin/users/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { name, email, role, credits } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role, credits },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.patch('https://learning-hub-ciio.onrender.com/api/admin/users/:id/toggle-status', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { isActive } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.delete('https://learning-hub-ciio.onrender.com/api/admin/users/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Clean up related data
    await SavedContent.deleteMany({ user: req.params.id });
    await Report.deleteMany({ user: req.params.id });
    await CreditTransaction.deleteMany({ user: req.params.id });
    
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('https://learning-hub-ciio.onrender.com/api/admin/stats/content', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const mostViewed = await Content.find().sort({ views: -1 }).limit(5).select('title views');
    const mostSaved = await Content.find().sort({ saves: -1 }).limit(5).select('title saves');
    const mostShared = await Content.find().sort({ shares: -1 }).limit(5).select('title shares');
    const mostReported = await Content.find().sort({ reports: -1 }).limit(5).select('title reports');
    
    res.json({
      mostViewed,
      mostSaved,
      mostShared,
      mostReported
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('https://learning-hub-ciio.onrender.com/api/admin/stats/credits', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const creditsEarned = await CreditTransaction.aggregate([
      { $match: { type: 'earn' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    const creditsSpent = await CreditTransaction.aggregate([
      { $match: { type: 'spend' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    const topEarners = await CreditTransaction.aggregate([
      { $match: { type: 'earn' } },
      { $group: { _id: '$user', earned: { $sum: '$amount' } } },
      { $sort: { earned: -1 } },
      { $limit: 5 }
    ]);
    
    const topSpenders = await CreditTransaction.aggregate([
      { $match: { type: 'spend' } },
      { $group: { _id: '$user', spent: { $sum: '$amount' } } },
      { $sort: { spent: -1 } },
      { $limit: 5 }
    ]);
    
    // Get user names for top earners and spenders
    const earnerIds = topEarners.map(item => item._id);
    const spenderIds = topSpenders.map(item => item._id);
    
    const users = await User.find({
      _id: { $in: [...earnerIds, ...spenderIds] }
    }).select('_id name');
    
    const usersMap = {};
    users.forEach(user => {
      usersMap[user._id] = user.name;
    });
    
    const topEarnersWithNames = topEarners.map(item => ({
      _id: item._id,
      name: usersMap[item._id] || 'Unknown User',
      earned: item.earned
    }));
    
    const topSpendersWithNames = topSpenders.map(item => ({
      _id: item._id,
      name: usersMap[item._id] || 'Unknown User',
      spent: item.spent
    }));
    
    res.json({
      totalCreditsEarned: creditsEarned.length > 0 ? creditsEarned[0].total : 0,
      totalCreditsSpent: creditsSpent.length > 0 ? creditsSpent[0].total : 0,
      topEarners: topEarnersWithNames,
      topSpenders: topSpendersWithNames
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Start server
const startServer = async () => {
  await connectDB();
  await initializeDB();
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();