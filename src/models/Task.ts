import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
  userId:    { type: String, required: true },
  text:      { type: String, required: true },
  date:      { type: String, required: true },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Task || mongoose.model('Task', TaskSchema);
