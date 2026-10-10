import { QUESTIONS } from '../data/questions';
import { Question } from '../types';
import { getQueueState, saveQueueState, getRecordByDate } from './storage';

export function todayKey(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function randomCount(): number {
  // 하루 2~3개 랜덤
  return Math.random() < 0.5 ? 2 : 3;
}

/**
 * 오늘 이미 질문을 뽑았다면 저장된 기록을 그대로 반환하고,
 * 아니라면 큐에서 새로 뽑아서 큐 상태를 갱신한다.
 * 큐는 50개 전체를 다 소진할 때까지 같은 질문이 나오지 않도록 보장한다.
 */
export async function getTodayQuestions(): Promise<Question[]> {
  const key = todayKey();

  // 오늘 이미 완료된 기록이 있으면 거기서 질문을 복원
  const existing = await getRecordByDate(key);
  if (existing && existing.answers.length > 0) {
    return existing.answers.map(a => {
      const found = QUESTIONS.find(q => q.id === a.questionId);
      return found ?? { id: a.questionId, category: 'general', text: a.questionText };
    });
  }

  let state = await getQueueState();
  if (!state || state.queue.length === 0) {
    state = {
      queue: shuffle(QUESTIONS.map(q => q.id)),
      lastCycleCompletedAt: null,
    };
  }

  const count = Math.min(randomCount(), state.queue.length);
  const pickedIds = state.queue.slice(0, count);
  const remaining = state.queue.slice(count);

  // 큐가 이번에 바닥났다면 다음을 위해 새로 섞어 채워둔다 (완전히 비워두지 않음)
  const nextQueue =
    remaining.length === 0 ? shuffle(QUESTIONS.map(q => q.id)) : remaining;

  await saveQueueState({
    queue: nextQueue,
    lastCycleCompletedAt: remaining.length === 0 ? new Date().toISOString() : state.lastCycleCompletedAt,
  });

  return pickedIds
    .map(id => QUESTIONS.find(q => q.id === id))
    .filter((q): q is Question => Boolean(q));
}
