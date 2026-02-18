import mongoose from 'mongoose';

const EnquirySchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['contact', 'newsletter'],
        required: true
    },
    name: {
        type: String,
        required: function (this: any) { return this.type === 'contact'; }
    },
    email: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: function (this: any) { return this.type === 'contact'; }
    },
    status: {
        type: String,
        enum: ['new', 'read', 'archived'],
        default: 'new'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default (mongoose.models.Enquiry || mongoose.model('Enquiry', EnquirySchema)) as any;
