# Interview Quest — Phone Setup Guide (Hindi/Hinglish)

## Pehle app ko apne phone par test karo

1. `Interview-Quest-v2.1.1.zip` download karo.
2. Android Files app mein ZIP kholo aur **Extract** karo.
3. Extracted folder mein `index.html`, `app.js`, `style.css`, `data/`, `docs/` aur `tests/` dikhne chahiye.
4. `index.html` ko directly open karne se question data load nahi ho sakta, kyunki app JSON files fetch karti hai. Isliye test ke liye app ko HTTP server se serve karna hoga ya GitHub Pages par publish karna hoga.

## GitHub Pages par publish karna

1. Chrome mein `https://github.com/Vikas915577/Interview-Quest` kholo aur login karo.
2. ZIP ko pehle extract karna zaroori hai. ZIP file ko seedha repository mein upload karne se Pages usse app ke roop mein unpack nahi karega.
3. Repository ke root mein extracted project ki files/folders upload karo. `index.html` root mein hona chahiye, aur `data/questions.json` exact path par hona chahiye.
4. Upload/commit ke baad **Settings → Pages** kholo.
5. **Build and deployment** ke andar **Deploy from a branch**, branch `main`, folder `/(root)` select karke save karo.
6. GitHub Pages ka status ready hone ke baad published URL kholo. Website ka path aam taur par `https://vikas915577.github.io/Interview-Quest/` hoga, lekin exact URL Settings → Pages se verify karo.
7. Pehli baar online kholo, phir refresh karo. Iske baad hi offline cache behaviour test karna.

## Agar phone par folder upload mushkil ho

GitHub ka mobile upload interface har Android/browser combination par folders ko ek saath upload karne mein aasaan nahi hota. Chrome ka **Desktop site** option try karo. Dhyaan rahe, `data/` ke andar dono JSON files aur root ke sab app assets upload hone chahiye. Agar folder structure preserve nahi hota, toh deployment par question bank load error aa sakta hai.

## App use kaise karein

1. Home se kisi practice module ya **Start today's practice** ko chuno.
2. Pehle apna jawab likho; phir **Reveal sample answer** dabao.
3. **I understand this** ya **Needs revision** chuno. Free-text ka automatic AI score is static release mein available nahi hai.
4. **Ask ChatGPT for feedback** se ChatGPT alag tab mein khul sakta hai. Agar prompt prefill na ho, toh **Copy coach prompt** dabakar ChatGPT mein paste karo.
5. Progress tab mein XP, attempts, streak aur weak topics check karo.
6. More section se backup export karo. Browser data clear karne se pehle backup rakhna achha hai.

## Known limitations

- Question bank abhi 155 questions ka hai; 1,000-question target future content batches mein complete karna hai.
- Progress isi browser/device mein local hoti hai; cross-device sync nahi.
- Real in-app AI grading/backend/accounts nahi hain.
- Phone screen, deployed GitHub Pages aur offline restart ka final test abhi pending hai. `docs/TEST_REPORT.md` mein exact status dekho.
