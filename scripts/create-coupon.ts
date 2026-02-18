import mongoose from 'mongoose';
import Coupon from '../models/Coupon';
import dbConnect from '../lib/db';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const createCoupon = async () => {
    try {
        await dbConnect();

        const code = 'DEMO2026';

        // Delete existing
        await Coupon.deleteMany({ code });

        const coupon = await Coupon.create({
            code,
            discountType: 'percent',
            value: 20, // 20% off
            expirationDate: new Date('2026-12-31'),
            usageLimit: 100,
            usedCount: 0
        });

        console.log('✅ Coupon created:', coupon);
        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating coupon:', error);
        process.exit(1);
    }
};

createCoupon();
