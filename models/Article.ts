import mongoose from 'mongoose';

const ArticleSchema = new mongoose.Schema({
    slug: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    title: {
        type: String, // Store as localized or just Hebrew for now? Let's use String but maybe Object for locale if needed. Default Hebrew.
        required: true
    },
    excerpt: {
        type: String,
        required: true
    },
    content: {
        type: String, // HTML or Markdown
        required: true
    },
    coverImage: {
        type: String,
        required: true
    },
    author: {
        type: String,
        default: 'Eilat Luxury Team'
    },
    tags: [String],
    published: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default (mongoose.models.Article || mongoose.model('Article', ArticleSchema)) as any;
