# Dumpling Riot — mobile release candidate preparation

Status: **source preparation**, not an approved, signed or device-tested store release. V48 adds a solo roguelite progression loop; the web release and native candidate share the same source. Proposed first store release: 1.0.0; development source 0.48.0. Proposed bundle identifier com.dumplingriot.game must be confirmed before registration (changing it after publication creates a different app).

## Build on Windows / Linux (Android)
1. Install Node.js 22+, Android Studio, JDK 21 and Android SDK 36; verify the current Play target requirement.
2. Run npm install (commit the resulting lockfile before production); npm run android:init; npm run check:mobile.
3. npm run android:open. Inspect targetSdk 36, applicationId, versionName/versionCode, launcher icon, landscape orientation, edge-to-edge and permissions. Build/run debug APK on a physical Android phone. Generate signed Android App Bundle in Android Studio for Play Console.
4. For later changes: npm run native:sync. Commit the generated android project once native settings are configured.

## Build on macOS (iOS)
1. Install Node.js 22+ and Xcode 26 or later, select its command-line tools. Use the Apple SDK required on submission date.
2. npm install; npm run ios:init; npm run check:mobile; npm run ios:open.
3. Configure signing team, app bundle identifier, version/build, supported orientations, app icons (opaque 1024x1024 master), required privacy manifest and deployment target. Commit generated ios project after settings are verified. Archive with Xcode and distribute using TestFlight/App Store Connect.
4. Validate on iPhone with notch/Dynamic Island, iPad if supported, interruption and foreground/background recovery. The native app bundles assets instead of loading a remote website.

## Release blockers / acceptance
- [ ] Install dependencies and commit package-lock.json; build native projects; validate final Android/iOS identifiers, signing and SDK.
- [ ] Generate native launcher icons (existing PWA icons are not a complete native asset catalog); verify rights and third-party licenses.
- [ ] Device QA: first launch in airplane mode, six heroes and arenas, each of 12 bosses, waves 1/3/7, shard awards, altar purchases, curse selection, ritual at wave 5, extraction at wave 10, corrupt save recovery, pause/resume, backgrounding, incoming call, touch controls, death/retry, record persistence, localization, notch and tablet layouts.
- [ ] Stress-test later waves and particles on lower-end Android; profile sustained frame time, memory and heat. No performance claims until measured.
- [ ] Test real two-device co-op, offline failure, room disconnect/reconnect; replace public demo TURN/signaling with production-capable infrastructure or omit online mode from store build until verified. Verify provider terms, data flow/retention and third-party disclosures.
- [ ] Confirm publisher's real identity and privacy contact; finalize privacy.html and public HTTPS URL, support contact, Apple privacy nutrition label and Google Data Safety. No ads/analytics planned for first version; do not claim no data collection without provider review.
- [ ] Complete honest age ratings for horror, fantasy violence and blood; no children category. Final ratings assigned by stores.
- [ ] Native screenshots, promotional graphics, short and full descriptions, support and privacy URLs.
- [ ] Developer enrollment and signing: Apple Developer Program, Play Console, EU trader declarations if applicable. TestFlight and Play internal test, closed test if account requires (12 testers for 14 continuous days for eligible new personal accounts), then review.

## Suggested store listing (draft)
Dumpling Riot — Pixel Horror Survival
Fight through six haunted arenas, choose one of six distinct heroes, upgrade your weapons, and survive waves of 24 enemy families and 12 bosses. Play solo offline or in optional co-op (online subject to release verification). 
No in-app purchases or ads in this source.

## Official references
- https://developer.apple.com/app-store/review/guidelines/
- https://developer.apple.com/app-store/submitting/
- https://support.google.com/googleplay/android-developer/answer/11926878
- https://support.google.com/googleplay/android-developer/answer/14151465
- https://capacitorjs.com/docs/getting-started

## V48 roguelite verification
Local rules checks executed: capped purchases, save normalization, sequential wave rewards, duplicate reward rejection, four contracts, ritual effects, extraction eligibility and repeat-settlement rejection. Browser/device playtest still required. Progression intentionally solo-only; co-op retains previous rules.
