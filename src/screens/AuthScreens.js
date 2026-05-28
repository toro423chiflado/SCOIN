import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  Animated, StatusBar, SafeAreaView, KeyboardAvoidingView,
  Platform, ScrollView, ActivityIndicator,
} from 'react-native';
import { COLORS } from '../constants/colors';
import { IncaBorder, ChakanaSmall } from '../components/IncaPattern';
import { ENDPOINTS } from '../constants/endpoints';

// ── Componente de input reutilizable ─────────────────────
const SCInput = ({ label, placeholder, value, onChangeText, keyboardType = 'default', maxLength }) => {
  const [focused, setFocused] = useState(false);
  const borderAnim = useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    setFocused(true);
    Animated.timing(borderAnim, { toValue: 1, duration: 200, useNativeDriver: false }).start();
  };
  const handleBlur = () => {
    setFocused(false);
    Animated.timing(borderAnim, { toValue: 0, duration: 200, useNativeDriver: false }).start();
  };

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.border, COLORS.primary],
  });

  return (
    <View style={scInputStyles.wrapper}>
      <Text style={scInputStyles.label}>{label}</Text>
      <Animated.View style={[scInputStyles.inputContainer, { borderColor }]}>
        <TextInput
          style={scInputStyles.input}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textMuted}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          keyboardType={keyboardType}
          maxLength={maxLength}
          autoCapitalize={keyboardType === 'phone-pad' ? 'none' : 'words'}
        />
      </Animated.View>
    </View>
  );
};

const scInputStyles = StyleSheet.create({
  wrapper: { marginBottom: 18 },
  label: { fontSize: 13, fontWeight: '600', color: COLORS.textMedium, marginBottom: 8, letterSpacing: 0.3 },
  inputContainer: {
    borderWidth: 1.5,
    borderRadius: 14,
    backgroundColor: COLORS.surface,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  input: { fontSize: 15, color: COLORS.textDark, fontWeight: '500' },
});

// ══════════════════════════════════════════════════════════
//  RegisterScreen
// ══════════════════════════════════════════════════════════
export function RegisterScreen({ navigation }) {
  const [nombre, setNombre] = useState('');
  const [numero, setNumero] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  }, []);

  const handleRegister = async () => {
    if (!nombre.trim()) { setError('Ingresa tu nombre'); return; }
    if (!numero.trim() || numero.length < 9) { setError('Ingresa tu número de celular'); return; }
    setError('');
    setLoading(true);

    try {
      // Endpoint: POST /auth/registro
      // const res = await fetch(ENDPOINTS.AUTH.REGISTER, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ nombre: nombre.trim(), numero: numero.trim() }),
      // });
      // const data = await res.json();
      // if (!res.ok) throw new Error(data.mensaje || 'Error al registrar');

      // Mock: simulamos delay
      await new Promise(r => setTimeout(r, 1200));
      navigation.replace('Home', { nombre: nombre.trim() });
    } catch (err) {
      setError(err.message || 'Ocurrió un error. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <View style={styles.backArrow} />
        </TouchableOpacity>
        <View style={styles.headerDecCircle1} />
        <View style={styles.headerDecCircle2} />
        <ChakanaSmall color={COLORS.white} size={28} opacity={0.2} />
        <Text style={styles.headerTitle}>¿Cuál es tu nombre?</Text>
        <Text style={styles.headerSubtitle}>Cuéntame un poco sobre ti</Text>
      </View>

      <IncaBorder color={COLORS.gold} opacity={0.5} height={3} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.formContainer} showsVerticalScrollIndicator={false}>
          <Animated.View style={{ opacity: fadeAnim }}>
            {/* Ícono de bienvenida */}
            <View style={styles.iconContainer}>
              <View style={styles.iconCircle}>
                <Text style={styles.iconEmoji}>👤</Text>
              </View>
              <Text style={styles.formTitle}>Registro</Text>
              <Text style={styles.formSubtitle}>
                Crea tu cuenta para guardar tu historial de escaneos
              </Text>
            </View>

            {/* Campos */}
            <SCInput
              label="Tu nombre"
              placeholder="Ej: Macos, Juan, Lucía..."
              value={nombre}
              onChangeText={setNombre}
              maxLength={40}
            />
            <SCInput
              label="Tu número de celular"
              placeholder="Ej: 987 654 321"
              value={numero}
              onChangeText={setNumero}
              keyboardType="phone-pad"
              maxLength={9}
            />

            {/* Error */}
            {error ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>⚠ {error}</Text>
              </View>
            ) : null}

            {/* Botón */}
            <TouchableOpacity
              style={[styles.btnPrimary, loading && { opacity: 0.7 }]}
              onPress={handleRegister}
              activeOpacity={0.85}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.btnPrimaryText}>¡Empecemos a escanear!</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.linkBtn}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.linkBtnText}>¿Ya tienes cuenta? Ingresar</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

// ══════════════════════════════════════════════════════════
//  LoginScreen
// ══════════════════════════════════════════════════════════
export function LoginScreen({ navigation }) {
  const [nombre, setNombre] = useState('');
  const [numero, setNumero] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  }, []);

  const handleLogin = async () => {
    if (!nombre.trim() || !numero.trim()) { setError('Completa todos los campos'); return; }
    setError('');
    setLoading(true);
    try {
      // Endpoint: POST /auth/login
      await new Promise(r => setTimeout(r, 1000));
      navigation.replace('Home', { nombre: nombre.trim() });
    } catch (err) {
      setError('Número o nombre incorrecto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <View style={styles.backArrow} />
        </TouchableOpacity>
        <View style={styles.headerDecCircle1} />
        <View style={styles.headerDecCircle2} />
        <ChakanaSmall color={COLORS.white} size={28} opacity={0.2} />
        <Text style={styles.headerTitle}>¡Ya te echaba{'\n'}de menos!</Text>
        <Text style={styles.headerSubtitle}>Ingresa con tu nombre y número</Text>
      </View>
      <IncaBorder color={COLORS.gold} opacity={0.5} height={3} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.formContainer}>
          <Animated.View style={{ opacity: fadeAnim }}>
            <View style={styles.iconContainer}>
              <View style={[styles.iconCircle, { backgroundColor: COLORS.gold + '22' }]}>
                <Text style={styles.iconEmoji}>🪙</Text>
              </View>
              <Text style={styles.formTitle}>Bienvenido de nuevo</Text>
              <Text style={styles.formSubtitle}>¿Listo para escanear más monedas?</Text>
            </View>
            <SCInput label="Tu nombre" placeholder="¿Cómo te llamas?" value={nombre} onChangeText={setNombre} />
            <SCInput label="Tu número" placeholder="Número registrado" value={numero} onChangeText={setNumero} keyboardType="phone-pad" maxLength={9} />
            {error ? <View style={styles.errorBox}><Text style={styles.errorText}>⚠ {error}</Text></View> : null}
            <TouchableOpacity style={[styles.btnPrimary, loading && { opacity: 0.7 }]} onPress={handleLogin} activeOpacity={0.85} disabled={loading}>
              {loading ? <ActivityIndicator color="white" /> : <Text style={styles.btnPrimaryText}>Ingresar</Text>}
            </TouchableOpacity>
            <TouchableOpacity style={styles.linkBtn} onPress={() => navigation.navigate('Register')}>
              <Text style={styles.linkBtnText}>¿No tienes cuenta? Registrarse</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 52,
    paddingBottom: 28,
    paddingHorizontal: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  headerDecCircle1: {
    position: 'absolute', right: -30, top: -30,
    width: 130, height: 130, borderRadius: 65,
    backgroundColor: COLORS.primaryLight, opacity: 0.35,
  },
  headerDecCircle2: {
    position: 'absolute', right: 50, bottom: -40,
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: COLORS.primaryDark, opacity: 0.4,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 16,
  },
  backArrow: {
    width: 10, height: 10,
    borderLeftWidth: 2, borderBottomWidth: 2,
    borderColor: 'white',
    transform: [{ rotate: '45deg' }, { translateX: 2 }],
  },
  headerTitle: {
    fontSize: 26, fontWeight: '800',
    color: 'white', marginBottom: 4,
    marginTop: 8,
  },
  headerSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.75)' },
  formContainer: { padding: 24, paddingTop: 28 },
  iconContainer: { alignItems: 'center', marginBottom: 28 },
  iconCircle: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: COLORS.primary + '18',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 12,
  },
  iconEmoji: { fontSize: 32 },
  formTitle: { fontSize: 20, fontWeight: '800', color: COLORS.textDark, marginBottom: 6 },
  formSubtitle: { fontSize: 13, color: COLORS.textLight, textAlign: 'center' },
  errorBox: {
    backgroundColor: '#FEE2E2', borderRadius: 12, padding: 12,
    marginBottom: 16, borderWidth: 1, borderColor: '#FCA5A5',
  },
  errorText: { fontSize: 13, color: COLORS.error, fontWeight: '500' },
  btnPrimary: {
    backgroundColor: COLORS.primary, borderRadius: 16,
    paddingVertical: 18, alignItems: 'center',
    shadowColor: COLORS.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 10, elevation: 6,
    marginBottom: 16,
  },
  btnPrimaryText: { color: 'white', fontSize: 16, fontWeight: '700', letterSpacing: 0.3 },
  linkBtn: { alignItems: 'center', paddingVertical: 10 },
  linkBtnText: { fontSize: 14, color: COLORS.primary, fontWeight: '600' },
});
