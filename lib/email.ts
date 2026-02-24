import { Resend } from 'resend';

// Initialize only if API key is present
const resend = process.env.RESEND_API_KEY
    ? new Resend(process.env.RESEND_API_KEY)
    : null;

export const sendBookingConfirmation = async (
    to: string,
    bookingDetails: {
        id: string;
        propertyName: string;
        checkIn: string;
        checkOut: string;
        totalPrice: number;
        guests: number;
    }
) => {
    if (!resend) {
        console.log('📧 Mock Email Sent:', { to, subject: 'Booking Confirmation', width: bookingDetails });
        return { success: true, mock: true };
    }

    try {
        // Generate simple ICS string for the event
        const formatDate = (dateString: string) => {
            const d = new Date(dateString);
            return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        };

        const icsContent = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//Eilat Booking Premium//EN',
            'BEGIN:VEVENT',
            `DTSTART:${formatDate(bookingDetails.checkIn)}`,
            `DTEND:${formatDate(bookingDetails.checkOut)}`,
            `SUMMARY:חופשה באילת - ${bookingDetails.propertyName}`,
            `LOCATION:Eilat, Israel`,
            `DESCRIPTION:הזמנה מספר: ${bookingDetails.id}\\nאורחים: ${bookingDetails.guests}`,
            'END:VEVENT',
            'END:VCALENDAR'
        ].join('\\r\\n');

        const { data, error } = await resend.emails.send({
            from: 'Eilat Premium <reservations@eilat-luxury.com>',
            to: [to],
            // In a real app, this would be verified domain. For Vercel/Resend free tier, it only sends to the account email.
            // Using a generic mockup HTML for now.
            subject: `🎉 אישור הזמנה: ${bookingDetails.propertyName}`,
            html: `
            <div dir="rtl" style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
                <div style="background-color: #000; color: #D4AF37; padding: 20px; text-align: center;">
                    <h1 style="margin: 0;">Eilat Booking Premium</h1>
                </div>
                <div style="padding: 20px;">
                    <h2>היי! ההזמנה שלך אושרה. 🥂</h2>
                    <p>אנחנו מתרגשים לארח אותך באילת!</p>
                    
                    <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="margin-top: 0;">פרטי ההזמנה (#${bookingDetails.id.slice(-6)})</h3>
                        <ul style="list-style: none; padding: 0;">
                            <li><strong>נכס:</strong> ${bookingDetails.propertyName}</li>
                            <li><strong>צ'ק-אין:</strong> ${bookingDetails.checkIn}</li>
                            <li><strong>צ'ק-אאוט:</strong> ${bookingDetails.checkOut}</li>
                            <li><strong>אורחים:</strong> ${bookingDetails.guests}</li>
                            <li><strong>סה"כ שולם:</strong> ₪${bookingDetails.totalPrice.toLocaleString()}</li>
                        </ul>
                    </div>

                    <p>קבלה רשמית מצורפת למייל זה בנוסף לזימון יומן (ICS) לטובת סנכרון הנופש.</p>
                    <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://eilat-booking-premium.vercel.app'}/dashboard" style="display: inline-block; background-color: #D4AF37; color: #000; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-weight: bold;">לצפייה בהזמנה באזור האישי</a>
                    
                    <p style="margin-top: 30px; font-size: 12px; color: #999;">אם יש שאלות, אנחנו כאן בוואטסאפ ובמייל.</p>
                </div>
                <div style="background-color: #eee; padding: 10px; text-align: center; font-size: 12px;">
                    © 2026 Eilat Booking Premium
                </div>
            </div>
            `,
            attachments: [
                {
                    filename: 'reservation.ics',
                    content: Buffer.from(icsContent).toString('base64'),
                },
                {
                    filename: 'invoice.pdf',
                    content: Buffer.from('Mock PDF Content for Invoice').toString('base64'), // Mock invoice
                }
            ]
        });

        if (error) {
            console.error('Email failed:', error);
            return { success: false, error };
        }

        return { success: true, data };
    } catch (e) {
        console.error('Email exception:', e);
        return { success: false, error: e };
    }
};
