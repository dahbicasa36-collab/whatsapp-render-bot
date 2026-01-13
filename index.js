const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
app.use(bodyParser.json());

// البيانات التي استخرجناها من حسابك وتأكدنا منها
const phoneNumberId = "989354214252486"; 
const verifyToken = "mytoken123"; 
const accessToken = process.env.ACCESS_TOKEN; 

// رابط مجموعتك
const groupLink = "https://chat.whatsapp.com/FvfkX4uo7UbKVxoFP9KILH";

// 1. مسار التحقق (Webhook Verification)
app.get('/', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === verifyToken) {
        return res.status(200).send(challenge);
    }
    res.status(403).send('Error');
});

// 2. استقبال الرسائل وإرسال الترحيب التلقائي
app.post('/', async (req, res) => {
    try {
        const body = req.body;
        if (body.entry && body.entry[0].changes && body.entry[0].changes[0].value.messages) {
            const from = body.entry[0].changes[0].value.messages[0].from;
            
            console.log("استلمت رسالة من: " + from);

            // إرسال رد الترحيب التلقائي
            await axios({
                method: "POST",
                url: `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`,
                data: {
                    messaging_product: "whatsapp",
                    to: from,
                    type: "text",
                    text: { body: "مرحباً بك! 🎉\nتفضل رابط مجموعة الواتساب الخاصة بنا: " + groupLink }
                },
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`
                }
            });

            console.log("تم إرسال رد الترحيب بنجاح!");
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
app.listen(PORT, () => console.log(`السيرفر شغال وجاهز على بورت ${PORT}`));
