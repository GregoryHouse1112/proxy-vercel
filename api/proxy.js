export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { sheetId, sheetName, context } = req.body;

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyCuDkk2vOLSK4La6VSW03f2mizGD8xx6uU`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Контекст поста: ${context}\n\nЧто нужно сделать: лайк / подписка / игнор?`,
                },
              ],
            },
          ],
        }),
      }
    );

    const geminiData = await geminiRes.json();
    const text = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';

    return res.status(200).json({
      decision: text.trim(),
      from: 'proxy + gemini',
    });
  } catch (err) {
    return res.status(500).json({ error: 'Proxy error', detail: err.message });
  }
}

