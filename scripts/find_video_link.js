
const id = '29912326';
const base = `https://videos.pexels.com/video-files/${id}/${id}`;
const variations = [
    '-uhd_2560_1440_30fps.mp4',
    '-hd_1920_1080_25fps.mp4',
    '-hd_1920_1080_30fps.mp4',
    '-sd_960_540_25fps.mp4',
    '-sd_640_360_25fps.mp4'
];

async function check() {
    for (const v of variations) {
        const url = base + v;
        try {
            const res = await fetch(url, { method: 'HEAD' });
            if (res.ok) {
                console.log(url);
                return;
            }
        } catch (e) { }
    }
    console.log('None found');
}

check();
