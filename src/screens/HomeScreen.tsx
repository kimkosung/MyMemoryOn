import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import BigButton from '../components/BigButton';
import { colors, fontSize, spacing } from '../theme';
import { getRecordByDate } from '../utils/storage';
import { todayKey } from '../utils/dailyQuestions';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

export default function HomeScreen({ navigation }: Props) {
  const [completedToday, setCompletedToday] = useState(false);
  const [checking, setChecking] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        setChecking(true);
        const record = await getRecordByDate(todayKey());
        if (active) {
          setCompletedToday(Boolean(record && record.answers.length > 0 && record.mood));
          setChecking(false);
        }
      })();
      return () => {
        active = false;
      };
    }, []),
  );

  const now = new Date();
  const dateLabel = `${now.getMonth() + 1}월 ${now.getDate()}일 ${WEEKDAYS[now.getDay()]}요일`;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.date}>{dateLabel}</Text>
        <Text style={styles.appName}>외할아버지의 기억</Text>

        {!checking && completedToday ? (
          <View style={styles.doneBox}>
            <Text style={styles.doneText}>오늘도 수고하셨어요</Text>
            <Text style={styles.doneSub}>내일 또 만나요.</Text>
          </View>
        ) : (
          <>
            <Text style={styles.guide}>아래 버튼을 눌러서{'\n'}오늘의 질문을 시작해 보세요.</Text>
            <Text style={styles.guide}>최대한 오래 생각하고 답변해주세요.</Text>
          </>

        )}

        <View style={styles.buttons}>
          <BigButton
            label={completedToday ? '오늘 기록 다시 보기' : '오늘의 질문 시작하기'}
            onPress={() =>
              completedToday
                ? navigation.navigate('History')
                : navigation.navigate('Question')
            }
            style={styles.mainButton}
          />
          <BigButton
            label="지난 기록 보기"
            variant="secondary"
            onPress={() => navigation.navigate('History')}
          />
        </View>
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
    alignItems: 'center',
  },
  date: {
    fontSize: fontSize.label,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  appName: {
    fontSize: fontSize.huge,
    fontWeight: '800',
    color: colors.primaryDark,
    marginBottom: spacing.xl,
  },
  guide: {
    fontSize: fontSize.body,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 32,
    marginBottom: spacing.xl,
  },
  doneBox: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  doneText: {
    fontSize: fontSize.title,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  doneSub: {
    fontSize: fontSize.body,
    color: colors.textSecondary,
  },
  buttons: {
    width: '100%',
    gap: spacing.sm,
  },
  mainButton: {
    width: '100%',
  },
});
