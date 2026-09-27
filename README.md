# 🗳️ 투표 앱 (Vote App)

Claude Code + Matt Pocock Skill 수업 과제로 만든 실시간 투표 웹앱입니다.
Next.js(App Router)와 recharts로 만들었고, 투표 데이터는 브라우저 `localStorage`에 저장됩니다.

## 구현한 기능

1. **투표 마감 시간 설정** — `datetime-local` 입력으로 마감 시각을 지정하고, 남은 시간을
   1초 단위로 카운트다운합니다. 마감 시각이 지나면 자동으로 투표 버튼이 비활성화됩니다.
2. **투표 결과 그래프** — `recharts`의 막대그래프(Bar Chart)로 실시간 결과를 보여줍니다.
   선택지가 이산적(카테고리)이라 항목 간 득표수 비교가 목적이므로 막대그래프를 선택했습니다.
3. **화면에 이름 표시** — `app/page.js` 상단의 `MAKER_NAME` 값이 화면 헤더와 하단 footer에
   표시됩니다. **제출 전 본인 이름으로 바꿔주세요.**

## 로컬 실행

```bash
npm install
npm run dev
```

`http://localhost:3000` 에서 확인합니다.

## GitHub에 올리기

```bash
git init
git add .
git commit -m "feat: 투표 앱 초기 버전"
git branch -M main
git remote add origin https://github.com/<본인계정>/<repo-이름>.git
git push -u origin main
```

## Vercel 배포

1. https://vercel.com 에서 GitHub 계정으로 로그인합니다.
2. "Add New… → Project"에서 방금 push한 repository를 선택합니다.
3. Framework Preset이 자동으로 **Next.js**로 인식됩니다. 별도 환경변수 없이 바로 **Deploy**를
   누르면 됩니다.
4. 배포가 끝나면 `https://<프로젝트명>.vercel.app` 형태의 URL이 생성됩니다. 이 URL을
   제출물의 "배포 URL"로 제출하세요.

## 제출물

- GitHub Repository URL: `<여기에 push한 저장소 주소를 적으세요>`
- 배포 URL: `<여기에 Vercel 배포 주소를 적으세요>`
