import mongoose, { Schema } from 'mongoose';

const ContentSchema = new Schema({
    key: { type: String, required: true, unique: true }, // 'site_content'
    data: { type: Object, default: {} },
    lastUpdated: { type: Date, default: Date.now }
}, {
    timestamps: true
});

// Use existing model or create new one with explicit any cast to avoid TS build errors
const Content = mongoose.models.Content || mongoose.model<any>('Content', ContentSchema);

export default Content;
