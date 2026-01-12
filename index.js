const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;
const verifyToken = process.env.VERIFY_TOKEN;
const accessToken = process.env.ACCESS_TOKEN;

const phoneNumberId = "954803041047023";

// ✅ Verify webhook (GET)
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === verifyToken) {
    console.log('✅ WEBHOOK VERIFIED');
    res.status(200).send(challenge);
  } else {
    console.log("❌ Verification failed");
    res.status(403).end();
  }
});

// ✅ Receive messages (POST)
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

// Root route (اختياري فقط للاختبار)
app.get('/', (req, res) => {
  res.send("🚀 WhatsApp Render Bot is running!");
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
