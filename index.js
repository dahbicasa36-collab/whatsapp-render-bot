const axios = require('axios');
const express = require('express');
const app = express();
app.use(express.json());

// هاد المعلومات هما اللي كيتحكمو في نجاح العملية
const TOKEN = "حط_هنا_الساروت_الجديد_ديال_المكتشف";
const PHONE_ID = "989354214252486";
const AUDIO_URL = "حط_هنا_رابط_الأوديو_المزيان_ديالك";

app.post('/webhook', async (req, res) => {
    // هاد الجزء كيتأكد بلي الميساج جا من عند زبون
    if (req.body.entry && req.body.entry[0].changes[0].value.messages) {
        let from = req.body.entry[0].changes[0].value.messages[0].from;

        try {
            // 1. صيفط القالب فيه رابط المجموعة
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

            // 2. صيفط الأوديو المزيان موراها بـ 1 ثانية
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

app.listen(process.env.PORT || 3000);
