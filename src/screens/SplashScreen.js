import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Animated, StatusBar, Dimensions,
} from 'react-native';
import { COLORS } from '../constants/colors';
import { ChakanaSmall } from '../components/IncaPattern';

const { width, height } = Dimensions.get('window');

export default function SplashScreen({ navigation }) {
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const circleScale = useRef(new Animated.Value(0)).current;
  const tagOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      // 1. Círculo de fondo aparece
      Animated.timing(circleScale, {
        toValue: 1, duration: 600, useNativeDriver: true,
      }),
      // 2. Logo aparece con spring
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1, tension: 60, friction: 7, useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1, duration: 400, useNativeDriver: true,
        }),
      ]),
      // 3. Texto y tagline aparecen
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1, duration: 500, useNativeDriver: true,
        }),
        Animated.timing(tagOpacity, {
          toValue: 1, duration: 600, delay: 200, useNativeDriver: true,
        }),
      ]),
      // 4. Pausa antes de navegar
      Animated.delay(900),
    ]).start(() => {
      navigation.replace('Welcome');
    });
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* Fondo con patrón */}
      <View style={styles.topDecoration} />
      <View style={styles.bottomDecoration} />

      {/* Chakanas decorativas */}
      <View style={styles.chakanaTopLeft}>
        <ChakanaSmall color={COLORS.goldLight} size={36} opacity={0.3} />
      </View>
      <View style={styles.chakanaTopRight}>
        <ChakanaSmall color={COLORS.goldLight} size={28} opacity={0.2} />
      </View>
      <View style={styles.chakanaBottomLeft}>
        <ChakanaSmall color={COLORS.goldLight} size={20} opacity={0.2} />
      </View>

      {/* Círculo de fondo del logo */}
      <Animated.View style={[
        styles.logoCircleBg,
        { transform: [{ scale: circleScale }] }
      ]} />

      {/* Logo S */}
      <Animated.View style={[
        styles.logoContainer,
        { opacity: logoOpacity, transform: [{ scale: logoScale }] }
      ]}>
        <View style={styles.logoOuter}>
          <View style={styles.logoInner}>
            <Text style={styles.logoLetter}>S</Text>
          </View>
        </View>
      </Animated.View>

      {/* Nombre y tagline */}
      <Animated.View style={[styles.textContainer, { opacity: textOpacity }]}>
        <Text style={styles.appName}>SCOIN</Text>
        <View style={styles.nameDivider} />
      </Animated.View>

      <Animated.Text style={[styles.tagline, { opacity: tagOpacity }]}>
        Identifica monedas peruanas{'\n'}con tu cámara
      </Animated.Text>

      {/* Monedas decorativas en la base */}
      <View style={styles.coinsRow}>
        {['5c', '10c', '20c', '50c', 'S/1', 'S/2', 'S/5'].map((v, i) => (
          <View key={i} style={[
            styles.miniCoin,
            {
              backgroundColor: parseFloat(v) >= 1 || v.includes('S/') ? '#C8922A' : '#A0A0A0',
              opacity: 0.4 + (i * 0.08),
              transform: [{ scale: 0.7 + (i * 0.04) }],
            }
          ]}>
            <Text style={styles.miniCoinText}>{v}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topDecoration: {
    position: 'absolute',
    top: -60,
    right: -60,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: COLORS.primaryLight,
    opacity: 0.4,
  },
  bottomDecoration: {
    position: 'absolute',
    bottom: -80,
    left: -80,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: COLORS.primaryDark,
    opacity: 0.5,
  },
  chakanaTopLeft: { position: 'absolute', top: 60, left: 24 },
  chakanaTopRight: { position: 'absolute', top: 80, right: 32 },
  chakanaBottomLeft: { position: 'absolute', bottom: 140, left: 40 },
  logoCircleBg: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  logoContainer: {
    marginBottom: 24,
  },
  logoOuter: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.gold,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
    borderWidth: 4,
    borderColor: COLORS.goldLight,
  },
  logoInner: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: COLORS.goldDark,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.gold,
  },
  logoLetter: {
    fontSize: 52,
    fontWeight: '900',
    color: COLORS.white,
    letterSpacing: -2,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  appName: {
    fontSize: 42,
    fontWeight: '900',
    color: COLORS.white,
    letterSpacing: 12,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  nameDivider: {
    width: 48,
    height: 3,
    backgroundColor: COLORS.gold,
    borderRadius: 2,
    marginTop: 8,
  },
  tagline: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    letterSpacing: 0.3,
  },
  coinsRow: {
    position: 'absolute',
    bottom: 50,
    flexDirection: 'row',
    gap: 8,
  },
  miniCoin: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  miniCoinText: {
    fontSize: 8,
    fontWeight: '700',
    color: 'white',
  },
});
