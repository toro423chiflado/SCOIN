// ============================================================
//  SCOIN — Base de datos de audios local
//
//  Coloca tus archivos .mp3 en:  assets/audios/
//  Los nombres DEBEN coincidir exactamente con los de abajo.
//
//  Archivos esperados:
//    assets/audios/AUD_MON_1SOL.mp3
//    assets/audios/AUD_MON_2SOLES.mp3
//    assets/audios/AUD_MON_5SOLES.mp3
//    assets/audios/AUD_MON_10CENTIMOS.mp3
//    assets/audios/AUD_MON_20CENTIMOS.mp3
//    assets/audios/AUD_MON_50CENTIMOS.mp3
//    assets/audios/AUD_MON_NFOUND.mp3
//
//  IMPORTANTE: En React Native los require() deben ser
//  estáticos (el bundler los resuelve en build time).
//  Por eso están hardcodeados aquí y no se pueden
//  generar dinámicamente.
// ============================================================

export const AUDIO_ASSETS = {
  AUD_MON_1SOL:        require('../../assets/audios/AUD_MON_1SOL.mp3'),
  AUD_MON_2SOLES:      require('../../assets/audios/AUD_MON_2SOLES.mp3'),
  AUD_MON_5SOLES:      require('../../assets/audios/AUD_MON_5SOLES.mp3'),
  AUD_MON_10CENTIMOS:  require('../../assets/audios/AUD_MON_10CENTIMOS.mp3'),
  AUD_MON_20CENTIMOS:  require('../../assets/audios/AUD_MON_20CENTIMOS.mp3'),
  AUD_MON_50CENTIMOS:  require('../../assets/audios/AUD_MON_50CENTIMOS.mp3'),
  AUD_MON_NFOUND:      require('../../assets/audios/AUD_MON_NFOUND.mp3'),
};

// Mapa de moneda → clave de audio
export const COIN_TO_AUDIO = {
  '1SOL':       'AUD_MON_1SOL',
  '2SOLES':     'AUD_MON_2SOLES',
  '5SOLES':     'AUD_MON_5SOLES',
  '10CENTIMOS': 'AUD_MON_10CENTIMOS',
  '20CENTIMOS': 'AUD_MON_20CENTIMOS',
  '50CENTIMOS': 'AUD_MON_50CENTIMOS',
  'NFOUND':     'AUD_MON_NFOUND',
};

// Datos de cada moneda (para mostrar en pantalla)
export const COIN_DATA = {
  '1SOL': {
    id: '1SOL',
    nombre: '1 Sol',
    valor: 1.00,
    material: 'Bimetálica (latón y acero inoxidable)',
    diametro: '23 mm',
    peso: '5.45 g',
    descripcion: 'Moneda de 1 Sol peruano. En el anverso figura el Escudo Nacional del Perú. Moneda bimetálica en circulación desde 1991.',
    audioKey: 'AUD_MON_1SOL',
  },
  '2SOLES': {
    id: '2SOLES',
    nombre: '2 Soles',
    valor: 2.00,
    material: 'Bimetálica (latón y acero inoxidable)',
    diametro: '25.5 mm',
    peso: '7.32 g',
    descripcion: 'Moneda de 2 Soles peruanos. Aleación bimetálica con el Escudo Nacional en el anverso y la denominación en el reverso.',
    audioKey: 'AUD_MON_2SOLES',
  },
  '5SOLES': {
    id: '5SOLES',
    nombre: '5 Soles',
    valor: 5.00,
    material: 'Bimetálica (latón y acero inoxidable)',
    diametro: '27 mm',
    peso: '9.0 g',
    descripcion: 'Moneda de 5 Soles peruanos. La de mayor valor en circulación. Diseño bimetálico con el Escudo Nacional.',
    audioKey: 'AUD_MON_5SOLES',
  },
  '10CENTIMOS': {
    id: '10CENTIMOS',
    nombre: '10 Céntimos',
    valor: 0.10,
    material: 'Acero inoxidable con baño de latón',
    diametro: '17.5 mm',
    peso: '1.7 g',
    descripcion: 'Moneda de 10 céntimos del Sol peruano. Pequeña y ligera, de acero inoxidable con baño de latón.',
    audioKey: 'AUD_MON_10CENTIMOS',
  },
  '20CENTIMOS': {
    id: '20CENTIMOS',
    nombre: '20 Céntimos',
    valor: 0.20,
    material: 'Acero inoxidable con baño de latón',
    diametro: '19 mm',
    peso: '2.3 g',
    descripcion: 'Moneda de 20 céntimos del Sol peruano. Acabado latón sobre acero, mayor que los 10 céntimos.',
    audioKey: 'AUD_MON_20CENTIMOS',
  },
  '50CENTIMOS': {
    id: '50CENTIMOS',
    nombre: '50 Céntimos',
    valor: 0.50,
    material: 'Acero inoxidable con baño de latón',
    diametro: '22 mm',
    peso: '4.0 g',
    descripcion: 'Moneda de 50 céntimos del Sol peruano. La de mayor tamaño entre los céntimos, con acabado latón.',
    audioKey: 'AUD_MON_50CENTIMOS',
  },
  'NFOUND': {
    id: 'NFOUND',
    nombre: 'No identificada',
    valor: 0,
    material: '—',
    diametro: '—',
    peso: '—',
    descripcion: 'No se pudo identificar esta imagen como una moneda peruana válida. Intenta con mejor iluminación o una imagen más nítida.',
    audioKey: 'AUD_MON_NFOUND',
  },
};
