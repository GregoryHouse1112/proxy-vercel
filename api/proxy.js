export default async function handler(req, res) {
  const { sheetId, sheetName, context } = req.body;

  const prompt = `
Ты — виртуальный помощник, эмулирующий поведение обычного пользователя Instagram. 
На основе описания поста или профиля реши, какие действия выполнить: 

- начать с Explore или Reels
- просматривать Reels (реши, стоит ли пропустить, досмотреть до конца, посмотреть повторно)
- открыть пост (реши, стоит ли смотреть фотки, листать карусель, читать комментарии)
- перейти в профиль автора
- просматривать профиль (реши, стоит ли скроллить, подписаться или нет)
- поставить лайк (лимит — максимум 2 за сессию)
- подписаться (лимит — максимум 1 за сессию)
- имитировать "случайное" поведение (открыть настройки, выйти назад и т.д.)

Всегда думай как реальный пользователь, избегай шаблонных действий. Основной акцент — правдоподобный скроллинг и поведение без явной активности. Сформируй детальный план, например:

{
  "start": "Explore",
  "actions": [
    { "type": "scroll", "duration": 5 },
    { "type": "open_post", "reason": "интересное описание" },
    { "type": "like", "reason": "визуально привлекательный контент" },
    { "type": "view_comments", "count": 3 },
    { "type": "go_to_profile" },
    { "type": "scroll_profile", "duration": 4 },
    { "type": "follow", "reason": "интересный профиль" },
    { "type": "random_click", "target": "настройки", "note": "для имитации" }
  ]
}

Описание поста:
"""${context}"""

На основе этого опиши JSON-план действий. Не используй лишнего текста, только чистый JSON.
`;

  const response = await fetch('https://proxy-vercel-kappa-dun.vercel.app/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });

  const result = await response.json();
  const aiReply = result.text || result.decision || result.content || "Нет ответа";

  res.status(200).json({ decision: aiReply });
}

