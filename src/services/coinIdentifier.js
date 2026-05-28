// ============================================================
// ESCANER DE SCOIN
// ============================================================
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { COIN_DATA } from '../constants/audioDatabase';

const GROQ_API_KEY = '';
const GROQ_URL     = 'https://api.groq.com/openai/v1/chat/completions';

const VALID_IDS = ['1SOL','2SOLES','5SOLES','10CENTIMOS','20CENTIMOS','50CENTIMOS'];


// EL MEJOR PROMPT DE LA HISTORIA CRJO
const PROMPT = `Eres un experto identificando monedas peruanas. Analiza la imagen con mucho cuidado.

REGLA PRINCIPAL: Lee el número o texto grabado en la moneda. Ese número es la denominación exacta.

Guía visual detallada:
- 1SOL: bimetálica, lleva grabado "1" y la palabra "SOL" o "UN SOL". Centro DORADO, aro exterior PLATEADO. Es la ÚNICA con este patrón de colores invertido.
- 2SOLES: bimetálica, lleva grabado "2" y "SOLES" o "DOS SOLES". Centro PLATEADO, aro exterior DORADO. Tamaño mediano entre las bimetálicas.
- 5SOLES: bimetálica, lleva grabado "5" y "SOLES" o "CINCO SOLES". Centro PLATEADO, aro exterior DORADO. La MÁS GRANDE de todas las monedas peruanas.
- 10CENTIMOS: toda DORADA uniforme, lleva grabado "10" y "CÉNTIMOS". La más pequeña de todas.
- 20CENTIMOS: toda DORADA uniforme, lleva grabado "20" y "CÉNTIMOS". Tamaño mediano entre céntimos.
- 50CENTIMOS: toda DORADA uniforme, lleva grabado "50" y "CÉNTIMOS". La más grande entre los céntimos.
- NFOUND: imagen borrosa, no es moneda peruana, o no se puede leer el número con certeza.

IMPORTANTE: Si ves el número "2" grabado → es 2SOLES. Si ves "5" grabado → es 5SOLES. Si ves "1" → es 1SOL. El número grabado tiene prioridad sobre cualquier otra característica visual.

Responde SOLO el código exacto, una palabra:
1SOL | 2SOLES | 5SOLES | 10CENTIMOS | 20CENTIMOS | 50CENTIMOS | NFOUND`;

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