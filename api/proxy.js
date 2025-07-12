// Важно: Убедитесь, что установлены правильные переменные окружения

const fetch = require('node-fetch'); // если используешь fetch
const { google } = require('googleapis'); // если используешь google API для Sheets

export default async function handler(req, res) {
  const { sheetId, sheetName, context } = req.body; // получаем данные из запроса

  // Формируем запрос для Gemini API (проверь URL)
  const geminiApiUrl = 'https://your-gemini-api-url.com/endpoint'; // Замените на реальный URL

  const prompt = `
  На основе этого поста мы пишем рекомендации:
  Внимание: сгенерированное действие будет случайным, с упором на скроллинг, изучение постов/профилей, подписки и лайки.
  
  Описание поста:
  "${context}"
  
  Формат ответа:
  {
    "start": "Explore", // или "Reels"
    "scroll": "duration: 5",  // время скроллинга
    "open_post": "reason: 'интересное описание'",
    "like": "reason: 'интересен контент'",
    "follow": "reason: 'интересные профили'"
  }
  `;
  
  // Делаем запрос к Gemini API
  const response = await fetch(geminiApiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt }), // отправляем запрос в API
  });

  const result = await response.json();
  const aiReply = result.text || result.decision || "Нет ответа"; // Получаем ответ от AI
  
  // Записываем в Google Sheets (если необходимо)
  // Здесь можно добавить код для работы с Google Sheets API, если требуется

  // Возвращаем ответ клиенту
  res.status(200).json({ decision: aiReply });
}

