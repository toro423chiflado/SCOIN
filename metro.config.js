const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Soporte para archivos de audio locales
config.resolver.assetExts.push('mp3', 'wav', 'm4a');

module.exports = config;
