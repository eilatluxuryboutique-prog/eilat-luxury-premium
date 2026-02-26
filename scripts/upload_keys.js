const fs = require('fs');
const https = require('https');

const VERCEL_TOKEN = 'LpXy2o8wMzWn934aQ4Vv0wE4'; // You may need to replace this or use your machine's auth token
const PROJECT_ID = 'prj_H3XcU3t686jg6doFTCs6jTevAvpa'; // Eilat booking premium project ID

async function addEnv(key, value) {
    console.log(`Adding ${key}...`);
    const data = JSON.stringify({
        key: key,
        value: value,
        type: 'encrypted',
        target: ['production', 'preview', 'development']
    });

    const options = {
        hostname: 'api.vercel.com',
        path: `/v9/projects/${PROJECT_ID}/env`,
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${VERCEL_TOKEN}`,
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };

    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    console.log(`Successfully added ${key}`);
                    resolve(JSON.parse(body));
                } else {
                    console.error(`Failed to add ${key}: ${res.statusCode} ${body}`);
                    resolve(null); // Resolve anyway so we can continue
                }
            });
        });

        req.on('error', (e) => reject(e));
        req.write(data);
        req.end();
    });
}

async function main() {
    await addEnv('GOOGLE_CLIENT_ID', 'REMOVED_FOR_SECURITY');
    await addEnv('GOOGLE_CLIENT_SECRET', 'REMOVED_FOR_SECURITY');
    await addEnv('NEXTAUTH_SECRET', 'iloveluxurybooking20261234567890');
    await addEnv('NEXTAUTH_URL', 'https://eilat-booking-premium.vercel.app');
}

main().catch(console.error);
