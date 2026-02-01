const { spawn } = require('child_process');

async function addKey(key, value) {
    return new Promise((resolve, reject) => {
        console.log(`Adding ${key}...`);
        // 'npx vercel env add [key] production' will prompt for value on stdin
        // We use shell: true to support npx on Windows
        const p = spawn('npx', ['vercel', 'env', 'add', key, 'production'], { shell: true, stdio: ['pipe', 'inherit', 'inherit'] });

        p.stdin.write(value);
        p.stdin.end();

        p.on('close', (code) => {
            if (code === 0) {
                console.log(`Successfully added ${key}`);
                resolve();
            } else {
                console.error(`Failed to add ${key} with code ${code}`);
                reject(code);
            }
        });

        p.on('error', (err) => {
            console.error('Spawn error:', err);
            reject(err);
        });
    });
}

(async () => {
    try {
        // First remove if exists (ignore error)
        // Actually vercel env add will error if exists, so we might need rm first.
        // But we already removed them in previous step.
        await addKey('MONGODB_URI', 'mongodb+srv://eilatluxury:avi05052225536@cluster0.17oijba.mongodb.net/?appName=Cluster0');
        await addKey('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME', 'drr2qzpzk');
        console.log('All keys added.');
    } catch (err) {
        console.error('Script failed:', err);
        process.exit(1);
    }
})();
