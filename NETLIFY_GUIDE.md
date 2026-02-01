# How to Move to Netlify 🚚

We are "packing our boxes" and moving to a new home. Follow these steps to deploy on Netlify.

## Step 1: Create Netlify Account
1. Go to [netlify.com](https://www.netlify.com).
2. Click **Sign Up**.
3. Choose **GitHub** to sign up (this connects your code automatically).

## Step 2: Import Your Site
1. Once logged in, click **"Add new site"** -> **"Import an existing project"**.
2. Click **GitHub**.
3. It might ask to "Authorize Netlify". Click **Authorize**.
4. Search for your repository: `eilat-booking-premium`.
5. Click it.

## Step 3: Configure Settings & Deploy
You will see a "Deploy settings" page.
1. **Build command:** `npm run build` (Should be automatic).
2. **Publish directory:** `.next` (Should be automatic).
3. **Important:** Click **"Show advanced"** or **"New Variable"** (Environment Variables).
4. Add these keys (Copy-Paste accurately):

| Key | Value |
|-----|-------|
| `MONGODB_URI` | `mongodb+srv://eilatluxury:avi05052225536@cluster0.17oijba.mongodb.net/?appName=Cluster0` |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | `drr2qzpzk` |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | `eilat_booking_unsigned` |
| `CLOUDINARY_API_KEY` | `594182461165845` |
| `CLOUDINARY_API_SECRET` | `bPFMmX4CEC-kf9jrfxE6AEKowro` |

(You click "New Variable" for each one).

## Step 4: Click Deploy
Click **"Deploy eilat-booking-premium"**.

Wait about 2-3 minutes.
Netlify will give you a new link (something like `funny-name-123.netlify.app`).
**That is your new site.**
Upload works. Admin Works. No Vercel.

Good luck! 🍀
