import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true
    },
    propertyId: {
        type: String, // String to support both MongoDB ObjectIds and Mock IDs ('h1', 'a2')
        ref: 'Property', // Keep ref for population of valid DB IDs
        required: true,
        index: true
    },
    checkIn: {
        type: Date,
        required: true
    },
    checkOut: {
        type: Date,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    guests: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled', 'completed'],
        default: 'confirmed' // Auto-confirm for now as we don't have payment gateway callback
    },
    paymentMethod: {
        type: String, // 'credit_card', 'bit', 'crypto'
        default: 'credit_card'
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Virtual for booking duration (nights)
BookingSchema.virtual('nights').get(function () {
    const diffTime = Math.abs(this.checkOut.getTime() - this.checkIn.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

export default (mongoose.models.Booking || mongoose.model('Booking', BookingSchema)) as any;
