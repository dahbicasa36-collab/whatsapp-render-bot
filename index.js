const axios = require('axios');
const express = require('express');
const app = express();
app.use(express.json());

// --- إعداداتك الخاصة ---
const TOKEN = "حط_هنا_الساروت_الجديد_ديال_المكتشف"; 
const PHONE_ID = "989354214252486";
const AUDIO_URL = "حط_هنا_رابط_الأوديو_المزيان_ديالك";
const VERIFY_TOKEN = "123456"; // هادي هي الكلمة اللي غتحط في خانة "رمز التحقق" في فيسبوك

// 1. هاد الجزء هو "المصافحة" اللي كيحتاجها فيسبوك باش يقبل الرابط (GET)
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

// 2. هاد الجزء هو اللي كيتكلف بإرسال الرابط والأوديو (POST)
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

            // إرسال الأوديو موراها بـ 1 ثانية
            setTimeout(async () => {
                await axios.post(`https://graph.facebook.com/v24.0/${PHONE_ID}/messages`, {
                    messaging_product: "whatsapp",
                    to: from,
                    type: "audio",
                    audio: { link: AUDIO_URL }
                }, { headers: { 'Authorization': `Bearer ${TOKEN}` } });
            }, 1000);

        } catch (e) {
            console.log("خطأ في الإرسال: ", e.message);
        }
    }
    res.sendStatus(200);
});

app.listen(process.env.PORT || 3000, () => console.log('البوت خدام بنجاح!'));
