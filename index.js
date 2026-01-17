const axios = require('axios');
const express = require('express');
const app = express();
app.use(express.json());

const TOKEN = "ضع_هنا_الساروت_الجديد_من_المكتشف"; 
const PHONE_ID = "989354214252486";
const AUDIO_URL = "ضع_رابط_الأوديو_الذي_عمل_معك_جيدا";

// --- هدا هو الجزء الناقص للتحقق من Webhook ---
app.get('/webhook', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token === '123456') { // تأكد أن الرقم هنا هو 123456
        res.status(200).send(challenge);
    } else {
        res.sendStatus(403);
    }
});

app.post('/webhook', async (req, res) => {
    if (req.body.entry && req.body.entry[0].changes[0].value.messages) {
        let from = req.body.entry[0].changes[0].value.messages[0].from;
        try {
            // إرسال القالب مع الرابط
            await axios.post(`https://graph.facebook.com/v24.0/${PHONE_ID}/messages`, {
                messaging_product: "whatsapp",
                to: from,
                type: "template",
                template: {
                    name: "welcome_with_links",
                    language: { code: "ar" },
                    components: [{
                        type: "body",
                        parameters: [
                            { type: "text", text: "إلياس" },
                            { type: "text", text: "https://chat.whatsapp.com/FvfkX4uo7UbKVxoFP9KILH" }
                        ]
                    }]
                }
            }, { headers: { 'Authorization': `Bearer ${TOKEN}` } });

            // إرسال الأوديو
            setTimeout(async () => {
                await axios.post(`https://graph.facebook.com/v24.0/${PHONE_ID}/messages`, {
                    messaging_product: "whatsapp",
                    to: from,
                    type: "audio",
                    audio: { link: AUDIO_URL }
                }, { headers: { 'Authorization': `Bearer ${TOKEN}` } });
            }, 1000);
        } catch (e) { console.log("Error"); }
    }
    res.sendStatus(200);
});

app.listen(process.env.PORT || 3000);
