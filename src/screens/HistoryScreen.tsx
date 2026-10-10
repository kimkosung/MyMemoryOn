import React, { useCallback, useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Pressable,
  Animated,
  Easing,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import BigButton from '../components/BigButton';
import { colors, fontSize, spacing } from '../theme';
import { getAllRecords } from '../utils/storage';
import { DailyRecord } from '../types';
import { displayDate } from '../utils/storage';

// 구 아키텍처 Android에서 LayoutAnimation 활성화
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental &&
  !(global as any).nativeFabricUIManager
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type Props = NativeStackScreenProps<RootStackParamList, 'History'>;

const MOOD_EMOJI: Record<number, string> = { 1: '😞', 2: '🙁', 3: '😐', 4: '🙂', 5: '😄' };

// 접었다 펼 수 있는 기록들
function HistoryCard({
  item,
  defaultOpen = false,
}: {
  item: DailyRecord;
  defaultOpen?: boolean;
}) {
  const [showCard, setShowCard] = useState<boolean>(defaultOpen);
  const rotate = useRef(new Animated.Value(defaultOpen ? 1 : 0)).current;

  // 화살표 회전 애니메이션, TODO: 아이콘으로 변경 예정
  useEffect(() => {
    Animated.timing(rotate, {
      toValue: showCard ? 1 : 0,
      duration: 250,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [showCard, rotate]);

  const toggle = () => {
    // 다음 렌더에서 일어나는 레이아웃 높이를 부드럽게 만들어줌
    LayoutAnimation.configureNext({
      duration: 250,
      create: { type: 'easeInEaseOut', property: 'opacity' },
      update: { type: 'easeInEaseOut' },
      delete: { type: 'easeInEaseOut', property: 'opacity' },
    });
    setShowCard(prev => !prev);
  };

  const arrowRotation = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View style={styles.card}>
      <Pressable
        onPress={toggle}
        style={[styles.cardHeader, showCard && styles.cardHeaderOpen]}
        accessibilityRole="button"
        accessibilityState={{ expanded: showCard }}
        accessibilityLabel={`${displayDate(item)} 기록 ${showCard ? '접기' : '펼치기'}`}
      >
        <Text style={styles.cardDate}>{displayDate(item)}</Text>
        {/* TODO: 이모지 렌더링 오류 해결 */}
        {/* {item.mood && (
          <Text style={styles.cardMood}>{MOOD_EMOJI[item.mood.level]} {item.mood.label}</Text>
        )} */}
        <Animated.Text style={[styles.arrow, { transform: [{ rotate: arrowRotation }] }]}>
          ▼
        </Animated.Text>
      </Pressable>

      {showCard && (
        <View>
          <View style={styles.cardLine} />
          {item.answers.map((a, i) => (
            <View key={`${item.dateKey}-${i}`} style={styles.qa}>
              <Text style={styles.q}>Q. {a.questionText}</Text>
              <Text style={styles.a}>{a.answerText ? a.answerText : '답변을 하지 않았어요.'}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

export default function HistoryScreen({ navigation }: Props) {
  const [records, setRecords] = useState<DailyRecord[]>([]);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      getAllRecords().then(all => {
        if (!active) return;
        const list = Object.values(all).sort((a, b) => (a.dateKey < b.dateKey ? 1 : -1));
        setRecords(list);
      });
      return () => {
        active = false;
      };
    }, []),
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>지난 기록</Text>
      </View>

      {records.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>아직 기록이 없어요.{'\n'}오늘의 질문부터 시작해 보세요.</Text>
        </View>
      ) : (
        <FlatList
          data={records}
          keyExtractor={item => item.dateKey}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <HistoryCard item={item}/>
          )}
        />
      )}

      <View style={styles.footer}>
        <BigButton label="홈으로" variant="primary" onPress={() => navigation.navigate('Home')} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { padding: spacing.lg, paddingBottom: spacing.lg },
  title: { fontSize: fontSize.title, fontWeight: '800', color: colors.primaryDark },
  list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.lg, gap: spacing.xs },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  emptyText: {
    fontSize: fontSize.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 30,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardHeaderOpen: {
    marginBottom: spacing.sm,
  },
  cardDate: { fontSize: fontSize.label, fontWeight: '700', color: colors.text },
  arrow: { fontSize: 14, color: colors.textSecondary, paddingHorizontal: spacing.xs },

  cardLine: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    marginBottom: spacing.md,
    marginTop: spacing.xs,
  },
  cardMood: { fontSize: fontSize.body - 4, color: colors.textSecondary },
  qa: { marginBottom: spacing.sm },
  q: { fontSize: fontSize.body - 4, fontWeight: '700', color: colors.primaryDark, marginBottom: 4 },
  a: { fontSize: fontSize.body - 4, color: colors.text, lineHeight: 30 },
  footer: { padding: spacing.lg },
});