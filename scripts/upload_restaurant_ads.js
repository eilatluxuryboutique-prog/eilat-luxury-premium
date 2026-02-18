require('dotenv').config({ path: '.env.local' });
const cloudinary = require('cloudinary').v2;
const path = require('path');

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const videos = [
    {
        path: 'c:/Users/יהונתן איזנברג/Downloads/Marketing_video_Pippit_20251020021622.mp4',
        id: 'ad_whale'
    },
    {
        path: 'c:/Users/יהונתן איזנברג/Downloads/סרטון תדמית 2.mp4',
        id: 'ad_pagoda'
    },
    {
        path: 'c:/Users/יהונתן איזנברג/Downloads/סרטון תדמית 3.mp4',
        id: 'ad_halev'
    },
    {
        path: 'c:/Users/יהונתן איזנברג/Downloads/סרטון תדמית 4.mp4',
        id: 'ad_pastory'
    }
];

async function run() {
    for (const vid of videos) {
        try {
            console.log(`Uploading ${vid.id}...`);
            const res = await cloudinary.uploader.upload(vid.path, {
                resource_type: 'video',
                folder: 'eilat_premium/ads',
                public_id: vid.id + '_' + Date.now(),
                timeout: 120000
            });
            console.log(`${vid.id}_URL:`, res.secure_url);
        } catch (e) {
            console.error(`Error uploading ${vid.id}:`, e.message);
        }
    }
}
run();
