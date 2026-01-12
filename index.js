const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

// 1. رمز التحقق (اكتب هذا في فيسبوك)
const verifyToken = "mytoken123"; 

// 2. التحقق من Webhook (هذا ما يطلبه فيسبوك الآن)
app.get('/', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === verifyToken) {
        return res.status(200).send(challenge);
    }
    res.status(403).send('Error, wrong token');
});

// 3. استقبال الرسائل
app.post('/', (req, res) => {
    console.log("Message Received!");
    res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
