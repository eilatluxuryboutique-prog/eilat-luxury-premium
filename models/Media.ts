import mongoose, { Schema } from 'mongoose';

const MediaSchema = new Schema({
    publicId: { type: String, required: true, unique: true },
    url: { type: String, required: true },
    format: String,
    resourceType: { type: String, default: 'image' }, // image/video
    createdAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});

const Media = mongoose.models.Media || mongoose.model<any>('Media', MediaSchema);
export default Media;
