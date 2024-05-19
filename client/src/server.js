const OpenAi = require('openai');
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors middleware
require('dotenv').config();

const app = express();
const port = 8080;

app.use(bodyParser.json());
app.use(cors());
// Your OpenAI GPT API key
const OPENAI_API_KEY = process.env.SECRET_API_KEY;
console.log(OPENAI_API_KEY);
app.post('/chat', async (req, res) => {
  try {
    const openai = new OpenAi({
      apiKey: OPENAI_API_KEY,
    });
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant.',
        },
        { role: 'user', content: req.body.prompt },
      ],
      model: 'gpt-3.5-turbo-0125',
      response_format: { type: 'json_object' },
    });
    console.log(completion.choices[0].message.content);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
