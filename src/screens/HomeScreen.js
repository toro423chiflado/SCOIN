import React, { useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Animated,
  StatusBar, SafeAreaView, ScrollView, Dimensions,
} from 'react-native';
import { COLORS } from '../constants/colors';
import { IncaBorder, ChakanaSmall } from '../components/IncaPattern';
import { CoinVisual } from '../components/CoinCard';

const { width } = Dimensions.get('window');

const MONEDAS_INFO = [
  { id: '1', nombre: '5 Céntimos', valor: 0.05, tipo: 'plata' },
  { id: '2', nombre: '10 Céntimos', valor: 0.10, tipo: 'plata' },
  { id: '3', nombre: '20 Céntimos', valor: 0.20, tipo: 'plata' },
  { id: '4', nombre: '50 Céntimos', valor: 0.50, tipo: 'plata' },
  { id: '5', nombre: '1 Sol', valor: 1.00, tipo: 'oro' },
  { id: '6', nombre: '2 Soles', valor: 2.00, tipo: 'oro' },
  { id: '7', nombre: '5 Soles', valor: 5.00, tipo: 'oro' },
];

const StatCard = ({ label, value, color }) => (
  <View style={[statStyles.card, { borderLeftColor: color }]}>
    <Text style={statStyles.value}>{value}</Text>
    <Text style={statStyles.label}>{label}</Text>
  </View>
);

const statStyles = StyleSheet.create({
  card: {
    flex: 1, backgroundColor: COLORS.surface,
    borderRadius: 14, padding: 14,
    borderLeftWidth: 4,
    shadowColor: COLORS.textDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
  },
  value: { fontSize: 22, fontWeight: '800', color: COLORS.textDark, marginBottom: 2 },
  label: { fontSize: 11, color: COLORS.textMuted, fontWeight: '500', letterSpacing: 0.3 },
});

export default function HomeScreen({ navigation, route }) {
  const nombre = route?.params?.nombre || 'Macos';
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slidesAnim = useRef(MONEDAS_INFO.map(() => new Animated.Value(30))).current;
  const slideOpacities = useRef(MONEDAS_INFO.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();

    MONEDAS_INFO.forEach((_, i) => {
      Animated.parallel([
        Animated.timing(slideOpacities[i], {
          toValue: 1, duration: 350,
          delay: 100 + i * 60,
          useNativeDriver: true,
        }),
        Animated.spring(slidesAnim[i], {
          toValue: 0, tension: 60, friction: 9,
          delay: 100 + i * 60,
          useNativeDriver: true,
        }),
      ]).start();
    });
  }, []);

  const getHoraDelDia = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Buenos días';
    if (h < 19) return 'Buenas tardes';
    return 'Buenas noches';
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* Header */}
      <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
        <View style={styles.headerDecCircle} />
        <ChakanaSmall color={COLORS.white} size={30} opacity={0.2} />
        <View style={styles.headerTop}>
          <View style={styles.logoMini}>
            <Text style={styles.logoMiniText}>S</Text>
          </View>
          <Text style={styles.headerAppName}>SCOIN</Text>
        </View>
        <Text style={styles.headerGreeting}>{getHoraDelDia()},</Text>
        <Text style={styles.headerName}>¡{nombre}! 👋</Text>
        <Text style={styles.headerSub}>¿Qué moneda escaneamos hoy?</Text>
      </Animated.View>

      <IncaBorder color={COLORS.gold} opacity={0.5} height={3} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats */}
        <View style={styles.statsRow}>
          <StatCard label="Escaneadas hoy" value="0" color={COLORS.primary} />
          <View style={{ width: 12 }} />
          <StatCard label="Total historial" value="0" color={COLORS.gold} />
        </View>

        {/* Botón principal de escaneo */}
        <TouchableOpacity
          style={styles.scanBtn}
          onPress={() => navigation.navigate('Scanner', { nombre })}
          activeOpacity={0.88}
        >
          {/* Icono de cámara dibujado con Views */}
          <View style={styles.scanBtnBg}>
            <View style={styles.scanBtnDecCircle} />
          </View>
          <View style={styles.cameraIcon}>
            <View style={styles.cameraBody}>
              <View style={styles.cameraLens}>
                <View style={styles.cameraLensInner} />
              </View>
              <View style={styles.cameraFlash} />
            </View>
          </View>
          <Text style={styles.scanBtnTitle}>Escanear moneda</Text>
          <Text style={styles.scanBtnSub}>Apunta la cámara a cualquier moneda peruana</Text>

          {/* Monedas mini animadas */}
          <View style={styles.scanBtnCoins}>
            {['5c', 'S/1', 'S/2'].map((v, i) => (
              <View key={i} style={[
                styles.scanBtnCoin,
                {
                  backgroundColor: v.includes('S/') ? COLORS.gold : '#C0C0C0',
                  opacity: 0.5 + i * 0.15,
                }
              ]}>
                <Text style={styles.scanBtnCoinText}>{v}</Text>
              </View>
            ))}
          </View>
        </TouchableOpacity>

        {/* Tip */}
        <View style={styles.tipCard}>
          <Text style={styles.tipIcon}>💡</Text>
          <Text style={styles.tipText}>
            <Text style={styles.tipBold}>Tip:</Text> Coloca la moneda sobre una superficie plana y bien iluminada para mejores resultados.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 52, paddingBottom: 24, paddingHorizontal: 24,
    overflow: 'hidden', position: 'relative',
  },
  headerDecCircle: {
    position: 'absolute', right: -50, top: -50,
    width: 200, height: 200, borderRadius: 100,
    backgroundColor: COLORS.primaryLight, opacity: 0.3,
  },
  headerTop: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  logoMini: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: COLORS.gold,
    justifyContent: 'center', alignItems: 'center',
  },
  logoMiniText: { fontSize: 14, fontWeight: '900', color: 'white' },
  headerAppName: {
    fontSize: 14, fontWeight: '900',
    color: 'rgba(255,255,255,0.9)', letterSpacing: 4,
  },
  headerGreeting: { fontSize: 14, color: 'rgba(255,255,255,0.75)', marginBottom: 2 },
  headerName: { fontSize: 26, fontWeight: '800', color: 'white', marginBottom: 4 },
  headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.7)' },
  scroll: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 40 },
  statsRow: { flexDirection: 'row', marginBottom: 20 },
  scanBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 20, padding: 24,
    marginBottom: 28, overflow: 'hidden',
    shadowColor: COLORS.primaryDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3, shadowRadius: 14, elevation: 8,
    position: 'relative',
  },
  scanBtnBg: {
    position: 'absolute', top: 0, right: 0, bottom: 0,
    width: '50%', overflow: 'hidden',
  },
  scanBtnDecCircle: {
    position: 'absolute', right: -60, top: -60,
    width: 200, height: 200, borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  cameraIcon: { marginBottom: 12 },
  cameraBody: {
    width: 52, height: 40, borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center', alignItems: 'center',
    position: 'relative',
  },
  cameraLens: {
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center', alignItems: 'center',
  },
  cameraLensInner: {
    width: 14, height: 14, borderRadius: 7,
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  cameraFlash: {
    position: 'absolute', top: 6, right: 8,
    width: 6, height: 6, borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  scanBtnTitle: {
    fontSize: 22, fontWeight: '800', color: 'white',
    marginBottom: 4,
  },
  scanBtnSub: { fontSize: 13, color: 'rgba(255,255,255,0.8)', lineHeight: 19 },
  scanBtnCoins: {
    position: 'absolute', right: 16, bottom: 16,
    flexDirection: 'row', gap: 6,
  },
  scanBtnCoin: {
    width: 38, height: 38, borderRadius: 19,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)',
  },
  scanBtnCoinText: { fontSize: 9, fontWeight: '800', color: 'white' },
  sectionTitle: {
    fontSize: 18, fontWeight: '800', color: COLORS.textDark, marginBottom: 4,
  },
  sectionSubtitle: { fontSize: 12, color: COLORS.textMuted, marginBottom: 16 },
  coinsGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24,
  },
  coinGridItem: {
    width: (width - 40 - 24) / 3 - 1,
    backgroundColor: COLORS.surface, borderRadius: 16,
    padding: 12, alignItems: 'center',
    shadowColor: COLORS.textDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07, shadowRadius: 8, elevation: 3,
  },
  coinGridName: {
    fontSize: 11, fontWeight: '700', color: COLORS.textMedium,
    textAlign: 'center', marginTop: 8, marginBottom: 2,
  },
  coinGridValor: { fontSize: 10, color: COLORS.textMuted, fontWeight: '500' },
  tipCard: {
    backgroundColor: COLORS.gold + '18',
    borderRadius: 14, padding: 14,
    flexDirection: 'row', gap: 10,
    borderWidth: 1, borderColor: COLORS.gold + '40',
  },
  tipIcon: { fontSize: 18 },
  tipText: { flex: 1, fontSize: 13, color: COLORS.textMedium, lineHeight: 20 },
  tipBold: { fontWeight: '700' },
});
