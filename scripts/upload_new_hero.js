require('dotenv').config({ path: '.env.local' });
const cloudinary = require('cloudinary').v2;
const mongoose = require('mongoose');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const VIDEO_PATH = 'c:/Users/יהונתן איזנברג/Downloads/תמונת רקע חדש/12842699_2560_1440_30fps.mp4';
const MONGODB_URI = process.env.MONGODB_URI;

async function run() {
    try {
        console.log('Starting Upload for:', VIDEO_PATH);
        const res = await cloudinary.uploader.upload(VIDEO_PATH, {
            resource_type: 'video',
            folder: 'eilat_premium',
            public_id: 'hero_video_new_' + Date.now(),
            timeout: 300000 // 5 minutes
        });
        console.log('Video Uploaded Successfully:', res.secure_url);

        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);

        const contentSchema = new mongoose.Schema({ key: String, data: Object }, { strict: false });
        const Content = mongoose.models.Content || mongoose.model('Content', contentSchema);

        console.log('Updating Site Content...');
        await Content.findOneAndUpdate(
            { key: 'site_content' },
            { $set: { "data.hero.videoUrl": res.secure_url } },
            { upsert: true }
        );
        console.log('DB Updated with New Video URL!');
        process.exit(0);

    } catch (e) {
        console.error('Upload Failed:', e);
        process.exit(1);
    }
}

run();
