import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
    propertyId: {
        type: String,
        required: true,
        index: true
    },
    userId: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true,
        maxlength: 500
    },
    images: {
        type: [String],
        default: []
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Update Property Rating on Save
// ReviewSchema.post('save', async function() {
// This is complex for now, we'll calc on fly or simple updates
// });

export default (mongoose.models.Review || mongoose.model('Review', ReviewSchema)) as any;
