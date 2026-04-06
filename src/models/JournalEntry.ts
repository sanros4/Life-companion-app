import mongoose from 'mongoose';

const JournalSchema = new mongoose.Schema({
  userId:  { type: String, required: true },
  title:   { type: String, required: true },
  content: { type: String, required: true },
  mood:    { type: String, default: '😊' },
  date:    { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.JournalEntry || mongoose.model('JournalEntry', JournalSchema);
