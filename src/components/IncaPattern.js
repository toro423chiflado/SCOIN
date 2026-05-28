import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

export const IncaPattern = ({ style, color = COLORS.gold, size = 8, opacity = 0.15 }) => {
  const dot = { width: size, height: size, backgroundColor: color, opacity };

  return (
    <View style={[styles.container, style]} pointerEvents="none">
      <View style={styles.row}>
        {[0,1,2,3,4,5,6,7].map(i => (
          <View key={i} style={[styles.cell, i % 2 === 0 && { ...dot, borderRadius: 1 }]} />
        ))}
      </View>
      <View style={styles.row}>
        {[0,1,2,3,4,5,6,7].map(i => (
          <View key={i} style={[styles.cell, i % 2 === 1 && { ...dot, borderRadius: 1 }]} />
        ))}
      </View>
      <View style={styles.row}>
        {[0,1,2,3,4,5,6,7].map(i => (
          <View key={i} style={[styles.cell, i % 2 === 0 && { ...dot, borderRadius: 1 }]} />
        ))}
      </View>
    </View>
  );
};

export const IncaBorder = ({ color = COLORS.gold, opacity = 0.3, height = 4 }) => (
  <View style={{ height, flexDirection: 'row', overflow: 'hidden', opacity }}>
    {Array.from({ length: 30 }).map((_, i) => (
      <View
        key={i}
        style={{
          width: 12,
          height,
          backgroundColor: i % 2 === 0 ? color : COLORS.primary,
          marginRight: 2,
        }}
      />
    ))}
  </View>
);

export const ChakanaSmall = ({ color = COLORS.gold, size = 24, opacity = 0.4 }) => {
  const u = size / 3;
  return (
    <View style={{ width: size, height: size, opacity }} pointerEvents="none">
      {/* Horizontal */}
      <View style={{ position: 'absolute', top: u, left: 0, width: size, height: u, backgroundColor: color }} />
      {/* Vertical */}
      <View style={{ position: 'absolute', top: 0, left: u, width: u, height: size, backgroundColor: color }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  cell: {
    width: 12,
    height: 12,
    marginRight: 4,
  },
});
