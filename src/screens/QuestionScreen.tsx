import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import BigButton from '../components/BigButton';
import { colors, fontSize, spacing } from '../theme';
import { getTodayQuestions } from '../utils/dailyQuestions';
import { CATEGORY_LABELS } from '../data/questions';
import { Answer, Question } from '../types';
import ProgressBar from '../components/ProgressBar';

type Props = NativeStackScreenProps<RootStackParamList, 'Question'>;

export default function QuestionScreen({ navigation }: Props) {
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [index, setIndex] = useState(0);
  const [inputText, setInputText] = useState('');
  const [answers, setAnswers] = useState<Answer[]>([]);

  useEffect(() => {
    getTodayQuestions().then(setQuestions);
  }, []);

  if (!questions) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.centerLoading}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  const current = questions[index];
  const isLast = index === questions.length - 1;

  const handleNext = () => {
    const trimmed = inputText.trim();
    const newAnswers = [
      ...answers,
      { questionId: current.id, questionText: current.text, answerText: trimmed },
    ];

    if (isLast) {
      navigation.replace('Mood', { answers: newAnswers });
      return;
    }
    setAnswers(newAnswers);
    setIndex(prev => prev + 1);
    setInputText('');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ProgressBar totalNumber={questions.length} nowNumber={index + 1} />
        <View style={styles.container}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{CATEGORY_LABELS[current.category]}</Text>
          </View>
          <Text style={styles.question}>{current.text}</Text>

          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="여기에 답을 적어주세요."
            placeholderTextColor={colors.textSecondary}
            multiline
            autoFocus
          />
        </View>
        <View style={styles.buttonContainer}>
          <BigButton
            label={isLast ? '다음 (기분 기록하기)' : '다음 질문'}
            onPress={handleNext}
            style={styles.nextButton}
          />
          </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  centerLoading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  buttonContainer: {
    padding: spacing.lg,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.moodBg,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    marginVertical: spacing.sm,
    
  },
  badgeText: {
    color: colors.primaryDark,
    fontWeight: '700',
    fontSize: fontSize.body - 4,
  },
  question: {
    fontSize: fontSize.body,
    fontWeight: '700',
    color: colors.text,
    lineHeight: 32,
    marginBottom: spacing.sm,
  },
  input: {
    minHeight: 200,
    borderWidth: 2,
    lineHeight: 28,
    borderColor: colors.border,
    borderRadius: 16,
    backgroundColor: colors.card,
    padding: spacing.md,
    fontSize: fontSize.button,
    color: colors.text,
    textAlignVertical: 'top',
    marginBottom: spacing.lg,
  },
  nextButton: {
    width: '100%',
  },
});
