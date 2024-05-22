const OpenAi = require('openai');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 8080;

app.use(bodyParser.json());
app.use(
  cors({
    origin: 'http://localhost:3000',
    allowedHeaders: ['Content-Type'],
  })
);

const OPENAI_API_KEY = process.env.SECRET_API_KEY;

app.post('/chat', async (req, res) => {
  try {
    const openai = new OpenAi({
      apiKey: OPENAI_API_KEY,
    });

    // Extract the prompt and conversation history from the request body
    const { prompt, conversation } = req.body;

    // Prepare messages array with user prompts and system messages
    const messages = [
      { role: 'system', content: 'You are a helpful assistant.' },
      ...conversation.map(({ promptUser }) => ({
        role: 'user',
        content: promptUser,
      })),
      { role: 'user', content: prompt },
    ];
    // Call the AI model with the extended conversation history
    const completion = await openai.chat.completions.create({
      messages,
      model: 'gpt-3.5-turbo-0125',
    });

    // Send the response back to the client
    res.json(completion.choices[0].message.content);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
