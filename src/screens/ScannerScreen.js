import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Animated,
  StatusBar, Dimensions, ActivityIndicator, Platform,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { COLORS } from '../constants/colors';

const { width, height } = Dimensions.get('window');
const FRAME_SIZE = width * 0.75;

const FrameCorner = ({ top, left, bottom, right, color }) => (
  <View style={[
    styles.corner,
    top    !== undefined && { top },
    left   !== undefined && { left },
    bottom !== undefined && { bottom },
    right  !== undefined && { right },
    top !== undefined && left  !== undefined && { borderTopWidth: 3, borderLeftWidth: 3 },
    top !== undefined && right !== undefined && { borderTopWidth: 3, borderRightWidth: 3 },
    bottom !== undefined && left  !== undefined && { borderBottomWidth: 3, borderLeftWidth: 3 },
    bottom !== undefined && right !== undefined && { borderBottomWidth: 3, borderRightWidth: 3 },
    { borderColor: color || COLORS.gold },
  ]} />
);

export default function ScannerScreen({ navigation, route }) {
  const nombre = route?.params?.nombre || 'Macos';
  const [permission, requestPermission] = useCameraPermissions();
  const [phase, setPhase] = useState('idle'); // idle | capturing | processing | done
  const cameraRef = useRef(null);

  // Animaciones
  const scanLineAnim  = useRef(new Animated.Value(0)).current;
  const pulseAnim     = useRef(new Animated.Value(1)).current;
  const fadeAnim      = useRef(new Animated.Value(0)).current;
  const frameColorAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
    startPulse();
    return () => { pulseAnim.stopAnimation(); scanLineAnim.stopAnimation(); };
  }, []);

  const startPulse = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.06, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1.0,  duration: 800, useNativeDriver: true }),
      ])
    ).start();
  };

  const startScanLine = () => {
    scanLineAnim.setValue(0);
    return Animated.loop(
      Animated.sequence([
        Animated.timing(scanLineAnim, { toValue: 1, duration: 1400, useNativeDriver: true }),
        Animated.timing(scanLineAnim, { toValue: 0, duration: 1400, useNativeDriver: true }),
      ])
    );
  };

  // Permisos
  if (!permission) {
    return (
      <View style={styles.permContainer}>
        <ActivityIndicator color={COLORS.gold} size="large" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.permContainer}>
        <Text style={styles.permEmoji}>📷</Text>
        <Text style={styles.permTitle}>Necesitamos tu cámara</Text>
        <Text style={styles.permDesc}>
          SCOIN usa la cámara para identificar monedas peruanas. No se guarda ninguna imagen.
        </Text>
        <TouchableOpacity style={styles.permBtn} onPress={requestPermission}>
          <Text style={styles.permBtnText}>Permitir cámara</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.permBackBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.permBackText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Captura de la moneda
  const handleCapture = async () => {
    if (phase !== 'idle' || !cameraRef.current) return;

    setPhase('capturing');
    const scanLoop = startScanLine();
    scanLoop.start();

    try {
      // Toma foto
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.85,
        skipProcessing: false,
      });

      scanLoop.stop();
      setPhase('done');

      // Navegar en el OCR
      navigation.navigate('Result', {
        nombre,
        imagenUri: photo.uri,
      });

    } catch (err) {
      console.error('[SCOIN] Error captura:', err);
      scanLoop.stop();
      setPhase('idle');
    }
  };

  const scanLineY = scanLineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, FRAME_SIZE - 2],
  });

  const isProcessing = phase === 'capturing' || phase === 'processing';
  const cornerColor = isProcessing ? COLORS.primary : COLORS.gold;

  const statusText = {
    idle:       'Ubica la moneda en el recuadro',
    capturing:  'Capturando imagen...',
    processing: 'Analizando con IA...',
    done:       '¡Moneda encontrada!',
  }[phase];

  const statusColor = {
    idle:       COLORS.gold,
    capturing:  COLORS.primary,
    processing: COLORS.goldLight,
    done:       COLORS.success,
  }[phase];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* ── CÁMARA ─────────────────────────────────────────── */}
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        facing="back"
      />

      {/* ── OVERLAYS OSCUROS (bordes fuera del frame) ────── */}
      <View style={styles.overlayTop} />
      <View style={styles.overlayBottom} />
      <View style={[styles.overlaySide, { left: 0  }]} />
      <View style={[styles.overlaySide, { right: 0 }]} />

      {/* ── FRAME DE ESCANEO ─────────────────────────────── */}
      <View style={styles.frameWrapper}>
        <View style={[styles.frame, isProcessing && styles.frameActive]}>
          <FrameCorner top={0}    left={0}  color={cornerColor} />
          <FrameCorner top={0}    right={0} color={cornerColor} />
          <FrameCorner bottom={0} left={0}  color={cornerColor} />
          <FrameCorner bottom={0} right={0} color={cornerColor} />

          {/* Línea de escaneo */}
          {isProcessing && (
            <Animated.View style={[
              styles.scanLine,
              { transform: [{ translateY: scanLineY }] }
            ]} />
          )}

          {/* Overlay de procesamiento */}
          {phase === 'processing' && (
            <View style={styles.processingOverlay}>
              <View style={styles.processingBox}>
                <ActivityIndicator color={COLORS.gold} size="large" />
                <Text style={styles.processingText}>Gemini IA analizando...</Text>
                <Text style={styles.processingSubText}>puede tomar unos segundos</Text>
              </View>
            </View>
          )}
        </View>

        {/* Guía de posición */}
        <Text style={styles.frameGuide}>
          {phase === 'idle' ? 'Centra la moneda aquí' : statusText}
        </Text>

        {/* Tips de foto — solo en idle */}
        {phase === 'idle' && (
          <View style={styles.tipsRow}>
            <Text style={styles.tipItem}>☀️ Buena luz</Text>
            <Text style={styles.tipItem}>🔲 Fondo oscuro</Text>
            <Text style={styles.tipItem}>🔍 Texto visible</Text>
          </View>
        )}
      </View>

      {/* ── HEADER ──────────────────────────────────────── */}
      <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <View style={styles.backArrow} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>SCOIN</Text>
        <View style={{ width: 36 }} />
      </Animated.View>

      {/* ── CONTROLES INFERIORES ────────────────────────── */}
      <Animated.View style={[styles.controls, { opacity: fadeAnim }]}>

        {/* Estado */}
        <View style={styles.statusRow}>
          <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
          <Text style={[styles.statusText, { color: statusColor }]}>{statusText}</Text>
        </View>

        {/* Fila de botones */}
        <View style={styles.captureRow}>
          {/* Galería (placeholder) */}
          <TouchableOpacity style={styles.sideBtn} disabled={isProcessing}>
            <View style={styles.galleryIcon}>
              <View style={styles.galleryInner} />
            </View>
          </TouchableOpacity>

          {/* Botón principal */}
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <TouchableOpacity
              style={[styles.captureBtn, isProcessing && styles.captureBtnBusy]}
              onPress={handleCapture}
              disabled={isProcessing}
              activeOpacity={0.85}
            >
              <View style={styles.captureBtnRing}>
                {isProcessing
                  ? <ActivityIndicator color="white" size="small" />
                  : <View style={styles.captureBtnCore} />
                }
              </View>
            </TouchableOpacity>
          </Animated.View>

          {/* Flash (UI placeholder) */}
          <TouchableOpacity style={styles.sideBtn} disabled={isProcessing}>
            <Text style={styles.flashText}>⚡</Text>
          </TouchableOpacity>
        </View>

        {/* Chips de monedas reconocibles */}
        <View style={styles.chipsRow}>
          <Text style={styles.chipsLabel}>Detecto:</Text>
          {['10c','20c','50c','S/1','S/2','S/5'].map((v, i) => (
            <View key={i} style={[
              styles.chip,
              { borderColor: v.startsWith('S/') ? COLORS.gold : 'rgba(255,255,255,0.35)' }
            ]}>
              <Text style={[
                styles.chipText,
                { color: v.startsWith('S/') ? COLORS.gold : 'rgba(255,255,255,0.7)' }
              ]}>{v}</Text>
            </View>
          ))}
        </View>

      </Animated.View>
    </View>
  );
}

const OVERLAY_SIDE_H = FRAME_SIZE + 20;
const OVERLAY_TOP_H  = (height - FRAME_SIZE) / 2 - 10;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  permContainer: {
    flex: 1, backgroundColor: COLORS.background,
    justifyContent: 'center', alignItems: 'center', padding: 32,
  },
  permEmoji: { fontSize: 52, marginBottom: 16 },
  permTitle: { fontSize: 22, fontWeight: '800', color: COLORS.textDark, marginBottom: 10, textAlign: 'center' },
  permDesc: { fontSize: 14, color: COLORS.textLight, textAlign: 'center', lineHeight: 22, marginBottom: 28 },
  permBtn: {
    backgroundColor: COLORS.primary, borderRadius: 14,
    paddingVertical: 16, paddingHorizontal: 32,
    marginBottom: 14,
    shadowColor: COLORS.primaryDark, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 10, elevation: 6,
  },
  permBtnText: { color: 'white', fontSize: 15, fontWeight: '700' },
  permBackBtn: { paddingVertical: 10 },
  permBackText: { fontSize: 14, color: COLORS.textLight },
  overlayTop: {
    position: 'absolute', top: 0, left: 0, right: 0,
    height: OVERLAY_TOP_H,
    backgroundColor: 'rgba(0,0,0,0.68)',
  },
  overlayBottom: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    height: OVERLAY_TOP_H + 10,
    backgroundColor: 'rgba(0,0,0,0.68)',
  },
  overlaySide: {
    position: 'absolute',
    top: OVERLAY_TOP_H,
    width: (width - FRAME_SIZE) / 2,
    height: OVERLAY_SIDE_H,
    backgroundColor: 'rgba(0,0,0,0.68)',
  },

  frameWrapper: {
    position: 'absolute',
    top: OVERLAY_TOP_H,
    left: (width - FRAME_SIZE) / 2,
    width: FRAME_SIZE,
    height: FRAME_SIZE,
    alignItems: 'center',
  },
  frame: {
    width: FRAME_SIZE,
    height: FRAME_SIZE,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  frameActive: {},
  corner: {
    position: 'absolute',
    width: 28, height: 28, borderRadius: 2,
  },
  scanLine: {
    position: 'absolute', left: 0, right: 0, height: 2,
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1, shadowRadius: 8,
  },
  processingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center', alignItems: 'center',
  },
  processingBox: {
    backgroundColor: 'rgba(20,10,5,0.85)',
    borderRadius: 16, padding: 20,
    alignItems: 'center', gap: 10,
    borderWidth: 1, borderColor: COLORS.gold + '55',
  },
  processingText: { color: COLORS.gold, fontSize: 13, fontWeight: '600' },
  processingSubText: { color: 'rgba(200,146,42,0.7)', fontSize: 11, marginTop: 2 },
  frameGuide: {
    marginTop: 12, fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '600', letterSpacing: 0.3,
  },

  // Header
  header: {
    position: 'absolute', top: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 52 : 36,
    paddingHorizontal: 20, paddingBottom: 12,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center', alignItems: 'center',
  },
  backArrow: {
    width: 10, height: 10,
    borderLeftWidth: 2.5, borderBottomWidth: 2.5,
    borderColor: 'white',
    transform: [{ rotate: '45deg' }, { translateX: 2 }],
  },
  headerTitle: {
    fontSize: 14, fontWeight: '900',
    color: 'white', letterSpacing: 5,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3,
  },

  // Controles
  controls: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(10,5,0,0.88)',
    paddingTop: 16, paddingBottom: Platform.OS === 'ios' ? 40 : 28,
    paddingHorizontal: 24,
  },
  statusRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 8, marginBottom: 18,
  },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { fontSize: 13, fontWeight: '600' },
  captureRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: 18,
  },
  sideBtn: {
    width: 50, height: 50, borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center', alignItems: 'center',
  },
  galleryIcon: {
    width: 22, height: 22, borderRadius: 4,
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center', alignItems: 'center',
  },
  galleryInner: {
    width: 12, height: 12, borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  flashText: { fontSize: 18 },
  captureBtn: {
    width: 76, height: 76, borderRadius: 38,
    backgroundColor: COLORS.primary,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 4, borderColor: 'rgba(255,255,255,0.2)',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.55, shadowRadius: 14, elevation: 8,
  },
  captureBtnBusy: { backgroundColor: COLORS.gold },
  captureBtnRing: {
    width: 54, height: 54, borderRadius: 27,
    backgroundColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center', alignItems: 'center',
  },
  captureBtnCore: {
    width: 30, height: 30, borderRadius: 15, backgroundColor: 'white',
  },
  chipsRow: {
    flexDirection: 'row', flexWrap: 'wrap',
    gap: 6, justifyContent: 'center', alignItems: 'center',
  },
  chipsLabel: { fontSize: 11, color: 'rgba(255,255,255,0.4)', marginRight: 2 },
  chip: {
    borderWidth: 1, borderRadius: 10,
    paddingHorizontal: 9, paddingVertical: 3,
  },
  chipText: { fontSize: 10, fontWeight: '600' },
  tipsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginTop: 8,
  },
  tipItem: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.65)',
    backgroundColor: 'rgba(0,0,0,0.35)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
});