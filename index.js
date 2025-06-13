
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { OpenAI } from 'openai';

dotenv.config();

const app = express();
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
          content: 'DM에서 주문자, 연락처, 상품명, 옵션(1/2), 수량, 주소, 우편번호를 추출해서 JSON.stringify 가능한 JSON 형식으로만 출력해줘. 예시 외 텍스트는 절대 포함하지 마.',
        },
        {
          role: 'user',
          content: text,
        },
      ],
    });

    const parsedText = gptRes.choices[0].message.content;

    let parsed;
    try {
      parsed = JSON.parse(parsedText);
    } catch (e) {
      return res.status(400).json({ error: 'GPT 응답을 JSON으로 파싱할 수 없습니다.', detail: parsedText });
    }

    res.json(parsed);
  } catch (error) {
    res.status(500).json({ error: 'GPT 처리 중 서버 오류', detail: error.message });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
