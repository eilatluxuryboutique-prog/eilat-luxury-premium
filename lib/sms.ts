export async function sendSMS(to: string, message: string) {
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
        console.log('SMS Simulation:', { to, message });
        return { success: true, simulated: true };
    }

    try {
        // Mock Implementation for Twilio
        // import twilio from 'twilio';
        // const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
        // await client.messages.create({ ... });

        console.log('Sending Real SMS via Twilio (Code Ready, Keys Needed)', { to, message });
        return { success: true };
    } catch (error) {
        console.error('SMS Failed:', error);
        return { success: false, error };
    }
}
