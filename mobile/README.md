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

Production builds (AAB / APK)

This project uses EAS (Expo Application Services) to create production AABs/APKs.

1. Install EAS CLI and login to your Expo account:

```bash
npm install -g eas-cli
eas login
```

2. Configure credentials and build:

```bash
cd mobile
npm install
# Production AAB (recommended for Play Store)
npm run eas:build:android

# Development APK (quick internal build)
npm run eas:build:android:dev
```

3. Follow the prompts from `eas` to provide keystore credentials or let EAS manage them for you.

Notes:
- `eas.json` contains build profiles (`production` => AAB, `development` => APK).
- For Play Store uploads use the generated AAB; for local installs use the APK.
- If you need a signed release with your own keystore, supply the keystore details when prompted or use `eas credentials`.

CI / GitHub Actions

This repo includes a GitHub Actions workflow that triggers EAS builds when `mobile/` files change or when manually dispatched:

- Workflow path: [.github/workflows/eas-build.yml](.github/workflows/eas-build.yml)

Required repository secrets:
- `EXPO_TOKEN` — an Expo access token (create with `eas login` or from your Expo account settings).

Optional secrets for automated releases:
- `PLAY_STORE_PACKAGE_NAME` — the Android package name (e.g. com.example.app).
- `GOOGLE_PLAY_SERVICE_ACCOUNT_JSON` — JSON contents of a Google Play service account (for Play Store upload).

The CI workflow will:
- Run an EAS build and attempt to download the generated artifact.
- Create a GitHub Release and attach the artifact (if download succeeds).
- If `PLAY_STORE_PACKAGE_NAME` and `GOOGLE_PLAY_SERVICE_ACCOUNT_JSON` are provided, the workflow will also upload the AAB to the Play Store.

How it works:
- The workflow checks out the repo, installs Node and `eas-cli`, and runs `eas build` in `mobile/` using the `production` profile.
- EAS will prompt for credentials only if needed; with `--non-interactive` it uses stored or pre-configured credentials in your Expo account.


