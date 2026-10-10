export type QuestionCategory =
  | 'reminiscence' // 회상 (자서전적 기억)
  | 'orientation' // 지남력 (시간/장소/계절)
  | 'calculation' // 계산/논리
  | 'language' // 언어 유창성
  | 'family' // 가족/인간관계
  | 'daily' // 일상/감각
  | 'problem' // 문제 해결
  | 'general'; // 상식/화제

export interface Question {
  id: string; // 4자리 id, e.g. "0001"
  category: QuestionCategory;
  text: string;
}

export interface Answer {
  questionId: string;
  questionText: string;
  answerText: string;
}

export type MoodLevel = 1 | 2 | 3 | 4 | 5;

export interface MoodEntry {
  level: MoodLevel;
  label: string;
}

// 하루 단위 기록. dateKey는 'YYYY-MM-DD'
export interface DailyRecord {
  dateKey: string;
  answers: Answer[];
  mood: MoodEntry | null;
  completedAt: string; // ISO timestamp
}

// 남은 질문 순번을 저장하는 큐 상태
export interface QuestionQueueState {
  queue: string[]; // 아직 안 쓴 question id들 (섞인 순서)
  lastCycleCompletedAt: string | null;
}
