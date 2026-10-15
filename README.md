# Interview Quest — Daily Practice

A mobile-first, static interview preparation app designed for GitHub Pages. It contains separate practice areas for telephonic interviews, HR, technical interviews, SQL, Excel/Power BI/Infor Birst, Python/Pandas, English confidence, full mock interviews and resume/project explanations.

## Features

- Responsive mobile-first interface
- Separate coaching prompts for 9 practice areas
- Buttons to open ChatGPT with a pre-filled prompt, or copy the prompt as a fallback
- Suggested questions and a 7-day quick-start roadmap
- XP, today's completion and streak tracking
- Progress stored locally in the browser using `localStorage`
- Basic offline caching through a service worker (works after the first successful load)
- No API key or backend required

## Important ChatGPT note

The app opens ChatGPT as a separate website; it does not embed ChatGPT's private logged-in interface. ChatGPT's `?q=` prompt-prefill behavior is not a documented public API and may change. If a prompt is not prefilled on your device, tap **Copy full prompt** in the app and paste it into a new ChatGPT chat. Signing in may be required to save ChatGPT conversations.

## Publish on GitHub Pages from a phone

1. Create a new public GitHub repository, for example `Interview-Quest`.
2. Upload all files and folders from this project (`index.html`, `style.css`, `app.js`, `manifest.webmanifest`, `sw.js`, `icon.svg`, `README.md`) to the repository root.
3. Open the repository's **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and `/ (root)`, then press **Save**.
5. Wait for GitHub Pages to publish, then open the website URL shown on the Pages screen.

## Local testing

Because service workers require localhost or HTTPS, run a small local server for full offline/PWA testing. For example:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Privacy

The app's progress is stored in the current browser/device only. It does not send practice history to a server. Clearing browser site data or switching browsers/devices can remove or separate progress. The app does not include an OpenAI API key and does not call the OpenAI API.
