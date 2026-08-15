SavelyCLOUD mobile client (Expo)

This is a minimal Expo-based React Native app that helps you pair a mobile device with the SavelyCLOUD server.

Overview
- `AuthWebView` opens the SavelyCLOUD web UI so you can sign in (cookies are stored by the WebView)
- `PairTester` allows you to create a local pairing token by calling `/api/local/pair` (the WebView must be used to authenticate first)

Requirements
- Node 18+, `npm` or `yarn`
- `expo-cli` installed globally (`npm i -g expo-cli`)
- The SavelyCLOUD server running and accessible (default: `http://127.0.0.1:8787`)

Run

```bash
cd mobile
npm install
npm start
# then open in Expo Go on Android, or run on emulator with `npm run android`
```

Notes
- The server uses cookie-based sessions. Sign in using the in-app WebView before creating a pairing link.
- Creating a pair token requires an authenticated user (the app relies on the WebView to manage cookies).
- This scaffold is minimal; for production you may want to implement OAuth flows or an API token exchange.
