import { Application, Router } from "https://deno.land/x/oak/mod.ts";

const router = new Router();

router.post("/generate", async (ctx) => {
  const body = await ctx.request.body().value;
  const { name1, name2, style, score, verdict } = body;
  const prompt = `你是一位国学命理大师，请为下面这对有缘人撰写一段合婚批语。男方：${name1}，女方：${name2}。匹配分数：${score}%，综合评定：${verdict}。请用「${style}」的风格来写，100字左右，要有诗意，不要出现AI提示。`;
  const resp = await fetch("https://api.siliconflow.cn/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": "Bearer " },
    body: JSON.stringify({ model: "deepseek-ai/DeepSeek-V4-Flash", messages: [{ role: "system", content: "你是一位精通国学命理的文案大师。" }, { role: "user", content: prompt }], max_tokens: 300, temperature: 0.8 })
  });
  const data = await resp.json();
  ctx.response.body = { content: data.choices?.[0]?.message?.content || "" };
});

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());
await app.listen({ port: 8000 });
