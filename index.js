import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/parse-dm', async (req, res) => {
  try {
    const { text } = req.body;
    const gptRes = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'DM에서 이름, 연락처, 주소, 상품명, 옵션, 수량을 JSON으로 추출해줘.',
        },
        {
          role: 'user',
          content: text,
        },
      ],
    });

    const parsed = gptRes.choices[0].message.content;
    res.json({ parsed });
  } catch (error) {
    res.status(500).json({ error: 'GPT 처리 오류', detail: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
