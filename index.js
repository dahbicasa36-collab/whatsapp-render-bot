const axios = require('axios');
const express = require('express');
const app = express();
app.use(express.json());

const TOKEN = "حط_هنا_الساروت_ديال_المكتشف"; 
const PHONE_ID = "989354214252486";
const AUDIO_URL = "حط_رابط_الأوديو_المزيان_ديالك";
const VERIFY_TOKEN = "123456"; 

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

app.post('/webhook', async (req, res) => {
    if (req.body.entry && req.body.entry[0].changes[0].value.messages) {
        let from = req.body.entry[0].changes[0].value.messages[0].from;
        try {
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
                            { type: "text", text: "عزيزي الزبون" },
                            { type: "text", text: "https://chat.whatsapp.com/FvfkX4uo7UbKVxoFP9KILH" }
                        ]
                    }]
                }
            }, { headers: { 'Authorization': `Bearer ${TOKEN}` } });

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

app.get('/', (req, res) => res.send('Bot is Live!'));
app.listen(process.env.PORT || 3000);
