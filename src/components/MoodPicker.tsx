import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, fontSize, spacing, touchTarget } from '../theme';
import { MoodEntry, MoodLevel } from '../types';

const MOODS: MoodEntry[] = [
  { level: 1, label: '힘들어요' },
  { level: 2, label: '별로예요' },
  { level: 3, label: '그저 그래요' },
  { level: 4, label: '좋아요' },
  { level: 5, label: '아주 좋아요' },
];

const EMOJI: Record<MoodLevel, string> = {
  1: '😞',
  2: '🙁',
  3: '😐',
  4: '🙂',
  5: '😄',
};

interface Props {
  selected: MoodLevel | null;
  onSelect: (mood: MoodEntry) => void;
}

export default function MoodPicker({ selected, onSelect }: Props) {
  return (
    <View style={styles.row}>
      {MOODS.map(mood => {
        const isSelected = selected === mood.level;
        return (
          <Pressable
            key={mood.level}
            onPress={() => onSelect(mood)}
            style={[styles.item, isSelected && styles.itemSelected]}
            accessibilityRole="button"
            accessibilityLabel={mood.label}
          >
            <Text style={styles.emoji}>{EMOJI[mood.level]}</Text>
            <Text style={styles.label}>{mood.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  item: {
    width: '30%',
    minHeight: touchTarget.minHeight + 20,
    borderRadius: 16,
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    marginBottom: spacing.sm,
  },
  itemSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.moodBg,
  },
  emoji: {
    fontSize: 34,
    marginBottom: 4,
  },
  label: {
    fontSize: fontSize.body - 6,
    color: colors.text,
    textAlign: 'center',
  },
});
