const gptRes = await openai.chat.completions.create({
  model: 'gpt-4',
  messages: [
    {
      role: 'system',
      content: 'DM에서 주문자, 연락처, 상품명, 옵션1, 옵션2, 수량, 주소, 우편번호를 JSON 포맷으로만 출력해줘. 설명하지 마. 반드시 JSON.stringify 가능한 객체 형식이어야 함.',
    },
    { role: 'user', content: text }
  ]
});

const parsedText = gptRes.choices[0].message.content;
console.log("GPT 응답 원문:", parsedText); // ✅ 이거 꼭 필요함
