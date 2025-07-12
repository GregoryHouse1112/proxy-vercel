export default async function handler(req, res) {
  try {
    const { sheetId, sheetName, context } = req.body;
    if (!sheetId || !sheetName || !context) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const prompt = `
      Ты виртуальный помощник, имитирующий поведение пользователя Instagram.
      На основе описания поста, какие действия выполнять:
      - начать с Explore или Reels
      - прокручивать Reels (смотреть, потом пропускать, смотреть повторно)
      - ставить лайк (лимит 1 лайк за сессию)
      - подписываться на автора (лимит 1 подписка)
      - смотреть карусели
      - смотреть комментарии
      - случайные ошибки (нажатие кнопки "Настройки", уход назад, и т.д.)

      Описание поста:
      ***${context}***
    `;
    const response = await fetch('https://gemini-api-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: prompt })
    });

    // Логируем ответ
    const responseBody = await response.text(); // Получаем текстовый ответ
    console.log('Ответ от API:', responseBody);

    // Проверяем, что это JSON
    let aiData;
    try {
      aiData = JSON.parse(responseBody);  // Пробуем распарсить
    } catch (error) {
      console.error('Ошибка при парсинге JSON:', error);
      return res.status(500).json({ error: 'Ошибка при обработке данных от API' });
    }

    res.status(200).json({ decision: aiData.decision || "Нет решения" });
  } catch (error) {
    console.error('Ошибка на сервере:', error);
    res.status(500).json({ error: 'Произошла ошибка на сервере' });
  }
}

