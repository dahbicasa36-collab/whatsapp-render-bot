const axios = require('axios');
const express = require('express');
const app = express();
app.use(express.json());

// --- هاد المعلومات هما السوارت ديال المردودية ---
const TOKEN = "حط_هنا_الساروت_ديال_المكتشف"; 
const PHONE_ID = "989354214252486";
const AUDIO_URL = "حط_رابط_الأوديو_المزيان_ديالك";
const VERIFY_TOKEN = "123456"; 

// 1. هادي باش فيسبوك يقبل الربط (GET)
app.get('/webhook', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token === VERIFY_TOKEN) {
        res.status(200).send(challenge);
    } else {
        res.sendStatus(403);
    }
});

// 2. هادي باش البوت يجاوب الناس أوتوماتيكياً (POST)
app.post('/webhook', async (req, res) => {
    if (req.body.entry && req.body.entry[0].changes[0].value.messages) {
        let from = req.body.entry[0].changes[0].value.messages[0].from;
        try {
            // إرسال القالب فيه الرابط الأزرق
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

            // إرسال الأوديو موراها بـ 1 ثانية
            setTimeout(async () => {
                await axios.post(`https://graph.facebook.com/v24.0/${PHONE_ID}/messages`, {
                    messaging_product: "whatsapp",
                    to: from,
                    type: "audio",
                    audio: { link: AUDIO_URL }
                }, { headers: { 'Authorization': `Bearer ${TOKEN}` } });
            }, 1000);
        } catch (e) { console.log("خطأ في الإرسال"); }
    }
    res.sendStatus(200);
});

// هاد السطر ضروري باش Render يعرف البوت خدام
app.get('/', (req, res) => res.send('WhatsApp Bot is Live!'));

app.listen(process.env.PORT || 3000);
