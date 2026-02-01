require('dotenv').config({ path: '.env.local' });
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const VIDEO_PATH = 'c:/Users/יהונתן איזנברג/Downloads/סרטון/12839105_2560_1440_30fps.mp4';

async function run() {
    try {
        console.log('Uploading to Cloudinary...');
        const res = await cloudinary.uploader.upload(VIDEO_PATH, {
            resource_type: 'video',
            folder: 'eilat_premium',
            public_id: 'hero_final_' + Date.now(),
            timeout: 120000
        });
        console.log('FINAL_URL:', res.secure_url);
    } catch (e) {
        console.error('Error:', e);
    }
}
run();
