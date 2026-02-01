# Final Steps: Connect Netlify to GitHub ☁️

Great job! The code is now safely on GitHub.
Now we just need to tell Netlify to pick it up.

1. Go to [netlify.com](https://app.netlify.com).
2. Click **"Add new site"** -> **"Import an existing project"**.
3. Choose **GitHub**.
4. Select **`eilat-luxury-premium`**.
5. Click **Deploy eilat-luxury-premium**.

## IMPORTANT: Add "Environment Variables"
After you click Deploy, go to **Site Settings** -> **Environment Variables**.
Click **"Add variable"** and copy these:

| Key | Value |
|-----|-------|
| `MONGODB_URI` | `mongodb+srv://eilatluxury:avi05052225536@cluster0.17oijba.mongodb.net/?appName=Cluster0` |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | `drr2qzpzk` |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | `eilat_booking_unsigned` |
| `CLOUDINARY_API_KEY` | `594182461165845` |
| `CLOUDINARY_API_SECRET` | `bPFMmX4CEC-kf9jrfxE6AEKowro` |

Once added, go to **Deploys** -> **Trigger deploy**.
And you are DONE.
