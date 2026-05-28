import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants/colors';

export const CoinVisual = ({ valor = '1 Sol', size = 120, animate = false }) => {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animate) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 60,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(1);
    }
  }, [animate]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['-20deg', '0deg'],
  });

  const isGold = parseFloat(valor) >= 1;
  const coinColor = isGold ? '#D4A017' : '#B0B0B0';
  const coinInner = isGold ? '#E8C447' : '#C8C8C8';
  const coinEdge = isGold ? '#A07810' : '#909090';
  const coinShine = isGold ? 'rgba(255,240,150,0.5)' : 'rgba(255,255,255,0.5)';

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }, { rotate }] }}>
      {/* Sombra base */}
      <View style={[styles.coinShadow, { width: size + 8, height: size + 8, borderRadius: (size + 8) / 2 }]} />

      {/* Moneda exterior (borde dorado/plateado) */}
      <View style={[
        styles.coinOuter,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: coinEdge,
          borderWidth: 3,
          borderColor: coinColor,
        }
      ]}>
        {/* Interior de la moneda */}
        <View style={[
          styles.coinInner,
          {
            width: size * 0.82,
            height: size * 0.82,
            borderRadius: (size * 0.82) / 2,
            backgroundColor: coinColor,
          }
        ]}>
          {/* Brillo */}
          <View style={[
            styles.coinShine,
            {
              width: size * 0.4,
              height: size * 0.25,
              borderRadius: size * 0.15,
              backgroundColor: coinShine,
              top: size * 0.12,
              left: size * 0.12,
            }
          ]} />

          {/* Círculo interior */}
          <View style={[
            styles.coinCenter,
            {
              width: size * 0.55,
              height: size * 0.55,
              borderRadius: (size * 0.55) / 2,
              backgroundColor: coinInner,
              borderWidth: 1.5,
              borderColor: coinEdge,
            }
          ]}>
            {/* Escudo pequeño simulado */}
            <View style={styles.shieldContainer}>
              <View style={[styles.shieldTop, { backgroundColor: coinEdge }]} />
              <View style={styles.shieldBottom}>
                <View style={[styles.shieldLeft, { backgroundColor: coinEdge }]} />
                <View style={[styles.shieldRight, { backgroundColor: coinColor }]} />
              </View>
            </View>
          </View>

          {/* Valor de la moneda */}
          <Text style={[styles.coinText, { fontSize: size * 0.12, color: coinEdge }]}>
            {valor}
          </Text>
          <Text style={[styles.coinSubtext, { fontSize: size * 0.07, color: coinEdge }]}>
            PERÚ
          </Text>
        </View>
      </View>
    </Animated.View>
  );
};


export const CoinResultCard = ({ nombre, valor, confianza, descripcion, onPlayAudio }) => {
  const slideAnim = useRef(new Animated.Value(40)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 50, friction: 9, useNativeDriver: true }),
    ]).start();
  }, []);

  const isGold = valor >= 1;
  const formatValor = valor < 1 ? `${valor * 100} céntimos` : `S/ ${valor.toFixed(2)}`;

  return (
    <Animated.View style={[
      styles.card,
      { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
    ]}>
      {/* Header de la tarjeta */}
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <Text style={styles.cardLabel}>MONEDA IDENTIFICADA</Text>
          <Text style={styles.cardTitle}>{nombre}</Text>
          <Text style={styles.cardValor}>{formatValor}</Text>
        </View>
        <CoinVisual valor={nombre} size={72} animate />
      </View>

      {/* Barra de confianza */}
      <View style={styles.confidenceContainer}>
        <View style={styles.confidenceRow}>
          <Text style={styles.confidenceLabel}>Confianza de identificación</Text>
          <Text style={[styles.confidenceValue, { color: confianza > 80 ? COLORS.success : COLORS.warning }]}>
            {confianza}%
          </Text>
        </View>
        <View style={styles.confidenceBar}>
          <View style={[
            styles.confidenceFill,
            {
              width: `${confianza}%`,
              backgroundColor: confianza > 80 ? COLORS.success : COLORS.warning,
            }
          ]} />
        </View>
      </View>

      {/* Descripción */}
      {descripcion && (
        <Text style={styles.cardDescription}>{descripcion}</Text>
      )}

      {/* Botón de audio */}
      <TouchableOpacity style={styles.audioButton} onPress={onPlayAudio} activeOpacity={0.8}>
        <View style={styles.audioIcon}>
          <View style={styles.audioBar1} />
          <View style={styles.audioBar2} />
          <View style={styles.audioBar3} />
        </View>
        <Text style={styles.audioButtonText}>Escuchar descripción</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  coinShadow: {
    position: 'absolute',
    top: 4,
    left: 4,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  coinOuter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  coinInner: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  coinShine: {
    position: 'absolute',
    transform: [{ rotate: '-20deg' }],
  },
  coinCenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  shieldContainer: {
    width: 20,
    height: 22,
    overflow: 'hidden',
  },
  shieldTop: {
    height: 12,
    width: '100%',
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  shieldBottom: {
    flexDirection: 'row',
    height: 10,
  },
  shieldLeft: {
    flex: 1,
  },
  shieldRight: {
    flex: 1,
  },
  coinText: {
    fontWeight: '800',
    position: 'absolute',
    bottom: '22%',
    letterSpacing: 0.5,
  },
  coinSubtext: {
    fontWeight: '600',
    position: 'absolute',
    bottom: '12%',
    letterSpacing: 1,
  },
  // Card styles
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 20,
    shadowColor: COLORS.textDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    marginHorizontal: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardHeaderLeft: {
    flex: 1,
    marginRight: 12,
  },
  cardLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textMuted,
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.textDark,
    marginBottom: 2,
  },
  cardValor: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.gold,
  },
  confidenceContainer: {
    marginBottom: 14,
  },
  confidenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  confidenceLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    fontWeight: '500',
  },
  confidenceValue: {
    fontSize: 12,
    fontWeight: '700',
  },
  confidenceBar: {
    height: 6,
    backgroundColor: COLORS.cream,
    borderRadius: 3,
    overflow: 'hidden',
  },
  confidenceFill: {
    height: '100%',
    borderRadius: 3,
  },
  cardDescription: {
    fontSize: 13,
    color: COLORS.textLight,
    lineHeight: 20,
    marginBottom: 16,
  },
  audioButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  audioIcon: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 3,
    height: 16,
  },
  audioBar1: { width: 3, height: 8, backgroundColor: 'white', borderRadius: 2 },
  audioBar2: { width: 3, height: 16, backgroundColor: 'white', borderRadius: 2 },
  audioBar3: { width: 3, height: 10, backgroundColor: 'white', borderRadius: 2 },
  audioButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
