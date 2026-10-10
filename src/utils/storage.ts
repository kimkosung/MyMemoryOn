import AsyncStorage from '@react-native-async-storage/async-storage';
import { DailyRecord, QuestionQueueState } from '../types';

const KEYS = {
  RECORDS: 'records', // dateKey -> DailyRecord (하나의 map으로 저장, 데이터량이 작아 단순하게 관리)
  QUEUE: 'question_queue',
} as const;

export type RecordsMap = Record<string, DailyRecord>;

// 날짜를 'YYYY-MM-DD' 형식에서 'YYYY년 MM월 DD일' 형식으로 변환
export const displayDate = (records: DailyRecord): string => {
    const date = new Date(records.dateKey);
    
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');

    return `${y}년 ${m}월 ${d}일`;
  };

export async function getAllRecords(): Promise<RecordsMap> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.RECORDS);
    if (!raw) return {};
    return JSON.parse(raw) as RecordsMap;
  } catch (e) {
    console.error('getAllRecords error', e);
    return {};
  }
}

export async function saveDailyRecord(record: DailyRecord): Promise<void> {
  try {
    const all = await getAllRecords();
    all[record.dateKey] = record;
    await AsyncStorage.setItem(KEYS.RECORDS, JSON.stringify(all));
  } catch (e) {
    console.error('saveDailyRecord error', e);
  }
}

export async function getRecordByDate(dateKey: string): Promise<DailyRecord | null> {
  const all = await getAllRecords();
  return all[dateKey] ?? null;
}

export async function getQueueState(): Promise<QuestionQueueState | null> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.QUEUE);
    if (!raw) return null;
    return JSON.parse(raw) as QuestionQueueState;
  } catch (e) {
    console.error('getQueueState error', e);
    return null;
  }
}

export async function saveQueueState(state: QuestionQueueState): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.QUEUE, JSON.stringify(state));
  } catch (e) {
    console.error('saveQueueState error', e);
  }
}
