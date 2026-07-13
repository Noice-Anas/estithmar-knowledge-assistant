# مساعد مركز المعرفة | Estithmar Knowledge Assistant

A **bilingual (Arabic / English) AI chat demo** that answers questions grounded in the
[Estithmar Knowledge Center](https://estithmar.org.sa/knowledge-center/) — the public
research library of **شركة استثمار المستقبل للأوقاف والوصايا** (a Saudi *waqf* / Islamic
endowment & wills company).

It is a **static site** — it runs entirely in the browser and deploys to **GitHub Pages**
with no backend. It was built as a quick MVP to pitch the idea to the company.

> ⚠️ Unofficial demo. Answers are generated from a curated subset of public Knowledge
> Center content and are for demonstration only — not official or binding advice.

---

## ✨ What it does

- **Grounded answers ("mini‑RAG").** A curated set of ~15 real Knowledge Center articles is
  pre-scraped into `knowledge.json`. For every question the app ranks those passages in the
  browser and sends the most relevant ones to the model, which is instructed to answer
  **only** from them and to **decline** when the answer isn't covered.
- **Cited sources.** Every answer shows clickable chips linking back to the original
  estithmar.org.sa pages it drew from.
- **Bilingual UI.** One click toggles Arabic (RTL) ⇄ English (LTR). Answers come back in the
  selected language even though the source content is Arabic.
- **Chat history in cookies.** Your conversation is saved in a cookie on your device and
  restored on reload. You can **delete any single entry** (× in the sidebar) or **clear all**.
- **Bring‑your‑own key, two providers.** Pick **Google Gemini** (free tier) or **Anthropic
  Claude** in the settings dialog and paste that provider's key. Each key is stored in its own
  cookie on your device only — never committed to the repo or sent to any server of ours. You
  can switch providers any time from **⚙ Settings**; both keys are remembered.

---

## 🏗️ How it works (architecture)

```
┌─────────────────────── GitHub Pages (static) ───────────────────────┐
│  index.html · styles.css · app.js · config.js · knowledge.json      │
│                                                                     │
│   user question                                                     │
│        │                                                            │
│        ▼                                                            │
│   retrieve()  ── keyword-ranks knowledge.json chunks in-browser     │
│        │        (Arabic-normalised: strips harakat/tatweel, etc.)   │
│        ▼                                                            │
│   top passages + question + system rules                            │
└────────┬────────────────────────────────────────────────────────────┘
         │  HTTPS POST (key from cookie)
         ▼
   Gemini *or* Claude API  ──►  grounded, cited answer  ──►  rendered in chat
```

No server of ours sits in the middle: the browser calls the chosen provider's REST API directly,
using the key the visitor pasted (kept in a cookie). For Claude, the request adds the
`anthropic-dangerous-direct-browser-access` header — that's what allows the cross-origin call to
succeed from a static page.

### Files

| File | Purpose |
|------|---------|
| `index.html` | Chat UI, history sidebar, language toggle, API-key modal. |
| `styles.css` | Bilingual RTL/LTR styling, responsive, Estithmar green/gold theme. |
| `app.js` | All logic: i18n, cookies, retrieval, Gemini calls, message + history rendering. |
| `config.js` | Tweakable settings (model, `TOP_N`, cookie names). **No secrets.** |
| `knowledge.json` | Pre-built knowledge base (chunks with title + source URL). |
| `scripts/build-knowledge.mjs` | Regenerates `knowledge.json` from the curated article text. |
| `.nojekyll` | Tells GitHub Pages to serve files as-is. |

### The retrieval / grounding approach

Because there is no backend and no build-time key, retrieval is a **lightweight keyword
prefilter** rather than semantic embeddings:

1. `scripts/build-knowledge.mjs` splits each article into ~1200-character chunks tagged with
   `{ title_ar, title_en, url }`.
2. In the browser, `retrieve()` normalises Arabic (removes diacritics/tatweel, unifies
   alef/ya/ta-marbuta), tokenises the question, and scores each chunk (title matches weighted
   higher). The top `TOP_N` (default 6) chunks are sent to Gemini.
3. The system prompt forces the model to answer only from those chunks and to cite them.

This keeps everything static and free. A natural upgrade — noted below — is real semantic
search using embeddings.

---

## 🚀 Run it locally

Any static file server works (needed so `fetch('knowledge.json')` succeeds — opening the
file directly with `file://` will be blocked by the browser).

```bash
# from the project folder
python3 -m http.server 8000
# then open http://localhost:8000
```

On first load you'll be asked for a Gemini key (see below).

---

## 🔑 Get an API key

The setup dialog lets you choose a provider. Pick whichever you have a key for.

**Option A — Google Gemini (free):**
1. Go to **Google AI Studio → API keys**: <https://aistudio.google.com/app/apikey>
2. Sign in with a Google account and click **Create API key** (the free tier is enough for a demo).
   If you hit a `429 / quota tier unavailable` error, create the key in a **new/default** project or enable billing.
3. Copy the key (starts with `AIza…`), paste it into the dialog (with **Google Gemini** selected), and click **Save**.

**Option B — Anthropic Claude:**
1. Go to **Anthropic Console → API keys**: <https://console.anthropic.com/settings/keys>
2. Create a key (starts with `sk-ant-…`). Claude is **paid** (no free tier) — you need credit on the account.
3. Select **Anthropic Claude** in the dialog, paste the key, and click **Save**.

Each key is stored in its own cookie on your device. Switch providers or delete a key any time from **⚙ Settings**.

> The Claude model defaults to `claude-opus-4-8`. To lower cost, change `PROVIDERS.claude.model` in
> `config.js` to `claude-haiku-4-5` or `claude-sonnet-5`.

---

## 🌐 Deploy to GitHub Pages

1. Create a new GitHub repository and push these files to the **`main`** branch:
   ```bash
   git init
   git add .
   git commit -m "Estithmar Knowledge Assistant demo"
   git branch -M main
   git remote add origin https://github.com/<you>/<repo>.git
   git push -u origin main
   ```
   *(These git commands are yours to run when you're ready — nothing is committed automatically.)*
2. On GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch**,
   choose **`main`** and folder **`/ (root)`**, then **Save**.
3. Wait ~1 minute, then open the published URL
   `https://<you>.github.io/<repo>/`.
4. Open the site, paste a Gemini key, and ask a question.

---

## 🔧 Customize

- **Change the knowledge base:** edit the article text in `scripts/build-knowledge.mjs`
  (or add new `{ slug, title_ar, title_en, url, text }` entries), then run
  `node scripts/build-knowledge.mjs` to regenerate `knowledge.json`.
- **Model / retrieval depth / cookie settings:** edit `config.js` (`MODEL`, `TOP_N`, etc.).
- **Theme:** edit the CSS variables at the top of `styles.css`.

---

## ⚠️ Notes & limitations (it's an MVP)

- **The key lives in the browser cookie.** That's fine for a controlled demo where the
  presenter uses their own free key. For a public production deployment, put the key behind a
  small serverless proxy (e.g. a free Cloudflare Worker) so it's never exposed — the frontend
  wouldn't need to change, only the API base URL.
- **Cookies are ~4KB.** Chat history is trimmed automatically (oldest messages dropped) to fit.
  For unlimited history, switch storage to `localStorage`/IndexedDB.
- **Retrieval is keyword-based**, not semantic. Good enough for a curated demo; upgrade to
  embeddings for larger corpora or fuzzier questions.
- **CORS:** the Gemini REST API is called directly from the browser. If a network/region ever
  blocks that, route the call through a tiny proxy (see the key note above).

---

## 🙏 Content

All knowledge content belongs to **Estithmar (شركة استثمار المستقبل للأوقاف والوصايا)** and is
excerpted from their public Knowledge Center for this demonstration:
<https://estithmar.org.sa/knowledge-center/>
