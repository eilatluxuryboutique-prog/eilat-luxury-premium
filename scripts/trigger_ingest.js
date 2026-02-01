
const url = 'https://www.pexels.com/video/aerial-view-of-tropical-beach-resort-at-sunset-29912326/';
fetch('https://eilat-luxury.vercel.app/api/ingest?url=' + encodeURIComponent(url))
    .then(res => res.text())
    .then(console.log)
    .catch(console.error);
