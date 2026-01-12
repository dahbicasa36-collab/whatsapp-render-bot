const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

// Render يعطي PORT تلقائياً
const port = process.env.PORT || 3000;

// المتغيرات من Environment
const verifyToken = process.env.VERIFY_TOKEN;
const accessToken = process.env.ACCESS_TOKEN;

// Phone Number ID ديال واتساب
const phoneNumberId = "954803041047023";

/**
 * ============================
 * 1) Webhook Verification
 * ============================
 */
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

/**
 * ============================
 * 2) Receive Messages
 * ============================
 */
app.post('/webhook', async (req, res) => {
  console.log("📩 Webhook received");
  console.log(JSON.stringify(req.body, null, 2));

  try {
    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const messages = changes?.value?.messages;

    if (messages && messages[0]) {
      const from = messages[0].from; // رقم المرسل

      // إرسال قالب ترحيب تلقائياً
      await axios.post(
        `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`,
        {
          messaging_product: "whatsapp",
          to: from,
          type: "template",
          template: {
            name: "welcome_new",   // اسم القالب فـ Meta
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

/**
 * ============================
 * 3) Test Route (اختياري)
 * ============================
 */
app.get('/', (req, res) => {
  res.send('🚀 WhatsApp Render Bot is running');
});

/**
 * ============================
 * 4) Start Server
 * ============================
 */
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
