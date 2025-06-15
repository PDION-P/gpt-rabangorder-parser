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
          content: `
고객의 DM 메시지를 분석하여 여러 개의 상품이 포함된 경우 각각을 JSON 배열로 나눠서 응답해주세요.

다음 형식으로 응답하세요. 설명 없이 JSON만 출력하고, 키 순서는 신경 쓰지 않아도 됩니다.
형식:
[
  {
    "name": "이름",
    "phone": "010-1234-5678",
    "product": "상품명",
    "opt1": "옵션1",
    "opt2": "옵션2",
    "qty": 1,
    "addr": "주소",
    "zip": "우편번호"
  },
  ...
]

주의:
- 한 명의 고객이 한 줄에 여러 상품을 주문할 수 있습니다.
- 전화번호, 주소, 이름은 공통입니다.
- 수량이 명시되지 않으면 기본 1개로 처리하세요.
- 옵션이 없으면 opt1/opt2는 생략해도 됩니다.
- 설명, 안내문 없이 반드시 JSON 배열만 출력하세요.
          `.trim()
        },
        { role: 'user', content: text }
      ]
    });

    const parsedText = gptRes.choices[0].message.content;
    console.log("🔍 GPT 응답 원문:", parsedText);

    const parsed = JSON.parse(parsedText);
    res.json(parsed);
  } catch (err) {
    console.error("❌ 파싱 오류:", err.message);
    res.status(500).json({ error: "파싱 실패: JSON 구문 오류 또는 응답 형식 문제" });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
