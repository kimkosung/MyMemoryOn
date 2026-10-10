import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Animated, Easing } from 'react-native';
import { colors, spacing } from '../theme';

interface ProgressBarProps {
  totalNumber: number;
  nowNumber: number;
}

export default function ProgressBar({ totalNumber, nowNumber }: ProgressBarProps) {
  const ratio = totalNumber > 0 ? Math.min(Math.max(nowNumber / totalNumber, 0), 1) : 0;
  const animated = useRef(new Animated.Value(ratio)).current;

  useEffect(() => {
    Animated.timing(animated, {
      toValue: ratio,
      duration: 300,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [ratio, animated]);

  const width = animated.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <View
        style={styles.progressBar}
        accessibilityRole="progressbar"
        accessibilityValue={{ min: 0, max: totalNumber, now: nowNumber }}
      >
        <Animated.View style={[styles.progress, { width }]} />
      </View>
      <Text style={styles.label}>
        {nowNumber} / {totalNumber}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  progressBar: {
    flex: 1,
    height: 12,
    backgroundColor: colors.border,
    borderRadius: 6,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 6,
  },
  label: {
    marginLeft: spacing.sm,
    fontSize: 16,
    fontWeight: '700',
    color: colors.textSecondary,
    minWidth: 48,
    textAlign: 'right',
  },
});