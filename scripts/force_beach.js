
const url = 'https://res.cloudinary.com/demo/video/upload/beach.mp4';
fetch('https://eilat-luxury.vercel.app/api/ingest?url=' + encodeURIComponent(url))
    .then(res => res.text())
    .then(console.log)
    .catch(console.error);
