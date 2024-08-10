# 치지직 실시간 팔로워 카운트
이 프로젝트는 치지직 채널의 실시간 팔로워 수를 보여주는 프로젝트입니다.

## 사용 기술
- Next.js
- React-Query
- Tailwind CSS

## 실행 방법
1. 해당 프로젝트를 클론합니다.
```
git clone https://github.com/popop098/chzzkcounts.git
```
2. 프로젝트 폴더로 이동합니다.
```
cd chzzkcounts
```
3. 필요한 패키지를 설치합니다.
```
npm install
// or
yarn
```
4. 개발 서버를 실행합니다.
```
npm run dev
// or
yarn dev
```
5. 브라우저에서 `http://localhost:3000`으로 접속합니다.

## 데모
[치지직 실시간 팔로워 카운트](https://chzzkcounts.vercel.app/)

## 업데이트 내역
- 2024.08.09
  - 첫 릴리즈
- 2024.08.10
  - 데이터 갱신 주기를 `5`->`2`초로 변경
  - 카운팅 라이브러리를 `countup.js`->`react-odometer.js` 로 변경
  - 채널 라이브 유무에 따른 채널 이미지 border 및 LIVE 배지 추가
  - 검색 `<input/>`에 `Enter` 키 입력 시 검색 기능 추가

## TODO
- [ ] 카운트 업/다운에 따른 텍스트 색상 변경
- [ ] 메인 페이지 내 추천 채널 리스트 추가
- [ ] 채널 이미지 width, height 비율 유지

## 라이센스
MIT

## 사용된 치지직 API 레퍼
https://github.com/kimcore/chzzk

## 기여하기
이 프로젝트에 기여하고 싶으시다면, 이슈를 작성하거나 풀 리퀘스트를 보내주세요.
