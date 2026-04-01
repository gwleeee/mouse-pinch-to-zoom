# Mouse Pinch-To-Zoom

이 저장소는 원본 프로젝트인 [nizioleque/mouse-pinch-to-zoom](https://github.com/nizioleque/mouse-pinch-to-zoom)를 개인 사용 목적에 맞게 커스텀한 버전입니다.

브라우저 전체 UI를 확대하는 대신, 웹페이지 본문을 터치패드의 핀치 줌처럼 확대/축소할 수 있게 해줍니다.

## 주요 변경사항

- `Ctrl + 세로 휠`로 확장 프로그램의 커스텀 줌 동작
- `Ctrl + 휠 클릭(가운데 버튼)`으로 확대 배율 초기화
- `Ctrl + +`, `Ctrl + -`, `Ctrl + 0`은 Chrome 기본 브라우저 줌 유지
- 선형 확대 대신 비선형(cubic curve) 확대 반응 적용
- `Precise`, `Balanced`, `Aggressive` 확대 프리셋 추가
- 확대 상태에서 일반 세로 휠 스크롤 시 발생하던 버벅임/꿈틀거림 완화

## 동작 방식

이 확장은 Chrome의 기본 페이지 줌 API를 사용하는 대신, content script가 페이지에 직접 스케일 변환을 적용하는 방식으로 동작합니다.

그래서 다음과 같은 특징이 있습니다.

- 브라우저 탭, 주소창, 북마크 바 같은 Chrome UI는 확대되지 않음
- 웹페이지 콘텐츠만 확대/축소됨
- 마우스 커서 위치를 기준으로 확대 중심이 자연스럽게 유지됨

## 사용 방법

### 기본 조작

- `Ctrl + 세로 휠`: 페이지 콘텐츠 확대/축소
- `Ctrl + 휠 클릭`: 확장 프로그램 배율을 100%로 초기화
- `Ctrl + +`, `Ctrl + -`, `Ctrl + 0`: Chrome 기본 줌

### 확대 반응 프리셋

옵션 화면에서 다음 3가지 프리셋을 선택할 수 있습니다.

- `Precise`: 작은 휠 입력에서 더 세밀하게 반응
- `Balanced`: 정밀도와 속도의 균형이 맞는 기본값
- `Aggressive`: 큰 휠 입력에서 더 빠르게 반응

추가로 `Speed`, `Smoothness` 설정으로 확대 속도와 애니메이션 감각을 조절할 수 있습니다.

## 설치 방법

이 저장소는 Chrome 웹 스토어 배포본이 아니라 로컬에서 불러와 사용하는 커스텀 버전입니다.

1. 이 저장소를 클론하거나 다운로드합니다.
2. Chrome에서 `chrome://extensions` 로 이동합니다.
3. 오른쪽 위의 `개발자 모드`를 켭니다.
4. `압축해제된 확장 프로그램을 로드합니다`를 클릭합니다.
5. 이 저장소 폴더를 선택합니다.

코드를 수정한 뒤 다시 반영하려면 `chrome://extensions`에서 해당 확장의 새로고침 버튼을 누르면 됩니다.

## 옵션 화면

확장 아이콘을 클릭하면 옵션 화면을 열 수 있으며, 다음 항목을 설정할 수 있습니다.

- 확대 반응 프리셋
- 확대 속도(`Speed`)
- 확대 애니메이션 단계(`Smoothness`)
- 고정 요소/절대 위치 요소 관련 보정 옵션
- 터치패드 오작동 방지 옵션

## 수정한 문제

이 커스텀 버전에는 다음 수정이 포함되어 있습니다.

- `Ctrl + Wheel`이 Chrome 기본 확대보다 우선 적용되도록 입력 처리 변경
- `Ctrl` 키 단독 차단을 제거해 `Ctrl + +/-/0`은 기본 동작 유지
- 확대 상태에서 세로 휠 스크롤 시 페이지가 위아래로 꿈틀거리던 문제 완화
- 옵션 UI를 현재 커스텀 동작에 맞게 정리

## 제한 사항

보안 정책 때문에 다음 페이지에서는 동작하지 않습니다.

- Chrome 확장 페이지
- Chrome Web Store
- 브라우저 설정 페이지

기본 설정에서는 다음 환경에서도 동작하지 않을 수 있습니다.

- 시크릿 모드
- 로컬 파일(`file://`)

필요하면 확장 프로그램 설정에서 권한을 추가로 허용해야 합니다.

## 원본 프로젝트

- 원본 저장소: [nizioleque/mouse-pinch-to-zoom](https://github.com/nizioleque/mouse-pinch-to-zoom)
- Chrome Web Store: [Mouse Pinch-To-Zoom](https://chrome.google.com/webstore/detail/pffiadlahfhoniddbipeiiohjnlongfi)
- Firefox Add-ons: [Mouse Pinch-To-Zoom](https://addons.mozilla.org/en-US/firefox/addon/mouse-pinch-to-zoom/)

## 미리보기

https://user-images.githubusercontent.com/92390086/168915530-35dbd0d9-104e-417d-9d7e-2bfcdafd5893.mp4
