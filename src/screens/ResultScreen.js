import React, { useEffect, useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Animated,
  StatusBar, Image, Dimensions, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants/colors';
import { playAudio, stopAudio } from '../services/audioService';
import { identifyCoin } from '../services/coinIdentifier';
import { COIN_DATA } from '../constants/audioDatabase';

const { width } = Dimensions.get('window');

// Animación de Audio   
const AudioWave = ({ playing, size = 4 }) => {
  const alts = [0.4,0.9,1.0,0.6,0.85,0.5,0.95,0.45,0.7,0.55];
  const anims = alts.map(h => useRef(new Animated.Value(h*0.3)).current);

  useEffect(() => {
    const loops = anims.map((a, i) => {
      if (!playing) {
        Animated.timing(a,{toValue:alts[i]*0.3,duration:200,useNativeDriver:true}).start();
        return null;
      }
      return Animated.loop(Animated.sequence([
        Animated.timing(a,{toValue:alts[i],duration:160+i*40,useNativeDriver:true}),
        Animated.timing(a,{toValue:alts[i]*0.2,duration:160+i*40,useNativeDriver:true}),
      ]));
    });
    if (playing) loops.forEach(l=>l?.start());
    return () => loops.forEach(l=>l?.stop());
  }, [playing]);

  return (
    <View style={{ flexDirection:'row', alignItems:'center', gap:3, height:32 }}>
      {anims.map((a,i) => (
        <Animated.View key={i} style={{
          width: size, height:32, borderRadius:size/2,
          backgroundColor:'rgba(255,255,255,0.9)',
          transform:[{scaleY:a}],
        }}/>
      ))}
    </View>
  );
};

// Moneda de forma visual
const CoinVisual = ({ moneda, size = 120, animate = false }) => {
  const scaleAnim = useRef(new Animated.Value(animate ? 0 : 1)).current;

  useEffect(() => {
    if (animate) {
      Animated.spring(scaleAnim, { toValue:1, tension:55, friction:7, useNativeDriver:true }).start();
    }
  }, []);

  const esBimetalica = ['1SOL','2SOLES','5SOLES'].includes(moneda?.id);
  const esCentimo    = ['10CENTIMOS','20CENTIMOS','50CENTIMOS'].includes(moneda?.id);
  const noEncontrada = !moneda || moneda.id === 'NFOUND';

  const outerColor = esBimetalica
    ? (moneda.id === '1SOL' ? '#909090' : '#C8922A')
    : noEncontrada ? '#CCCCCC' : '#C8922A';
  const innerColor = esBimetalica
    ? (moneda.id === '1SOL' ? '#C8922A' : '#909090')
    : noEncontrada ? '#AAAAAA' : '#E8B84B';

  return (
    <Animated.View style={{ transform:[{scale:scaleAnim}], alignItems:'center' }}>
      <View style={[styles.coinOuter, { width:size, height:size, borderRadius:size/2, backgroundColor:outerColor }]}>
        <View style={[styles.coinInner, { width:size*0.70, height:size*0.70, borderRadius:size*0.35, backgroundColor:innerColor }]}>
          <Text style={[styles.coinSymbol, { fontSize: size * 0.22 }]}>
            {noEncontrada ? '?' : moneda?.simbolo ?? moneda?.nombre?.charAt(0)}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
};

// Pantalla principal
export default function ResultScreen({ navigation, route }) {
  const nombre    = route?.params?.nombre    ?? 'Amigo';
  const imagenUri = route?.params?.imagenUri ?? null;

  const [moneda,       setMoneda]       = useState(null);
  const [estado,       setEstado]       = useState('analizando'); // analizando | identificada | nfound
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [confianza,    setConfianza]    = useState(0);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const reproducirAudio = async (coinId) => {
    if (!coinId) return;
    setAudioPlaying(true);
    await playAudio(coinId, () => setAudioPlaying(false));
  };

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue:1, duration:400, useNativeDriver:true }).start();

    if (!imagenUri) { setEstado('nfound'); return; }

    identifyCoin(imagenUri).then(({ coinData, confianza: conf }) => {
      const esValida = coinData?.id && coinData.id !== 'NFOUND';
      setMoneda(coinData ?? COIN_DATA['NFOUND']);
      setConfianza(conf);
      setEstado(esValida ? 'identificada' : 'nfound');
      reproducirAudio(coinData.id); 
    }).catch(() => {
      setMoneda(COIN_DATA['NFOUND']);
      setEstado('nfound');
    });

    return () => stopAudio();
  }, []);

  const esValida = estado === 'identificada';

  // Confianza 
  const confColor = confianza >= 80 ? '#22C55E' : confianza >= 60 ? '#F59E0B' : '#EF4444';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* Header */}
      <Animated.View style={[styles.header, { opacity:fadeAnim }, !esValida && { backgroundColor:'#666' }]}>
        <SafeAreaView edges={['top']}>
          <View style={styles.headerRow}>
            <TouchableOpacity style={styles.backBtn} onPress={() => { stopAudio(); navigation.goBack(); }}>
              <Text style={styles.backArrow}>‹</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>SCOIN</Text>
            <View style={{ width:36 }} />
          </View>
        </SafeAreaView>
      </Animated.View>

      <Animated.View style={[styles.content, { opacity:fadeAnim }]}>

        {/* ── ANALIZANDO ── */}
        {estado === 'analizando' && (
          <View style={styles.analizandoBox}>
            <View style={styles.analizandoRing}>
              <ActivityIndicator color={COLORS.gold} size="large" />
            </View>
            <Text style={styles.analizandoTitle}>Analizando moneda...</Text>
            <Text style={styles.analizandoSub}>Detectando colores y tamaño</Text>
            {imagenUri && (
              <Image source={{ uri:imagenUri }} style={styles.fotoSmall} resizeMode="cover" />
            )}
          </View>
        )}

        {/* ── IDENTIFICADA ── */}
        {estado === 'identificada' && moneda && (
          <View style={styles.resultBox}>
            {/* Foto + moneda visual */}
            <View style={styles.topRow}>
              {imagenUri && (
                <Image source={{ uri:imagenUri }} style={styles.fotoResult} resizeMode="cover" />
              )}
              <View style={styles.coinSide}>
                <CoinVisual moneda={moneda} size={100} animate />
                <View style={[styles.confBadge, { backgroundColor: confColor+'22', borderColor: confColor }]}>
                  <Text style={[styles.confText, { color: confColor }]}>{confianza}%</Text>
                </View>
              </View>
            </View>

            {/* Nombre grande */}
            <Text style={styles.coinNombre}>{moneda.nombre}</Text>
            {moneda.valor > 0 && (
              <Text style={styles.coinValor}>
                {moneda.valor < 1 ? `${moneda.valor*100} céntimos` : `S/ ${moneda.valor?.toFixed(2)}`}
              </Text>
            )}

            {/* Audio playing indicator */}
            <View style={[styles.audioBar, audioPlaying && styles.audioBarActive]}>
              <AudioWave playing={audioPlaying} />
              <Text style={styles.audioBarText}>
                {audioPlaying ? 'Reproduciendo descripción...' : 'Audio listo'}
              </Text>
            </View>

            {/* Datos técnicos */}
            <View style={styles.dataGrid}>
              {[
                ['Material',  moneda.material],
                ['Diámetro',  moneda.diametro],
                ['Peso',      moneda.peso],
              ].filter(([,v])=>v).map(([k,v]) => (
                <View key={k} style={styles.dataItem}>
                  <Text style={styles.dataKey}>{k}</Text>
                  <Text style={styles.dataVal}>{v}</Text>
                </View>
              ))}
            </View>

            <Text style={styles.descText}>{moneda.descripcion}</Text>

            {/* Botón de repetir */}
            <TouchableOpacity
              style={[styles.replayBtn, audioPlaying && styles.replayBtnPlaying]}
              onPress={() => reproducirAudio(moneda.id)}
              disabled={audioPlaying}
              activeOpacity={0.85}
            >
              <AudioWave playing={audioPlaying} size={3} />
              <Text style={styles.replayBtnText}>
                {audioPlaying ? 'Reproduciendo...' : '🔁  Escuchar de nuevo'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── NO ENCONTRADA ── */}
        {estado === 'nfound' && (
          <View style={styles.nfoundBox}>
            <Text style={styles.nfoundEmoji}>🔍</Text>
            <Text style={styles.nfoundTitle}>No se identificó la moneda</Text>
            <Text style={styles.nfoundDesc}>
              Para mejores resultados:{'\n'}
              • Fondo oscuro (negro o azul){'  '}
              • Llena el círculo con la moneda{'\n'}
              • Buena luz sin flash directo
            </Text>
            {imagenUri && (
              <Image source={{ uri:imagenUri }} style={styles.fotoSmall} resizeMode="cover" />
            )}
          </View>
        )}

        {/* Botones de acción */}
        <View style={styles.actions}>
         <TouchableOpacity
          style={styles.btnPrimary}
          onPress={() => { stopAudio(); navigation.navigate('Home', { nombre }); }}
          activeOpacity={0.85}>
            <Text style={styles.btnPrimaryText}>Ir al inicio</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:'#F5F0E8' },

  header: {
    backgroundColor: COLORS.primary,
    paddingHorizontal:20, paddingBottom:12,
  },
  headerRow: {
    flexDirection:'row', alignItems:'center',
    justifyContent:'space-between', paddingTop:4,
  },
  backBtn: { width:36,height:36,borderRadius:18, backgroundColor:'rgba(255,255,255,0.2)', justifyContent:'center',alignItems:'center' },
  backArrow: { color:'white',fontSize:30,lineHeight:34,marginLeft:-2 },
  headerTitle: { color:'white',fontSize:18,fontWeight:'900',letterSpacing:3 },

  content: { flex:1, padding:20 },

  // ── Analizando ────────────────
  analizandoBox: { flex:1, alignItems:'center', justifyContent:'center', gap:16 },
  analizandoRing: {
    width:90, height:90, borderRadius:45,
    backgroundColor:'white', justifyContent:'center', alignItems:'center',
    shadowColor:'#000', shadowOffset:{width:0,height:4}, shadowOpacity:0.1, shadowRadius:12, elevation:6,
  },
  analizandoTitle: { fontSize:20, fontWeight:'800', color:'#1A1A1A' },
  analizandoSub:   { fontSize:13, color:'#888' },
  fotoSmall: { width:100, height:100, borderRadius:16, marginTop:8, borderWidth:2, borderColor:'#E0D0B0' },

  // ── Identificada ──────────────
  resultBox: { flex:1, gap:12 },

  topRow: { flexDirection:'row', gap:16, alignItems:'center' },
  fotoResult: { width:110, height:110, borderRadius:18, borderWidth:2, borderColor:'#E0D0B0' },
  coinSide: { flex:1, alignItems:'center', gap:8 },

  coinOuter: { justifyContent:'center', alignItems:'center', shadowColor:'#000', shadowOffset:{width:0,height:4}, shadowOpacity:0.2, shadowRadius:10, elevation:6 },
  coinInner: { justifyContent:'center', alignItems:'center' },
  coinSymbol: { fontWeight:'900', color:'white', textShadowColor:'rgba(0,0,0,0.3)', textShadowOffset:{width:0,height:1}, textShadowRadius:3 },

  confBadge: { borderRadius:10, paddingHorizontal:10, paddingVertical:4, borderWidth:1.5 },
  confText:  { fontSize:12, fontWeight:'800' },

  coinNombre: { fontSize:28, fontWeight:'900', color:'#1A1A1A', textAlign:'center' },
  coinValor:  { fontSize:16, fontWeight:'700', color: COLORS.gold, textAlign:'center', marginTop:-6 },

  audioBar: {
    flexDirection:'row', alignItems:'center', gap:12,
    backgroundColor: COLORS.primary, borderRadius:16,
    paddingVertical:14, paddingHorizontal:20,
    opacity:0.7,
  },
  audioBarActive: { opacity:1 },
  audioBarText: { color:'white', fontSize:13, fontWeight:'600' },

  dataGrid: { flexDirection:'row', gap:8, flexWrap:'wrap' },
  dataItem: { backgroundColor:'white', borderRadius:12, paddingHorizontal:12, paddingVertical:8, flex:1, minWidth:80 },
  dataKey:  { fontSize:10, color:'#999', fontWeight:'600', marginBottom:2 },
  dataVal:  { fontSize:13, color:'#1A1A1A', fontWeight:'700' },

  descText: { fontSize:13, color:'#666', lineHeight:20 },

  replayBtn: {
    backgroundColor: COLORS.primary, borderRadius:16,
    paddingVertical:16, paddingHorizontal:20,
    flexDirection:'row', alignItems:'center', justifyContent:'center', gap:12,
  },
  replayBtnPlaying: { backgroundColor: COLORS.gold },
  replayBtnText: { color:'white', fontSize:15, fontWeight:'700' },

  // ── No encontrada ─────────────
  nfoundBox: { flex:1, alignItems:'center', justifyContent:'center', gap:14 },
  nfoundEmoji: { fontSize:56 },
  nfoundTitle: { fontSize:20, fontWeight:'800', color:'#1A1A1A' },
  nfoundDesc:  { fontSize:13, color:'#888', textAlign:'center', lineHeight:22 },

  // ── Acciones ──────────────────
  actions: { gap:10, paddingTop:4 },
  btnPrimary: { backgroundColor: COLORS.primary, borderRadius:16, paddingVertical:16, alignItems:'center' },
  btnPrimaryText: { color:'white', fontSize:15, fontWeight:'700' },
  btnSecondary: { backgroundColor:'white', borderRadius:16, paddingVertical:16, alignItems:'center', borderWidth:1.5, borderColor:'#DDD' },
  btnSecondaryText: { color:'#666', fontSize:15, fontWeight:'600' },
});