require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Webhook verification
app.get('/webhook', (req, res) => {
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('WEBHOOK_VERIFIED');
    res.status(200).send(challenge);
  } else {
    console.warn('WEBHOOK_VERIFICATION_FAILED', { mode, token });
    res.sendStatus(403);
  }
});

// Message receiving
app.post('/webhook', async (req, res) => {
  try {
    const body = req.body;

    if (body.object) {
      console.log(JSON.stringify(body, null, 2));
      res.status(200).send('EVENT_RECEIVED');
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error('Error handling webhook event:', error);
    res.sendStatus(500);
  }
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
