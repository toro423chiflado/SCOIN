// ============================================================
// ESCANER DE SCOIN
// ============================================================
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { COIN_DATA } from '../constants/audioDatabase';

const GROQ_API_KEY = 'APIKEYDEGROQ';
const GROQ_URL     = 'https://api.groq.com/openai/v1/chat/completions';

const VALID_IDS = ['1SOL','2SOLES','5SOLES','10CENTIMOS','20CENTIMOS','50CENTIMOS'];

const SYSTEM = 'Eres un clasificador de monedas peruanas. Respondes ÚNICAMENTE con una de estas palabras exactas: 1SOL, 2SOLES, 5SOLES, 10CENTIMOS, 20CENTIMOS, 50CENTIMOS, NFOUND. Cero explicaciones. Cero puntos. Solo la palabra.';

const PROMPT = `Analiza la moneda peruana en la imagen siguiendo este proceso en orden:

PASO 1 — LEE EL NÚMERO GRABADO EN LA MONEDA:
¿Ves un "1"? → 1SOL
¿Ves un "2"? → 2SOLES
¿Ves un "5"? → 5SOLES
¿Ves "10"? → 10CENTIMOS
¿Ves "20"? → 20CENTIMOS
¿Ves "50"? → 50CENTIMOS
El número es suficiente. Si lo lees con claridad, responde de inmediato.

PASO 2 — Si el número no es legible, evalúa los colores:
¿Tiene DOS colores (bimetálica)?
  → Centro DORADO + aro PLATEADO = 1SOL (única con este patrón)
  → Centro PLATEADO + aro DORADO = puede ser 2SOLES o 5SOLES
    → Si es la moneda más grande de las dos = 5SOLES
    → Si es más pequeña = 2SOLES
¿Tiene UN solo color dorado uniforme?
  → La más pequeña de todas = 10CENTIMOS
  → Mediana = 20CENTIMOS
  → La más grande entre las doradas = 50CENTIMOS

PASO 3 — Si la imagen es borrosa o no es moneda peruana → NFOUND

Responde con una sola palabra:`;

export const identifyCoin = async (imageUri) => {
  try {
    const img = await manipulateAsync(
      imageUri,
      [{ resize: { width: 512 } }],
      { compress: 0.85, format: SaveFormat.JPEG, base64: true }
    );

    console.log('[SCOIN] Enviando a Groq LLaMA Vision...');

    const response = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-4-scout-17b-16e-instruct',
        max_tokens: 20,
        temperature: 0,
        messages: [
          {
            role: 'system',
            content: SYSTEM,
          },
          {
            role: 'user',
            content: [
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${img.base64}`,
                },
              },
              {
                type: 'text',
                text: PROMPT,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      console.error('[SCOIN] Groq error:', err);
      throw new Error(`API ${response.status}`);
    }

    const data   = await response.json();
    const raw    = data.choices?.[0]?.message?.content?.trim().toUpperCase() ?? '';
    const coinId = raw.replace(/[^A-Z0-9]/g, '');

    console.log(`[SCOIN] Groq respondió: "${raw}" → coinId: "${coinId}"`);

    if (VALID_IDS.includes(coinId)) {
      return { coinData: COIN_DATA[coinId], confianza: 90 };
    }

    return { coinData: COIN_DATA['NFOUND'], confianza: 0 };

  } catch (err) {
    console.error('[SCOIN] Error en identificación:', err.message);
    return { coinData: COIN_DATA['NFOUND'], confianza: 0 };
  }
};