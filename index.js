const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

const port = process.env.PORT || 4000;
const verifyToken = process.env.VERIFY_TOKEN;
const accessToken = process.env.ACCESS_TOKEN;

const phoneNumberId = "954803041047023";

// Route عادي باش تتأكد أن السيرفر خدام
app.get('/', (req, res) => {
  res.send('🚀 WhatsApp Render Bot is running');
});

// ✅ Verify Webhook (ضروري لميتا)
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === verifyToken) {
    console.log('✅ WEBHOOK VERIFIED');
    res.status(200).send(challenge);
  } else {
    console.log('❌ WEBHOOK VERIFICATION FAILED');
    res.sendStatus(403);
  }
});

// 📩 استقبال الرسائل
app.post('/webhook', async (req, res) => {
  console.log("📩 Webhook received");
  console.log(JSON.stringify(req.body, null, 2));

  try {
    if (
      req.body.entry &&
      req.body.entry[0].changes &&
      req.body.entry[0].changes[0].value.messages &&
      req.body.entry[0].changes[0].value.messages[0]
    ) {
      const from = req.body.entry[0].changes[0].value.messages[0].from;

      await axios.post(
        `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`,
        {
          messaging_product: "whatsapp",
          to: from,
          type: "template",
          template: {
            name: "welcome_new",
            language: { code: "ar" }
          }
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json"
          }
        }
      );

      console.log(`✅ Auto-reply sent to ${from}`);
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("❌ Error:", error.response?.data || error.message);
    res.sendStatus(200);
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
