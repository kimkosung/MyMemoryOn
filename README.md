# 매일의 기억 (DementiaCareApp)

할아버지를 위한 치매 예방용 기록 앱. React Native CLI + TypeScript.
매일 랜덤으로 2~3개의 질문에 답하고, 마지막에 오늘 기분을 기록합니다.
50개 질문 풀에서 "큐(queue)" 방식으로 뽑기 때문에, 50개를 다 쓰기 전까지는 같은 질문이 반복되지 않습니다.

---

## 1. 이 폴더에 들어있는 것

여기 담긴 건 **소스 코드(설정 파일 + src/ + App.tsx)** 입니다.
`ios/`, `android/` 네이티브 폴더는 포함되어 있지 않습니다 — 이건 실제 개발 환경(Xcode/Android Studio가 설치된 맥/윈도우 PC)에서
`react-native init`으로 생성해야 정상 동작하는 네이티브 프로젝트라서, 이 문서 작성 환경에서는 만들 수 없습니다.
아래 순서대로 하면 5분 안에 그대로 붙여넣어 실행할 수 있습니다.

## 2. 사전 준비 (최초 1회)

- Node.js 18 이상
- JDK 17
- Android: Android Studio + Android SDK (에뮬레이터 또는 실제 기기)
- iOS(맥 전용): Xcode + CocoaPods (`sudo gem install cocoapods`)
- 공식 가이드로 환경 점검: https://reactnative.dev/docs/set-up-your-environment (상단에서 **React Native CLI** 탭 선택, Expo 아님)

## 3. 프로젝트 생성 + 이 소스 붙여넣기

```bash
# 1) 네이티브 프로젝트 뼈대 생성 (React Native 0.75.4 기준)
npx @react-native-community/cli init DementiaCareApp --version 0.75.4
cd DementiaCareApp

# 2) 방금 생성된 폴더의 App.tsx, package.json, tsconfig.json, babel.config.js,
#    metro.config.js, app.json 을 이 zip 안의 같은 이름 파일로 덮어쓰세요.
#    src/ 폴더 전체를 이 zip에서 그대로 복사해 넣으세요.

# 3) 의존성 설치 (내비게이션 + 저장소)
npm install @react-navigation/native @react-navigation/native-stack \
  react-native-screens react-native-safe-area-context \
  @react-native-async-storage/async-storage

# iOS라면 추가로:
cd ios && pod install && cd ..
```

## 4. 실행

```bash
# 안드로이드
npx react-native run-android

# iOS (맥에서만)
npx react-native run-ios
```

에뮬레이터/실기기가 켜져 있어야 합니다. 실제 기기에 설치해서 할아버지께 드릴 때는
`npx react-native run-android --variant=release` 로 릴리즈 빌드를 만들거나,
Android Studio에서 `Build > Generate Signed Bundle/APK`로 APK를 추출해서 옮기는 것을 추천합니다.

## 5. 폴더 구조

```
src/
  types/            타입 정의 (Question, Answer, MoodEntry, DailyRecord ...)
  data/questions.ts 질문 50개 + 카테고리 라벨
  utils/
    storage.ts        AsyncStorage 읽기/쓰기
    dailyQuestions.ts 오늘의 질문 뽑기 로직 (큐 기반, 중복 방지)
  theme/            색상/폰트/간격 (큰 글씨, 고대비)
  components/
    BigButton.tsx     시니어용 큰 버튼
    MoodPicker.tsx    기분 이모지 선택
  screens/
    HomeScreen.tsx      오늘의 진입점
    QuestionScreen.tsx  질문 2~3개 순차 응답
    MoodScreen.tsx      기분 기록 + 저장
    HistoryScreen.tsx   지난 기록 리스트
  navigation/AppNavigator.tsx
```

## 6. 데이터는 어디에 저장되나요?

모든 기록은 기기 안의 AsyncStorage(로컬 저장소)에만 저장됩니다. 서버로 전송되지 않고,
앱을 지우면 함께 삭제됩니다. 나중에 기록을 따로 백업하고 싶다면
`getAllRecords()` (src/utils/storage.ts)로 전체 데이터를 꺼내 JSON으로 내보내는 기능을
추가로 붙일 수 있습니다.

## 7. 나중에 더 추가하면 좋은 것 (지금은 일부러 뺀 기능들)

- 음성 답변(STT) — 타이핑이 어려우실 때
- 매일 같은 시간에 알림 보내기 (react-native-push-notification 등)
- 답변 길이/속도 등을 보호자가 볼 수 있는 요약 통계 (치매 조기 신호는 의료진 판단이 필요하므로 "진단"이 아닌 "기록 공유" 용도로만)
- 글씨 크기 조절 옵션

지금 버전은 요청하신 대로 "쉽고 단순함"에 집중해서, 이 기능들은 전부 뺐습니다.
