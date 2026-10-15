# Interview Quest — Phone Setup Guide (Hindi/Hinglish)

## Pehle app ko apne phone par test karo

1. `Interview-Quest-v2.2.0-GitHub-Upload.zip` download karo.
2. Android Files app mein ZIP kholo aur **Extract** karo.
3. Extracted folder mein `index.html`, `app.js`, `style.css`, `questions.json`, `sources.json` aur `questions-extra.json` dikhne chahiye. Is upload package mein JSON root par hai taaki GitHub mobile upload mein folder flatten hone se load error na aaye.
4. `index.html` ko directly open karne se question data load nahi ho sakta, kyunki app JSON files fetch karti hai. Isliye test ke liye app ko HTTP server se serve karna hoga ya GitHub Pages par publish karna hoga.

## GitHub Pages par publish karna

1. Chrome mein `https://github.com/Vikas915577/Interview-Quest` kholo aur login karo.
2. ZIP ko pehle extract karna zaroori hai. ZIP file ko seedha repository mein upload karne se Pages usse app ke roop mein unpack nahi karega.
3. Repository ke root mein extracted project ki files/folders upload karo. `index.html` root mein hona chahiye, aur `questions.json` aur `sources.json` dono root par hone chahiye. Updated app nested `data/` layout ko bhi support karti hai.
4. Upload/commit ke baad **Settings → Pages** kholo.
5. **Build and deployment** ke andar **Deploy from a branch**, branch `main`, folder `/(root)` select karke save karo.
6. GitHub Pages ka status ready hone ke baad published URL kholo. Website ka path aam taur par `https://vikas915577.github.io/Interview-Quest/` hoga, lekin exact URL Settings → Pages se verify karo.
7. Pehli baar online kholo, phir refresh karo. Iske baad hi offline cache behaviour test karna.

## Agar phone par folder upload mushkil ho

GitHub ka mobile upload interface har Android/browser combination par folders ko ek saath upload karne mein aasaan nahi hota. Chrome ka **Desktop site** option try karo. Upload package mein root JSON aliases diye gaye hain; folder structure flat hone par bhi app question bank load kar sakti hai. Saari updated files ko ek hi commit mein replace/upload karo.

## App use kaise karein

1. Home se kisi practice module ya **Start today's practice** ko chuno.
2. Pehle apna jawab likho; phir **Reveal sample answer** dabao.
3. **I understand this** ya **Needs revision** chuno. Free-text ka automatic AI score is static release mein available nahi hai.
4. **Ask ChatGPT for feedback** se ChatGPT alag tab mein khul sakta hai. Agar prompt prefill na ho, toh **Copy coach prompt** dabakar ChatGPT mein paste karo.
5. Progress tab mein XP, attempts, streak aur weak topics check karo.
6. More section se backup export karo. Browser data clear karne se pehle backup rakhna achha hai.

## Known limitations

- Question bank abhi 227 questions ka hai; 1,000-question target future content batches mein complete karna hai.
- Progress isi browser/device mein local hoti hai; cross-device sync nahi.
- Real in-app AI grading/backend/accounts nahi hain.
- Phone screen, deployed GitHub Pages aur offline restart ka final test abhi pending hai. `docs/TEST_REPORT.md` mein exact status dekho.


## v2.2.0: Simpler UI, guided path aur load-error fallback

1. Practice tab kholo.
2. “Follow one learning path” mein topic aur 5 / 10 / all questions choose karo. App mein abhi 227 distinct questions hain, 12 learning tracks mein.
3. Start learning path dabao. Previous aur Next buttons se fixed order mein aage badho.
4. Question screen par “Read question” se browser awaaz mein question padhega. “Answer by voice” available browser par speech-to-text chala sakta hai.
5. Agar browser speech recognition support nahi karta, Android keyboard ke microphone button se answer dictate karo. Answer submit karne se pehle spelling check karo.
6. Agar purana “Load error” cache hua ho: site ko HTTPS par refresh karo; phir bhi issue ho toh Chrome Site settings mein storage/cache clear karke site dobara kholo. Clear karne se local progress erase ho sakti hai, isliye pehle backup export karna.


## Load error ko solve karne ke baad

- App nested `data/questions.json`/`data/sources.json` aur root `questions.json`/`sources.json` dono layouts try karti hai.
- Service-worker cache version `v2.2.0` hai; deployment ke baad site ko hard refresh karo. Agar error rahe, backup export karne ke baad Chrome site storage clear karke dobara kholo.
- Full AI voice conversation/free-text AI marking is static app mein nahi hai. Browser speech controls free hain; speech recognition browser/device par depend karti hai.

## UI v2.2.0 mein kya simpler hua

- Bottom navigation ab 4 items hai: Today, Learn, Mock, Progress. Settings top-right More mein hai.
- Home par ek primary Start practice action hai; question bank aur topics secondary shortcuts se milte hain.
- Question Bank mein advanced filters tabhi khulte hain jab user “Filters & sorting” expand kare.
- Question page par voice tools aur extra examples collapsed rehte hain jab tak user unhe na khole.
- Progress by topic, recent practice aur More settings expandable sections mein hain.
