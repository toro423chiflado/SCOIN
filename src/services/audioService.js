import { Audio } from 'expo-av';
import { AUDIO_ASSETS, COIN_TO_AUDIO } from '../constants/audioatabase';

let _sound = null;

export const getAudioKeyForCoin = (coinId) =>
  COIN_TO_AUDIO[coinId] || 'AUD_MON_NFOUND';

export const getAudioAsset = (coinId) =>
  AUDIO_ASSETS[getAudioKeyForCoin(coinId)];

/**
 * Reproduce el audio de una moneda.
 * @param {string} coinId - ID de moneda 
 * @param {Function} onFinish - Callback cuando termina la reproducción
 */
export const playAudio = async (coinId, onFinish) => {
  try {
    await stopAudio();
    await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });

    const asset = getAudioAsset(coinId);
    if (!asset) {
      console.warn(`[SCOIN] No hay audio para coinId: "${coinId}"`);
      onFinish?.();
      return;
    }

    const { sound } = await Audio.Sound.createAsync(asset);
    _sound = sound;

    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.didJustFinish) {
        stopAudio();
        onFinish?.();
      }
    });

    await sound.playAsync();
    console.log(`[SCOIN] Reproduciendo audio: ${getAudioKeyForCoin(coinId)}`);

  } catch (err) {
    console.error('[SCOIN] Error reproduciendo audio:', err.message);
    onFinish?.();
  }
};

export const stopAudio = async () => {
  if (_sound) {
    try {
      await _sound.stopAsync();
      await _sound.unloadAsync();
    } catch (_) {}
    _sound = null;
  }
};