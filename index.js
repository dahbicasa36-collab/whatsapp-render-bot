const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();

app.use(bodyParser.json());

// البيانات من صورك (تأكد أنها مطابقة)
const phoneNumberId = "989354214252486"; 
const verifyToken = "mytoken123"; 
const accessToken = process.env.ACCESS_TOKEN; 
const templateName = "welcome_new"; 

// 1. مسار التحقق (Webhook Verification)
app.get('/', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === verifyToken) {
        console.log("تم التحقق من الـ Webhook بنجاح ✅");
        return res.status(200).send(challenge);
    }
    res.status(403).send('Error');
});

// 2. استقبال الرسائل والرد بالقالب
app.post('/', async (req, res) => {
    try {
        const body = req.body;

        // التحقق من وصول رسالة نصية
        if (body.entry && body.entry[0].changes && body.entry[0].changes[0].value.messages) {
            const from = body.entry[0].changes[0].value.messages[0].from;
            console.log("وصلت رسالة من الرقم: " + from);

            // إرسال القالب الترحيبي
            const response = await axios({
                method: "POST",
                url: `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`,
                data: {
                    messaging_product: "whatsapp",
                    to: from,
                    type: "template",
                    template: {
                        name: templateName,
                        language: {
                            code: "ar" // اللغة العربية كما في صورتك
                        }
                    }
                },
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`
                }
            });

            console.log("تم إرسال الرد الآلي بنجاح! استجابة فيسبوك:", response.status);
            res.sendStatus(200);
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        console.error("حدث خطأ أثناء الإرسال:");
        if (error.response) {
            console.error(JSON.stringify(error.response.data));
        } else {
            console.error(error.message);
        }
        res.sendStatus(500);
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`السيرفر شغال وجاهز لاستقبال الرسائل على بورت ${PORT}`);
});
