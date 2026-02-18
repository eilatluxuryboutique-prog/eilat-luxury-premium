import mongoose from 'mongoose';

const PropertySchema = new mongoose.Schema({
    ownerId: {
        type: String, // Can be ObjectId if we link strict, but String is safer for now with Clerk/Auth flexibility
        required: true,
        index: true
    },
    title: {
        type: String,
        required: [true, 'Please provide a title'],
        maxlength: 100
    },
    description: {
        type: String,
        required: [true, 'Please provide a description'],
    },
    price: {
        type: Number,
        required: [true, 'Please provide a price'],
    },
    weekendPrice: {
        type: Number,
        default: null // If null, fallback to 'price'
    },
    type: {
        type: String,
        enum: ['apartment', 'villa', 'hotel'],
        default: 'apartment',
        index: true
    },
    location: {
        type: String,
        default: 'Eilat'
    },
    coordinates: {
        lat: { type: Number, default: 29.5577 },
        lng: { type: Number, default: 34.9519 }
    },
    images: {
        type: [String],
        default: []
    },
    amenities: {
        type: [String],
        default: []
    },
    rating: {
        type: Number,
        default: 0
    },
    guests: {
        type: Number,
        default: 2
    },
    rooms: {
        type: Number,
        default: 1
    },
    isDemo: {
        type: Boolean,
        default: false
    },
    blockedDates: {
        type: [String], // Legacy: Array of ISO date strings 'YYYY-MM-DD' - migrating to unavailableDates
        default: []
    },
    unavailableDates: {
        type: [{
            start: Date,
            end: Date,
            reason: { type: String, default: 'booking' } // 'booking', 'maintenance', 'blocked_by_host'
        }],
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
});

// Add a method to format response
PropertySchema.set('toJSON', {
    transform: (doc, ret: any) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
    }
});

export default (mongoose.models.Property || mongoose.model('Property', PropertySchema)) as any;
