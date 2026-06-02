const fs = require('fs');
const sharp = require('sharp');

// viewBox "-6 -6 36 36" means the content (0 to 24) has 6 units of padding on all sides.
// This shrinks the house to about 66% of the full icon size.
const svgIcon = `
<svg width="1024" height="1024" viewBox="-6 -6 36 36" xmlns="http://www.w3.org/2000/svg">
  <rect x="-6" y="-6" width="36" height="36" fill="#FF385C" />
  <path fill="white" d="M12 1.5l10 10v11h-20v-11l10-10zm0 3.328l-8 8v8.672h16v-8.672l-8-8z" />
</svg>
`;

async function generate() {
  const buffer = Buffer.from(svgIcon);
  
  await sharp(buffer)
    .resize(512, 512, { kernel: sharp.kernel.lanczos3 })
    .png()
    .toFile('public/icon-512.png');
    
  await sharp(buffer)
    .resize(192, 192, { kernel: sharp.kernel.lanczos3 })
    .png()
    .toFile('public/icon-192.png');
    
  await sharp(buffer)
    .resize(180, 180, { kernel: sharp.kernel.lanczos3 })
    .png()
    .toFile('public/apple-icon.png');
    
  // Copy to app/apple-icon.png as well
  fs.copyFileSync('public/apple-icon.png', 'app/apple-icon.png');
    
  console.log('High-quality padded icons generated!');
}

generate().catch(console.error);
