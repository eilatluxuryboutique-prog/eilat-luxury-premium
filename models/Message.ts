import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
    senderId: {
        type: String,
        required: true,
        index: true
    },
    receiverId: {
        type: String, // 'admin' or userId
        required: true,
        index: true
    },
    content: {
        type: String,
        required: true
    },
    read: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default (mongoose.models.Message || mongoose.model('Message', MessageSchema)) as any;
