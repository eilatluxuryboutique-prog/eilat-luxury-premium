const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: '.env.local' });

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

async function testModel(name) {
    try {
        const model = genAI.getGenerativeModel({ model: name });
        const result = await model.generateContent("hello");
        console.log(name, "OK", result.response.text().substring(0, 20).replace(/\n/g, ' '));
    } catch (err) {
        console.log(name, "ERROR", err.message);
    }
}

async function run() {
    await testModel("gemini-flash-latest");
}
run();
