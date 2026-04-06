import mongoose from 'mongoose';

const SelfCareSchema = new mongoose.Schema({
  userId:    { type: String, required: true },
  category:  { type: String, required: true },
  task:      { type: String, required: true },
  completed: { type: Boolean, default: false },
  date:      { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.SelfCare || mongoose.model('SelfCare', SelfCareSchema);

