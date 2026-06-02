const fs = require('fs');
const sharp = require('sharp');

const svgIcon = `
<svg width="512" height="512" viewBox="0 0 24 24" fill="#FF385C" xmlns="http://www.w3.org/2000/svg">
  <rect width="24" height="24" fill="white" />
  <path d="M12 1.5l10 10v11h-20v-11l10-10zm0 3.328l-8 8v8.672h16v-8.672l-8-8z" />
</svg>
`;

async function generate() {
  const buffer = Buffer.from(svgIcon);
  
  await sharp(buffer)
    .resize(512, 512)
    .png()
    .toFile('public/icon-512.png');
    
  await sharp(buffer)
    .resize(192, 192)
    .png()
    .toFile('public/icon-192.png');
    
  await sharp(buffer)
    .resize(180, 180)
    .png()
    .toFile('public/apple-icon.png');
    
  console.log('Icons generated!');
}

generate();
