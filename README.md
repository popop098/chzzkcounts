# 치지직 실시간 팔로워 카운트
이 프로젝트는 치지직 채널의 실시간 팔로워 수를 보여주는 프로젝트입니다.

## 후원하기
<a href="https://www.buymeacoffee.com/popop098"><img src="https://img.buymeacoffee.com/button-api/?text=Donation&emoji=❤️&slug=popop098&button_colour=FFDD00&font_colour=000000&font_family=Poppins&outline_colour=000000&coffee_colour=ffffff" /></a>
- 사용하시는데에 불편함이 없으시도록 사이트내 광고를 게재하고 있지않습니다. 
- 대신 위 후원버튼을 통해 개발에 도움을 주시면 감사하겠습니다.
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
  - Search Box className 수정
  - OBS용 오버레이 추가
    - 색상 파라미터 추가
    - 라이브 여부 파라미터 추가
    - 오버레이 헬퍼 페이지 추가
- 2024.08.11
  - 검색시 검색결과값이 하나일경우 노출이 되지않고 `검색결과가 없습니다.` 텍스트가 출력되는 이슈 해결
  - 간헐적으로 특정 채널명을 입력하여 검색시 바로 `/counter`페이지로 이동하지 않는 이슈 해결
- 2024.08.13
  - 메인 페이지에 라이브 중인 추천 채널 리스트 추가
  - 간헐적으로 특정 채널의 이미지가 비율에 맞지않게 노출되는 이슈 해결
  - 팔로워 카운팅 페이지에 라이브 배지 애니메이션 추가
- 2024.08.13
  - 간헐적으로 프로필 이미지가 노출되지 않는 이슈 해결

## 오버레이 사용법
1. OBS에서 브라우저 소스 추가
2. URL에 `https://chzzkcounts.vercel.app/overlay/[자신의_채널_아이디]` 입력
3. 너비, 높이, 위치, 크기 등을 조절하여 사용
4. `?color=[색상명]`를 추가하여 텍스트 컬러를 조절할 수 있습니다.(옵션, 미입력시 기본 `white`사용)
   - 예시: `https://chzzkcounts.vercel.app/overlay/[자신의_채널_아이디]?color=red`
   - < 지원하는 색상 >
     - `red`
     - `green`
     - `blue`
     - `yellow`
     - `purple`
     - `pink`
     - `orange`
     - `cyan`
     - `gray`
     - `black`
     - `white` (기본값)
5. `?live=y`를 추가하여 라이브 중임을 표시할 수 있습니다.(옵션, 미입력시 기본 `y` 사용)
   - 예시: `https://chzzkcounts.vercel.app/overlay/[자신의_채널_아이디]?live=y`
6. 만일 두가지 옵션을 동시에 사용하고 싶다면 `&`를 사용하여 연결합니다.
   - 예시: `https://chzzkcounts.vercel.app/overlay/[자신의_채널_아이디]?color=red&live=y`
   
## 오버레이 헬퍼
- 위 사용법이 어렵다면 아래의 링크를 통해 간편하게 오버레이를 생성할 수 있습니다.
  - [치지직 실시간 팔로워 카운트 오버레이 헬퍼](https://chzzkcounts.vercel.app/ovlyhelper)
  - 혹은 메인 페이지 내에 `오버레이 생성` 버튼을 통하여 이동할 수 있습니다.


## TODO
- [ ] 카운트 업/다운에 따른 텍스트 색상 변경
- [x] 메인 페이지 내 추천 채널 리스트 추가
- [x] 채널 이미지 width, height 비율 유지

## 라이센스
MIT

## 사용된 치지직 API 레퍼
https://github.com/kimcore/chzzk

## 기여하기
이 프로젝트에 기여하고 싶으시다면, 이슈를 작성하거나 풀 리퀘스트를 보내주세요.
