import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import BigButton from '../components/BigButton';
import MoodPicker from '../components/MoodPicker';
import { colors, fontSize, spacing } from '../theme';
import { MoodEntry, MoodLevel, DailyRecord } from '../types';
import { saveDailyRecord } from '../utils/storage';
import { todayKey } from '../utils/dailyQuestions';

type Props = NativeStackScreenProps<RootStackParamList, 'Mood'>;

export default function MoodScreen({ route, navigation }: Props) {
  const { answers } = route.params;
  const [selected, setSelected] = useState<MoodEntry | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!selected) return;
    setSaving(true);
    const record: DailyRecord = {
      dateKey: todayKey(),
      answers,
      mood: selected,
      completedAt: new Date().toISOString(),
    };
    await saveDailyRecord(record);
    setSaving(false);
    navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>오늘 기분은 어떠세요?</Text>
        <Text style={styles.sub}>가장 가까운 것을 하나 골라주세요.</Text>

        <MoodPicker
          selected={selected?.level as MoodLevel | null}
          onSelect={mood => setSelected(mood)}
        />

        <BigButton
          label={saving ? '저장 중...' : '기록 마치기'}
          onPress={handleSave}
          disabled={!selected || saving}
          style={styles.saveButton}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  title: {
    fontSize: fontSize.title,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  sub: {
    fontSize: fontSize.body - 4,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  saveButton: {
    width: '100%',
    marginTop: spacing.lg,
  },
});
