const axios = require('axios');

// --- إعدادات الحساب ---
const TOKEN = 'ضع_هنا_الـ_Access_Token_الخاص_بك';
const PHONE_NUMBER_ID = 'ضع_هنا_Phone_Number_ID'; // هذا هو رقم التعريف اللي في الصورة
const RECIPIENT_PHONE = '212676064584'; // رقمك اللي غيوصلو الميساج

const url = `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`;

const headers = {
    'Authorization': `Bearer ${TOKEN}`,
    'Content-Type': 'application/json'
};

// وظيفة لإرسال الرسائل (قالب + صوت)
async function startAutomatedReply() {
    try {
        // 1. إرسال القالب اللي فيه الرابط
        console.log("إرسال القالب العربي...");
        await axios.post(url, {
            "messaging_product": "whatsapp",
            "to": RECIPIENT_PHONE,
            "type": "template",
            "template": {
                "name": "come_with_links",
                "language": { "code": "ar" }
            }
        }, { headers });

        // 2. إرسال المقطع الصوتي فوراً
        console.log("إرسال المقطع الصوتي...");
        await axios.post(url, {
            "messaging_product": "whatsapp",
            "to": RECIPIENT_PHONE,
            "type": "audio",
            "audio": {
                "link": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" 
            }
        }, { headers });

        console.log("✅ تمت العملية بنجاح بدون الحاجة للمكتشف!");

    } catch (error) {
        console.error("❌ وقع خطأ:", error.response ? error.response.data : error.message);
    }
}

startAutomatedReply();
