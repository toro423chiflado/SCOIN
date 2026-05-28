import React, { useRef, useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Animated,
  StatusBar, Dimensions, TextInput, KeyboardAvoidingView,
  Platform, Keyboard, TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants/colors';
import { IncaBorder, ChakanaSmall } from '../components/IncaPattern';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen({ navigation }) {
  const [nombre, setNombre] = useState('');
  const [inputFocused, setInputFocused] = useState(false);

  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const btnAnim   = useRef(new Animated.Value(0)).current;
  const btnSlide  = useRef(new Animated.Value(20)).current;
  const coinAnim  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim,  { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.spring(slideAnim, { toValue: 0, tension: 50, friction: 9, useNativeDriver: true }),
      ]),
      Animated.spring(coinAnim, { toValue: 1, tension: 55, friction: 8, useNativeDriver: true }),
      Animated.parallel([
        Animated.timing(btnAnim,  { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.spring(btnSlide, { toValue: 0, tension: 55, friction: 9, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  const handleComenzar = () => {
    const nombreFinal = nombre.trim() || 'Amigo';
    navigation.replace('Home', { nombre: nombreFinal });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.container}>
          <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

          {/* Header rojo */}
          <View style={styles.headerBg}>
            <View style={styles.headerCircle1} />
            <View style={styles.headerCircle2} />
            <ChakanaSmall color={COLORS.white} size={32} opacity={0.25} />
            <View style={{ position: 'absolute', right: 30, top: 40 }}>
              <ChakanaSmall color={COLORS.gold} size={20} opacity={0.4} />
            </View>
          </View>

          <IncaBorder color={COLORS.gold} opacity={0.5} height={3} />

          <SafeAreaView style={styles.content} edges={['bottom']}>

            {/* Logo */}
            <Animated.View style={[styles.logoRow, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
              <View style={styles.logoSmall}>
                <View style={styles.logoSmallInner}>
                  <Text style={styles.logoSmallLetter}>S</Text>
                </View>
              </View>
              <View>
                <Text style={styles.appName}>SCOIN</Text>
                <Text style={styles.appSubtitle}>Lector de monedas peruanas 🇵🇪</Text>
              </View>
            </Animated.View>

            {/* Monedas decorativas */}
            <Animated.View style={[styles.illustration, { opacity: fadeAnim, transform: [{ scale: coinAnim }] }]}>
              <View style={styles.coinsStack}>
                <View style={[styles.stackCoin, { width: 110, height: 110, borderRadius: 55, backgroundColor: '#C8922A', bottom: 0, zIndex: 1 }]}>
                  <View style={[styles.stackCoinInner, { width: 88, height: 88, borderRadius: 44, backgroundColor: '#E8B84B' }]}>
                    <Text style={styles.stackCoinText}>S/5</Text>
                  </View>
                </View>
                <View style={[styles.stackCoin, { width: 90, height: 90, borderRadius: 45, backgroundColor: '#A0A0A0', bottom: 20, left: 70, zIndex: 2 }]}>
                  <View style={[styles.stackCoinInner, { width: 72, height: 72, borderRadius: 36, backgroundColor: '#C0C0C0' }]}>
                    <Text style={styles.stackCoinText}>50c</Text>
                  </View>
                </View>
                <View style={[styles.stackCoin, { width: 100, height: 100, borderRadius: 50, backgroundColor: '#A07810', bottom: 40, left: 140, zIndex: 3 }]}>
                  <View style={[styles.stackCoinInner, { width: 80, height: 80, borderRadius: 40, backgroundColor: '#D4A017' }]}>
                    <Text style={styles.stackCoinText}>S/1</Text>
                  </View>
                </View>
              </View>
            </Animated.View>

            {/* Bienvenida + input */}
            <Animated.View style={[styles.form, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
              <Text style={styles.welcomeTitle}>¡Bienvenido! 👋</Text>
              <Text style={styles.welcomeDesc}>
                Escanea tus monedas y te digo cuáles son al instante.
              </Text>

              <Text style={styles.inputLabel}>¿Cuál es tu nombre?</Text>
              <View style={[styles.inputWrapper, inputFocused && styles.inputWrapperFocused]}>
                <Text style={styles.inputIcon}>👤</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Escribe tu nombre..."
                  placeholderTextColor="#BBAAA0"
                  value={nombre}
                  onChangeText={setNombre}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  returnKeyType="go"
                  onSubmitEditing={handleComenzar}
                  maxLength={24}
                  autoCapitalize="words"
                />
              </View>
            </Animated.View>

            {/* Botón comenzar */}
            <Animated.View style={[styles.btnBox, { opacity: btnAnim, transform: [{ translateY: btnSlide }] }]}>
              <TouchableOpacity
                style={[styles.btnPrimary, !nombre.trim() && styles.btnPrimaryDisabled]}
                onPress={handleComenzar}
                activeOpacity={0.85}
              >
                <Text style={styles.btnPrimaryText}>
                  {nombre.trim() ? `¡Empezar, ${nombre.trim()}! 🚀` : 'Comenzar sin nombre →'}
                </Text>
              </TouchableOpacity>
            </Animated.View>

          </SafeAreaView>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container:     { flex: 1, backgroundColor: COLORS.background },
  headerBg: {
    height: height * 0.20,
    backgroundColor: COLORS.primary,
    paddingLeft: 30, paddingTop: 50,
    justifyContent: 'center',
    overflow: 'hidden', position: 'relative',
  },
  headerCircle1: { position:'absolute', right:-40, top:-40, width:160, height:160, borderRadius:80, backgroundColor: COLORS.primaryLight, opacity:0.4 },
  headerCircle2: { position:'absolute', right:60, bottom:-50, width:120, height:120, borderRadius:60, backgroundColor: COLORS.primaryDark, opacity:0.4 },

  content:   { flex: 1, paddingHorizontal: 24 },

  logoRow: { flexDirection:'row', alignItems:'center', gap:14, marginTop:22, marginBottom:16 },
  logoSmall: {
    width:52, height:52, borderRadius:26,
    backgroundColor: COLORS.gold,
    justifyContent:'center', alignItems:'center',
    borderWidth:2, borderColor: COLORS.goldLight,
    shadowColor: COLORS.goldDark, shadowOffset:{width:0,height:3}, shadowOpacity:0.3, shadowRadius:6, elevation:4,
  },
  logoSmallInner: { width:40, height:40, borderRadius:20, backgroundColor: COLORS.goldDark, justifyContent:'center', alignItems:'center' },
  logoSmallLetter: { fontSize:22, fontWeight:'900', color:'white' },
  appName:    { fontSize:22, fontWeight:'900', color: COLORS.textDark, letterSpacing:6 },
  appSubtitle:{ fontSize:11, color: COLORS.textMuted, marginTop:1 },

  illustration: { height:160, alignItems:'center', justifyContent:'center', marginBottom:20 },
  coinsStack:   { width:240, height:130, position:'relative' },
  stackCoin:    { position:'absolute', justifyContent:'center', alignItems:'center', shadowColor:'#000', shadowOffset:{width:0,height:4}, shadowOpacity:0.2, shadowRadius:8, elevation:6 },
  stackCoinInner:{ justifyContent:'center', alignItems:'center' },
  stackCoinText: { fontSize:14, fontWeight:'800', color:'white', textShadowColor:'rgba(0,0,0,0.3)', textShadowOffset:{width:0,height:1}, textShadowRadius:2 },

  form:          { marginBottom: 20 },
  welcomeTitle:  { fontSize:26, fontWeight:'800', color: COLORS.textDark, marginBottom:6 },
  welcomeDesc:   { fontSize:14, color: COLORS.textLight, lineHeight:21, marginBottom:24 },

  inputLabel:    { fontSize:13, fontWeight:'700', color: COLORS.textDark, marginBottom:8 },
  inputWrapper: {
    flexDirection:'row', alignItems:'center',
    backgroundColor: COLORS.surface,
    borderRadius:16, borderWidth:2, borderColor: COLORS.border,
    paddingHorizontal:16, paddingVertical: Platform.OS==='ios' ? 14 : 10,
    gap:10,
  },
  inputWrapperFocused: { borderColor: COLORS.primary, backgroundColor:'white' },
  inputIcon:  { fontSize:18 },
  input:      { flex:1, fontSize:16, color: COLORS.textDark, fontWeight:'500' },

  btnBox:     { paddingBottom: 12 },
  btnPrimary: {
    backgroundColor: COLORS.primary,
    borderRadius:16, paddingVertical:18, alignItems:'center',
    shadowColor: COLORS.primaryDark, shadowOffset:{width:0,height:4}, shadowOpacity:0.3, shadowRadius:10, elevation:6,
  },
  btnPrimaryDisabled: { backgroundColor: COLORS.primary, opacity: 0.7 },
  btnPrimaryText:     { color:'white', fontSize:16, fontWeight:'700' },
});