const express = require('express');
const router = express.Router();

const Pusher = require('pusher');

const pusher = new Pusher({
    appId: "1584565",
    key: "c6ebd2b1c5fa25e580cd",
    secret: "7573fd91ffd7eb4bbb84",
    cluster: "mt1",
    useTLS: true
});

router.get('/', (req, res) => {
    res.send('CHAT');
});

router.post('/', ( req, res) => {
    pusher.trigger("my-channel", "my-event", {
        message: "hello world"
    });

    return res.json({ success: true, message: 'Thanks! IT WORKED!!!'});
});

module.exports = router;