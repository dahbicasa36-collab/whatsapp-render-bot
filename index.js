const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
app.use(bodyParser.json());

// البيانات المستخرجة من حسابك
const phoneNumberId = "989354214252486"; 
const verifyToken = "mytoken123"; 
const accessToken = process.env.ACCESS_TOKEN; 

// اسم القالب النشط من صورتك
const templateName = "welcome_new"; 

// 1. مسار التحقق لـ Webhook
app.get('/', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === verifyToken) {
        return res.status(200).send(challenge);
    }
    res.status(403).send('Error');
});

// 2. استقبال الرسائل والرد باستخدام القالب
app.post('/', async (req, res) => {
    try {
        const body = req.body;
        if (body.entry && body.entry[0].changes && body.entry[0].changes[0].value.messages) {
            const from = body.entry[0].changes[0].value.messages[0].from;
            
            console.log("Message Received from: " + from);

            // إرسال رد باستخدام القالب welcome_new
            await axios({
                method: "POST",
                url: `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`,
                data: {
                    messaging_product: "whatsapp",
                    to: from,
                    type: "template",
                    template: {
                        name: templateName,
                        language: {
                            code: "ar" // اللغة العربية كما يظهر في القالب
                        }
                    }
                },
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`
                }
            });

            console.log("تم إرسال القالب الترحيبي بنجاح!");
            res.sendStatus(200);
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        console.error("خطأ في الإرسال:", error.response ? error.response.data : error.message);
        res.sendStatus(500);
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`السيرفر شغال ويستخدم القالب: ${templateName}`));
