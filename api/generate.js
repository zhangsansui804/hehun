export default async function handler(req, res) {
  // 允许跨域
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(404).json({ error: 'Not found' });
  }

  try {
    const { name1, name2, style, score, verdict } = req.body;
    const prompt = `你是一位国学命理大师，请为下面这对有缘人撰写一段合婚批语。男方：${name1}，女方：${name2}。匹配分数：${score}%，综合评定：${verdict}。请用「${style}」的风格来写，100字左右，要有诗意，不要出现AI提示。`;

    const resp = await fetch('https://api.siliconflow.cn/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer sk-yqbatjioswrdpvjicksivywaqvgyljhvbnhqlafefhjyxxic'
      },
      body: JSON.stringify({
        model: 'deepseek-ai/DeepSeek-V4-Flash',
        messages: [
          { role: 'system', content: '你是一位精通国学命理的文案大师。' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 300,
        temperature: 0.8
      })
    });

    const data = await resp.json();
    const text = data.choices?.[0]?.message?.content || '';
    return res.status(200).json({ content: text });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
