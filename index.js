const axios = require('axios');

// معلومات حساب الاختبار (Sandbox)
const TOKEN = 'ضع_هنا_الـ_Access_Token_الخاص_بك';
const PHONE_NUMBER_ID = 'ضع_هنا_Phone_Number_ID';
const RECIPIENT_PHONE = '212676064584'; // رقمك اللي غيوصلو الميساج

const url = `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`;

const headers = {
    'Authorization': `Bearer ${TOKEN}`,
    'Content-Type': 'application/json'
};

// 1. إرسال القالب (رابط المجموعة)
async function sendTemplate() {
    const data = {
        "messaging_product": "whatsapp",
        "to": RECIPIENT_PHONE,
        "type": "template",
        "template": {
            "name": "come_with_links",
            "language": { "code": "ar" }
        }
    };
    return axios.post(url, data, { headers });
}

// 2. إرسال الملف الصوتي
async function sendAudio() {
    const data = {
        "messaging_product": "whatsapp",
        "to": RECIPIENT_PHONE,
        "type": "audio",
        "audio": {
            "link": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
        }
    };
    return axios.post(url, data, { headers });
}

// تشغيل البوت
async function runBot() {
    try {
        console.log("جاري إرسال القالب...");
        await sendTemplate();
        console.log("تم إرسال القالب بنجاح! جاري إرسال الصوت...");
        await sendAudio();
        console.log("تم إرسال كل شيء بنجاح!");
    } catch (error) {
        console.error("خطأ في الإرسال:", error.response ? error.response.data : error.message);
    }
}

runBot();
