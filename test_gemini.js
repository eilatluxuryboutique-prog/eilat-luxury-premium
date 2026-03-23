require('dotenv').config({ path: '.env' });
const { GoogleGenerativeAI } = require('@google/generative-ai');
const mongoose = require('mongoose');

async function test() {
    console.log("Starting test...");
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("No API key");
        return;
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
        model: "gemini-flash-lite-latest",
        systemInstruction: "You are a test assistant."
    });

    try {
        console.log("Sending basic message...");
        const chat = model.startChat({ history: [] });
        const result = await chat.sendMessage("hello!");
        console.log("Basic message success:", result.response.text());
    } catch (e) {
        console.error("Basic test failed:", e);
    }

    try {
        console.log("Sending message with badly formatted history...");
        const chat = model.startChat({
            history: [
                { role: "user", parts: [{ text: "msg 1" }] },
                { role: "user", parts: [{ text: "msg 2" }] }
            ]
        });
        const result = await chat.sendMessage("hello!");
        console.log("Success with malformed history:", result.response.text());
    } catch (e) {
        console.error("Malformed history test failed. MESSAGE:", e?.message);
    }
}
test();
