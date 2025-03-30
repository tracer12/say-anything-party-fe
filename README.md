### say-anything-party-fe
아무 말 대잔치 - 프론트엔드
https://github.com/tracer12/say-anything-party-fe

### say-anything-party-be
아무 말 대잔치 - 백엔드
https://github.com/tracer12/say-anything-party-be

### 사용법
1. git clone repository
2. install vscode live server
3. Open with live server(Go Live) : http://localhost:(port number)

### 실행화면
|로그인|회원가입|
|---|---|
|![Image](https://github.com/user-attachments/assets/2421365c-4278-489d-a670-01791dda54c8)|![Image](https://github.com/user-attachments/assets/d2620b4b-cdad-4e3f-b6f0-32e1b49f4c13)|

|게시글목록|게시글|댓글|
|---|---|---|
|![Image](https://github.com/user-attachments/assets/edbfb486-b69a-4900-b7ae-bc3c505e2e14)|![Image](https://github.com/user-attachments/assets/2343a519-8440-40d2-ad0d-125a01c982d7)|![Image](https://github.com/user-attachments/assets/600f9079-fa79-4c52-ba71-d89b0315c53b)|

|게시글작성|게시글수정|
|---|---|
|![Image](https://github.com/user-attachments/assets/a6a92b39-e607-4061-b269-c2345a00c495)|![Image](https://github.com/user-attachments/assets/28a2619e-20f9-41ce-928d-386f057f86ff)|

|게시글삭제|댓글삭제|
|---|---|
|![Image](https://github.com/user-attachments/assets/7244c961-5d30-47b7-8712-97dae1563bc0)|![Image](https://github.com/user-attachments/assets/93e72d24-3560-4b19-b172-5b9698773f82)|

|비밀번호변경|회원정보변경|
|---|---|
|![Image](https://github.com/user-attachments/assets/1e987d88-af09-4dff-8071-e9c1f7a3ce18)|![Image](https://github.com/user-attachments/assets/da2f8e53-191c-445c-9ce8-11bb25cd2d16)|


### 회고
- HTML, CSS, Vanilla JS만 사용하여 개발
    - 이번 프로젝트는 React 없이 순수 HTML, CSS, Vanilla JS로 개발을 진행하면서 프레임워크 없이 동적인 웹 애플리케이션을 만드는 과정의 어려움을 직접 체감한 경험이였다.

    - 컴포넌트 기반 개발이 아니라 DOM을 직접 조작해야 하는 점이 가장 큰 도전 과제였으며, 상태 관리와 이벤트 핸들링을 설계하는 것이 생각보다 까다로웠다.

    - React 같은 라이브러리의 필요성을 더 깊이 이해할 수 있었으며, Vanilla JS를 사용하면서 JavaScript의 기본 개념과 웹 동작 원리에 대한 이해도를 높이는 계기가 되었다.

- CSS 활용 및 유지보수
    - CSS만으로 디자인을 구성하면서 클래스 네이밍 규칙의 중요성을 체감했으며, 일관된 스타일 가이드를 유지하는 것이 쉽지 않음을 깨달았다.

    - 현재 진행 중인 JavaScript의 React화 과정에서 CSS 구조도 재정비하고 있으며, 스타일 유지보수를 쉽게 하기 위해 SCSS 도입도 고려 중이다.

- jwt 사용
    - JWT를 활용한 로그인 및 인증 과정을 구현하면서 보안과 토큰 관리에 대해 고민할 수 있었다.

    - 서버에서 발급한 accessToken을 이용한 사용자 인증 및 보호된 API 접근을 처리하는 데 성공했으나, accessToken 만료 시 자동으로 갱신하는 로직이 부족하다는 점이 아쉬웠다.

    - 현재 accessToken과 refreshToken을 모두 LocalStorage에 저장하고 있는데, 보안적인 측면에서 개선이 필요하다고 판단했다.

    - 추후 리팩토링 시 refreshToken을 HttpOnly 쿠키에 저장하고, accessToken 재발급 로직을 추가하여 보다 안전한 인증 흐름을 구축할 계획이다.

### 향후 계획
- 이번 프로젝트를 통해 Vanilla JS 기반 개발의 한계를 직접 경험하면서, 유지보수성과 확장성을 고려한 개발 방법론에 대한 고민이 깊어졌다.

    - 이 프로젝트에서 컴포넌트 기반 개발의 필요성을 체감하여, 현재 React 스타일로 JS 코드를 모듈화하고 SPA 형태로 전환하는 작업을 진행 중이다.

    - 또한 Express 서버를 활용하여 /login, /signup 같은 URL을 통해 화면을 전환할 수 있도록 개선중에 있으며, 클라이언트 측 라우팅을 구현하고 있다.

    - refreshToken을 적극 활용하여 JWT 기반 보안성 강화를 추구하고 최종적으로는 서버-클라이언트 간 API 설계를 최적화하고, 유지보수가 용이한 프론트엔드 구조를 완성하는 것이 목표이다.

### 느낀점
- 이번 프로젝트는 프레임워크 및 라이브러리의 소중함, 웹 개발의 본질적인 고민을 할 수 있는 계기가 되었다.
    