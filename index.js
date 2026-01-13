const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();

app.use(bodyParser.json());

const phoneNumberId = "989354214252486"; 
const accessToken = process.env.ACCESS_TOKEN; 

app.post('/', async (req, res) => {
    try {
        const body = req.body;
        if (body.entry && body.entry[0].changes && body.entry[0].changes[0].value.messages) {
            const from = body.entry[0].changes[0].value.messages[0].from;

            // 1. إرسال القالب العربي (رابط المجموعة وشرح العمل)
            await axios({
                method: "POST",
                url: `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`,
                data: {
                    messaging_product: "whatsapp",
                    to: from,
                    type: "template",
                    template: {
                        name: "welcome_with_links",
                        language: { code: "ar" },
                        components: [{
                            type: "body",
                            parameters: [
                                { type: "text", text: "https://chat.whatsapp.com/FvfkX4uo7UbKVxoFP9KILH" }, // تم وضع رابط مجموعتك هنا
                                { type: "text", text: "اضغط على الرابط أعلاه للانضمام" } // شرح العمل
                            ]
                        }]
                    }
                },
                headers: { "Authorization": `Bearer ${accessToken}` }
            });

            // 2. إرسال ملف صوتي (Audio) تلقائياً بعد الرسالة الأولى
            await axios({
                method: "POST",
                url: `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`,
                data: {
                    messaging_product: "whatsapp",
                    to: from,
                    type: "audio",
                    audio: {
                        // ملاحظة: يجب أن يكون هذا الرابط مباشراً لملف mp3
                        link: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" 
                    }
                },
                headers: { "Authorization": `Bearer ${accessToken}` }
            });

            res.sendStatus(200);
        }
    } catch (error) {
        console.error("Error:", error.response ? error.response.data : error.message);
        res.sendStatus(500);
    }
});

app.get('/', (req, res) => {
    res.status(200).send(req.query['hub.challenge']);
});

app.listen(process.env.PORT || 10000);
