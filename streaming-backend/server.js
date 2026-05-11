require('dotenv').config();

const http = require('http');
const OpenAI = require('openai');

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});

const PORT = 3000;

http
  .createServer(async (req, res) => {
    if (req.url === '/stream' && req.method === 'POST') {
      try {
        res.writeHead(200, {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
          'Access-Control-Allow-Origin': '*',
        });

        let body = '';

        req.on('data', chunk => {
          body += chunk.toString();
        });

        req.on('end', async () => {
          const parsed = JSON.parse(body);

          const stream =
            await client.chat.completions.create({
              model: 'llama-3.3-70b-versatile',
              stream: true,
              messages: [
                {
                  role: 'user',
                  content: parsed.prompt,
                },
              ],
            });

          for await (const chunk of stream) {
            const token =
              chunk.choices?.[0]?.delta?.content;

            if (!token) continue;

            const payload = {
              choices: [
                {
                  delta: {
                    content: token,
                  },
                },
              ],
            };

            res.write(
              `data: ${JSON.stringify(payload)}\n\n`
            );
          }

          res.write(`data: [DONE]\n\n`);
          res.end();
        });
      } catch (e) {
        console.error(e);

        res.write(
          `data: ${JSON.stringify({
            error: true,
            message: e.message,
          })}\n\n`
        );

        res.end();
      }
    } else {
      res.writeHead(404);
      res.end();
    }
  })
  .listen(PORT, () => {
    console.log(`Streaming server running on ${PORT}`);
  });