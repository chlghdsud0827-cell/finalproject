## 환경 변수

- `VITE_KAKAO_MAP_APP_KEY`: "오시는 길"(`/location`)·"지점 안내"(`/branches`) 페이지 지도 표시에 사용. [카카오 디벨로퍼스](https://developers.kakao.com/)에서 발급받은 JavaScript 키를 `.env.local`에 설정해야 실제 지도가 표시됨(해당 앱의 플랫폼 설정 > Web에 사용 중인 도메인 등록 필요). 설정하지 않으면 placeholder 화면으로 대체됨.

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
