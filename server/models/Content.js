import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  source: { 
    type: String, 
    required: true 
  },
  sourceIcon: { 
    type: String, 
    required: true 
  },
  url: { 
    type: String, 
    required: true 
  },
  imageUrl: { 
    type: String 
  },
  date: { 
    type: Date, 
    default: Date.now 
  },
  views: { 
    type: Number, 
    default: 0 
  },
  saves: { 
    type: Number, 
    default: 0 
  },
  shares: { 
    type: Number, 
    default: 0 
  },
  reports: { 
    type: Number, 
    default: 0 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  }
});

export default mongoose.model('Content', contentSchema);