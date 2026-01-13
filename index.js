const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
app.use(bodyParser.json());

// المعلومات المستخرجة من صورك
const phoneNumberId = "989354214252486"; 
const verifyToken = "mytoken123"; 
const accessToken = process.env.ACCESS_TOKEN; 

// اسم القالب الخاص بك من الصورة
const templateName = "welcome_new"; 

app.get('/', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
    if (mode === 'subscribe' && token === verifyToken) {
        return res.status(200).send(challenge);
    }
    res.status(403).send('Error');
});

app.post('/', async (req, res) => {
    const body = req.body;
    if (body.entry && body.entry[0].changes && body.entry[0].changes[0].value.messages) {
        const from = body.entry[0].changes[0].value.messages[0].from;
        console.log("استلمت رسالة من: " + from);

        try {
            // إرسال القالب الاحترافي "welcome_new"
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
                            code: "ar" // اللغة العربية كما في الصورة
                        }
                    }
                },
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`
                }
            });
            console.log("تم إرسال قالب الترحيب بنجاح!");
        } catch (error) {
            console.error("خطأ في إرسال القالب:", error.response ? error.response.data : error.message);
        }
        res.sendStatus(200);
    } else {
        res.sendStatus(404);
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`السيرفر شغال ويستخدم القالب ${templateName}`));
