# SCOIN 🪙 — Lector de monedas peruanas

## 📁 Estructura

```
scoin/
├── assets/
│   └── audios/          ← .mp3 de audios identificando las monedas
├── src/
│   ├── constants/
│   │   ├── colors.js
│   │   ├── endpoints.js
│   │   └── audioDatabase.js  ← Mapa coinId → audio asset
│   ├── services/
│   │   ├── coinIdentifier.js ← Lógica de identificación (Ingresar la API KEY DE GROQ)
│   │   └── audioService.js   ← Reproducción con expo-av
│   ├── components/
│   │   ├── IncaPattern.js
│   │   └── CoinCard.js
│   ├── screens/
│   │   ├── SplashScreen.js
│   │   ├── WelcomeScreen.js
│   │   ├── AuthScreens.js
│   │   ├── HomeScreen.js
│   │   ├── ScannerScreen.js 
│   │   └── ResultScreen.js  
│   └── navigation/
│       └── AppNavigator.js
└── App.js
```
