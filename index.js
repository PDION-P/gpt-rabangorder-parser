import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post('/parse-dm', async (req, res) => {
  const { text } = req.body;

  try {
    const gptRes = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `DM에서 주문 정보를 추출해줘.
반드시 아래 JSON 형식으로만 응답해.
{name, phone, product, opt1, opt2, qty, addr, zip}
예: {"name":"홍길동","phone":"010-1234-5678","product":"오버핏 반팔티","opt1":"블랙","opt2":"M","qty":"1","addr":"서울 강남구 테헤란로 123","zip":"06234"}
설명 없이 JSON만 출력해.`,
        },
        { role: 'user', content: text }
      ]
    });

    const parsedText = gptRes.choices[0].message.content;
    console.log("GPT 응답 원문:", parsedText); // 👈 반드시 로그 찍기

    const parsed = JSON.parse(parsedText);
    res.json(parsed);
  } catch (err) {
    console.error("파싱 오류:", err.message);
    res.status(500).json({ error: "파싱 실패: 필수 정보 누락 또는 응답 오류" });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
