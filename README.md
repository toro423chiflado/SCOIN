# SCOIN 🪙 — Lector de monedas peruanas

## 🚀 Instalación

```bash
cd scoin
npm install
npx expo start
```

---

## 🔊 Cómo agregar tus audios

Los archivos MP3 placeholder ya están en `assets/audios/`.
**Reemplaza cada uno con tu archivo real** manteniendo el mismo nombre:

| Archivo | Descripción sugerida del audio |
|---|---|
| `AUD_MON_1SOL.mp3` | "Un sol peruano" |
| `AUD_MON_2SOLES.mp3` | "Dos soles peruanos" |
| `AUD_MON_5SOLES.mp3` | "Cinco soles peruanos" |
| `AUD_MON_10CENTIMOS.mp3` | "Diez céntimos" |
| `AUD_MON_20CENTIMOS.mp3` | "Veinte céntimos" |
| `AUD_MON_50CENTIMOS.mp3` | "Cincuenta céntimos" |
| `AUD_MON_NFOUND.mp3` | "No se pudo identificar la moneda" |

Solo copia tus `.mp3` encima de los placeholders y listo — no hace falta cambiar código.

---

## 🔌 Conectar tu backend de IA

En `src/services/coinIdentifier.js`, línea 28:

```js
const USE_REAL_API = false;  // ← Cambiar a true
```

Tu backend debe exponer:
```
POST /monedas/identificar
Body: { "imagen": "<base64>", "tipo": "moneda" }

Response:
{
  "coinId": "1SOL" | "2SOLES" | "5SOLES" | "10CENTIMOS" | "20CENTIMOS" | "50CENTIMOS" | "NFOUND",
  "confianza": 94
}
```

---

## 📁 Estructura

```
scoin/
├── assets/
│   └── audios/          ← Tus 7 archivos .mp3 van aquí
├── src/
│   ├── constants/
│   │   ├── colors.js
│   │   ├── endpoints.js
│   │   └── audioDatabase.js  ← Mapa coinId → audio asset
│   ├── services/
│   │   ├── coinIdentifier.js ← Lógica de identificación (mock/API)
│   │   └── audioService.js   ← Reproducción con expo-av
│   ├── components/
│   │   ├── IncaPattern.js
│   │   └── CoinCard.js
│   ├── screens/
│   │   ├── SplashScreen.js
│   │   ├── WelcomeScreen.js
│   │   ├── AuthScreens.js
│   │   ├── HomeScreen.js
│   │   ├── ScannerScreen.js  ← expo-camera real
│   │   └── ResultScreen.js   ← expo-av audio real
│   └── navigation/
│       └── AppNavigator.js
└── App.js
```
