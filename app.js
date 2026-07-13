/* ============================================================
   Estithmar Knowledge Assistant — app.js
   Static, no backend. Gemini key + chat history live in cookies.
   ============================================================ */
(function () {
  "use strict";
  const CFG = window.ESTITHMAR_CONFIG;

  /* ---------- i18n ---------- */
  const I18N = {
    ar: {
      dir: "rtl",
      htmlLang: "ar",
      langSwitch: "English",
      brandTitle: "مساعد مركز المعرفة",
      brandSubtitle: "استثمار المستقبل للأوقاف والوصايا",
      historyTitle: "المحادثة",
      clearAll: "مسح الكل",
      historyEmpty: "لا توجد رسائل محفوظة بعد.",
      historyNote: "يتم حفظ المحادثة في ملفات تعريف الارتباط (الكوكيز) على جهازك فقط.",
      settings: "الإعدادات",
      disclaimer:
        "نموذج تجريبي غير رسمي لأغراض العرض — يعتمد على مقتطفات من مركز المعرفة العام.",
      welcomeTitle: "اسأل عن الأوقاف والوصايا",
      welcomeBody:
        "أجيب اعتمادًا على محتوى مركز المعرفة في شركة استثمار المستقبل، مع الإشارة إلى مصادر الإجابة.",
      inputPlaceholder: "اكتب سؤالك هنا...",
      send: "إرسال",
      poweredBy: "مدعوم بـ {provider} — مفتاحك محفوظ في جهازك فقط.",
      modalTitle: "إعداد مفتاح الذكاء الاصطناعي",
      modalBody:
        "اختر مزوّد الذكاء الاصطناعي وأدخل مفتاحه. يُحفظ المفتاح في ملفات تعريف الارتباط على جهازك فقط ولا يُرسل إلى أي خادم تابع لنا.",
      providerLabel: "مزوّد الذكاء الاصطناعي",
      providerFree: "مجاني",
      getKeyLinkGemini: "احصل على مفتاح مجاني من Google AI Studio ↗",
      getKeyLinkClaude: "احصل على مفتاح من Anthropic Console ↗",
      apiKeyPlaceholder: "ألصق المفتاح هنا",
      clearKey: "حذف المفتاح",
      cancel: "إلغاء",
      save: "حفظ",
      sourcesLabel: "المصادر:",
      thinking: "يبحث في مركز المعرفة...",
      errNoKey: "يرجى إدخال مفتاح Gemini أولًا.",
      errInvalidKey: "المفتاح غير صحيح أو لا يملك صلاحية. تأكد من نسخه كاملًا من صفحة المزوّد.",
      errRate:
        "تم رفض الطلب بسبب تجاوز حصة الطلبات (Quota) في Gemini. إذا كان المفتاح جديدًا فغالبًا لا توجد حصة مجانية مخصصة لهذا المشروع بعد — أنشئ مفتاحًا في مشروع جديد/افتراضي في Google AI Studio أو فعّل الفوترة (Billing) على المشروع. وإن لم يكن المفتاح جديدًا فانتظر دقيقة ثم أعد المحاولة.",
      errNetwork:
        "تعذّر الاتصال بخدمة Gemini. تحقق من الاتصال بالإنترنت وحاول مجددًا.",
      errGeneric: "حدث خطأ غير متوقع. حاول مرة أخرى.",
      keySaved: "تم حفظ المفتاح. يمكنك بدء المحادثة الآن.",
      confirmClear: "هل تريد مسح كامل المحادثة؟",
      suggestions: [
        "ما الفرق بين الوقف الخيري والذري في الزكاة؟",
        "هل تخضع الأوقاف لضريبة القيمة المضافة؟",
        "كيف تؤثر الوصية على قسمة التركة؟",
        "ما دور الأوقاف في تنمية الجامعات؟",
      ],
    },
    en: {
      dir: "ltr",
      htmlLang: "en",
      langSwitch: "العربية",
      brandTitle: "Knowledge Center Assistant",
      brandSubtitle: "Estithmar — Endowments & Wills",
      historyTitle: "Conversation",
      clearAll: "Clear all",
      historyEmpty: "No saved messages yet.",
      historyNote: "Your conversation is stored only in cookies on this device.",
      settings: "Settings",
      disclaimer:
        "Unofficial demo for presentation — grounded in excerpts from the public Knowledge Center.",
      welcomeTitle: "Ask about endowments & wills",
      welcomeBody:
        "I answer from the Estithmar Knowledge Center content and cite the sources I used.",
      inputPlaceholder: "Type your question...",
      send: "Send",
      poweredBy: "Powered by {provider} — your key stays on your device.",
      modalTitle: "Set up your AI key",
      modalBody:
        "Choose an AI provider and enter its key. The key is stored in a cookie on your device only and is never sent to any server of ours.",
      providerLabel: "AI provider",
      providerFree: "Free",
      getKeyLinkGemini: "Get a free key from Google AI Studio ↗",
      getKeyLinkClaude: "Get an API key from Anthropic Console ↗",
      apiKeyPlaceholder: "Paste your key here",
      clearKey: "Delete key",
      cancel: "Cancel",
      save: "Save",
      sourcesLabel: "Sources:",
      thinking: "Searching the Knowledge Center...",
      errNoKey: "Please enter your Gemini key first.",
      errInvalidKey:
        "That key looks invalid or lacks permission. Make sure you copied it fully from the provider's page.",
      errRate:
        "The request was rejected because Gemini's request quota was exceeded. If the key is new, this project likely has no free-tier quota assigned yet — create a key in a new/default project in Google AI Studio, or enable billing on the project. If the key isn't new, wait a minute and try again.",
      errNetwork:
        "Couldn't reach the Gemini service. Check your connection and retry.",
      errGeneric: "Something went wrong. Please try again.",
      keySaved: "Key saved. You can start chatting now.",
      confirmClear: "Clear the entire conversation?",
      suggestions: [
        "How is zakat treated for charitable vs. family waqf?",
        "Are endowments subject to VAT in Saudi Arabia?",
        "How does a will affect estate division?",
        "What role do endowments play in universities?",
      ],
    },
  };

  /* ---------- Cookie helpers ---------- */
  function setCookie(name, value, days) {
    const maxAge = days * 24 * 60 * 60;
    document.cookie =
      name +
      "=" +
      encodeURIComponent(value) +
      ";path=/;max-age=" +
      maxAge +
      ";SameSite=Strict";
  }
  function getCookie(name) {
    const match = document.cookie.match(
      "(?:^|; )" + name.replace(/([.$?*|{}()[\]\\/+^])/g, "\\$1") + "=([^;]*)"
    );
    return match ? decodeURIComponent(match[1]) : null;
  }
  function deleteCookie(name) {
    document.cookie = name + "=;path=/;max-age=0;SameSite=Strict";
  }

  /* ---------- State ---------- */
  const state = {
    lang: getCookie(CFG.COOKIE_LANG) === "en" ? "en" : "ar",
    provider: CFG.PROVIDERS[getCookie(CFG.COOKIE_PROVIDER)]
      ? getCookie(CFG.COOKIE_PROVIDER)
      : CFG.DEFAULT_PROVIDER,
    keys: {
      gemini: getCookie(CFG.COOKIE_KEY_GEMINI) || "",
      claude: getCookie(CFG.COOKIE_KEY_CLAUDE) || "",
    },
    modalProvider: CFG.DEFAULT_PROVIDER, // provider currently shown in the modal
    records: [],
    turns: loadHistory(), // [{id,q,a,sources,ts}]
    busy: false,
  };
  let turnSeq = state.turns.reduce((m, t) => Math.max(m, t.id || 0), 0);

  function providerKeyCookie(p) {
    return p === "claude" ? CFG.COOKIE_KEY_CLAUDE : CFG.COOKIE_KEY_GEMINI;
  }
  function currentKey() {
    return state.keys[state.provider] || "";
  }

  /* ---------- DOM ---------- */
  const $ = (id) => document.getElementById(id);
  const el = {
    html: document.documentElement,
    app: $("app"),
    chat: $("chat"),
    welcome: $("welcome"),
    suggestions: $("suggestions"),
    form: $("composerForm"),
    input: $("input"),
    sendBtn: $("sendBtn"),
    langToggle: $("langToggle"),
    settingsBtn: $("settingsBtn"),
    menuToggle: $("menuToggle"),
    poweredBy: $("poweredBy"),
    historyList: $("historyList"),
    historyEmpty: $("historyEmpty"),
    clearHistoryBtn: $("clearHistoryBtn"),
    // modal
    backdrop: $("modalBackdrop"),
    providerSelect: $("providerSelect"),
    apiKeyInput: $("apiKeyInput"),
    modalError: $("modalError"),
    getKeyLink: $("getKeyLink"),
    saveKeyBtn: $("saveKeyBtn"),
    clearKeyBtn: $("clearKeyBtn"),
    modalCancel: $("modalCancel"),
  };

  function t(key) {
    return I18N[state.lang][key];
  }

  /* ---------- Language ---------- */
  function applyLanguage() {
    const L = I18N[state.lang];
    el.html.setAttribute("lang", L.htmlLang);
    el.html.setAttribute("dir", L.dir);
    document.querySelectorAll("[data-i18n]").forEach((node) => {
      const val = L[node.getAttribute("data-i18n")];
      if (typeof val === "string") node.textContent = val;
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
      const val = L[node.getAttribute("data-i18n-placeholder")];
      if (val) node.setAttribute("placeholder", val);
    });
    document.querySelectorAll("[data-i18n-title]").forEach((node) => {
      const val = L[node.getAttribute("data-i18n-title")];
      if (val) node.setAttribute("title", val);
    });
    updateComposerHint();
    if (!el.backdrop.hidden) selectModalProvider(state.modalProvider);
    renderSuggestions();
    renderChat();
    renderHistory();
  }

  function updateComposerHint() {
    if (el.poweredBy) {
      el.poweredBy.textContent = t("poweredBy").replace(
        "{provider}",
        CFG.PROVIDERS[state.provider].label
      );
    }
  }

  function toggleLanguage() {
    state.lang = state.lang === "ar" ? "en" : "ar";
    setCookie(CFG.COOKIE_LANG, state.lang, CFG.COOKIE_DAYS);
    applyLanguage();
  }

  function renderSuggestions() {
    el.suggestions.innerHTML = "";
    t("suggestions").forEach((s) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "suggestion";
      b.textContent = s;
      b.addEventListener("click", () => {
        el.input.value = s;
        el.form.requestSubmit();
      });
      el.suggestions.appendChild(b);
    });
  }

  /* ---------- Knowledge base ---------- */
  async function loadKnowledge() {
    try {
      const res = await fetch(CFG.KNOWLEDGE_URL, { cache: "no-cache" });
      const data = await res.json();
      state.records = data.records || [];
    } catch (e) {
      console.error("Failed to load knowledge base", e);
      state.records = [];
    }
  }

  /* ---------- Retrieval ---------- */
  const AR_STOPWORDS = new Set(
    "من في عن على الى إلى ما هل ماهو ماهي هو هي و او أو ثم اذا إذا كان كانت التي الذي هذا هذه ذلك مع بين عند كل بعض غير قد لا نعم اي أي كيف متى اين أين لماذا هنا هناك بها به بها فيها منها عنها لها له".split(
      /\s+/
    )
  );
  const EN_STOPWORDS = new Set(
    "the a an of to in on for and or is are was were what how why when where which that this these those do does with about between as by at be it its".split(
      /\s+/
    )
  );

  function normalize(str) {
    return str
      .toLowerCase()
      .replace(/[ً-ْـ]/g, "") // harakat + tatweel
      .replace(/[أإآٱ]/g, "ا")
      .replace(/ى/g, "ي")
      .replace(/ة/g, "ه")
      .replace(/ؤ/g, "و")
      .replace(/ئ/g, "ي")
      .replace(/[^\p{L}\p{N}\s]/gu, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function tokenize(str) {
    return normalize(str)
      .split(" ")
      .filter((w) => w.length > 1 && !AR_STOPWORDS.has(w) && !EN_STOPWORDS.has(w));
  }

  // Pre-normalize records once for scoring.
  function indexRecords() {
    state.records.forEach((r) => {
      r._body = normalize(r.text);
      r._title = normalize((r.title_ar || "") + " " + (r.title_en || ""));
    });
  }

  function retrieve(question) {
    const qTokens = tokenize(question);
    if (!qTokens.length) return [];
    const scored = state.records.map((r) => {
      let score = 0;
      qTokens.forEach((tok) => {
        // count occurrences in body (bounded) + heavier weight for title match
        const bodyHits = r._body.split(tok).length - 1;
        if (bodyHits) score += Math.min(bodyHits, 3);
        if (r._title.indexOf(tok) !== -1) score += 4;
      });
      return { r, score };
    });
    return scored
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, CFG.TOP_N)
      .map((s) => s.r);
  }

  /* ---------- Gemini ---------- */
  function buildSystemInstruction() {
    const langName = state.lang === "ar" ? "العربية" : "English";
    return (
      "You are the knowledge assistant for Estithmar (شركة استثمار المستقبل للأوقاف والوصايا), " +
      "a Saudi company specialized in waqf (Islamic endowments) and wills. " +
      "You answer questions using ONLY the provided excerpts from the company's public Knowledge Center. " +
      "Rules:\n" +
      "1. Base every factual claim strictly on the provided sources. Do NOT invent facts, numbers, names, or rulings.\n" +
      "2. If the provided sources do not contain the answer, say so honestly and invite the user to visit the Knowledge Center (" +
      CFG.KNOWLEDGE_CENTER_URL +
      "). Do not guess.\n" +
      "3. Reply in " +
      langName +
      " regardless of the language of the sources. Be clear, well-structured, and concise.\n" +
      "4. When helpful, use short paragraphs or bullet points. You may cite source titles inline.\n" +
      "5. This is an unofficial demo; present information and cite sources rather than issuing binding legal or religious rulings.\n" +
      "6. Do not answer questions unrelated to endowments, wills, or the Knowledge Center's scope."
    );
  }

  function buildContextBlock(chunks) {
    if (!chunks.length) return "(No matching excerpts were found in the Knowledge Center.)";
    return chunks
      .map((c, i) => {
        const title = state.lang === "ar" ? c.title_ar : c.title_en;
        return (
          "[" +
          (i + 1) +
          "] " +
          title +
          " — " +
          c.url +
          "\n" +
          c.text
        );
      })
      .join("\n\n---\n\n");
  }

  // The user turn sent to whichever provider: retrieved excerpts + the question.
  function buildUserText(question, chunks) {
    return (
      "Knowledge Center excerpts:\n\n" +
      buildContextBlock(chunks) +
      "\n\n====\n\nUser question: " +
      question
    );
  }

  // Dispatch to the active provider.
  function askProvider(question, chunks) {
    return state.provider === "claude"
      ? askClaude(question, chunks)
      : askGemini(question, chunks);
  }

  async function askGemini(question, chunks) {
    const model = CFG.PROVIDERS.gemini.model;
    const url =
      CFG.GEMINI_API_BASE +
      "/" +
      model +
      ":generateContent?key=" +
      encodeURIComponent(state.keys.gemini);

    // Light multi-turn memory: include up to the last 3 exchanges for follow-ups.
    const history = [];
    state.turns.slice(-3).forEach((turn) => {
      if (turn.q) history.push({ role: "user", parts: [{ text: turn.q }] });
      if (turn.a) history.push({ role: "model", parts: [{ text: turn.a }] });
    });

    const userText = buildUserText(question, chunks);

    const body = {
      system_instruction: { parts: [{ text: buildSystemInstruction() }] },
      contents: history.concat([{ role: "user", parts: [{ text: userText }] }]),
      generationConfig: { temperature: 0.3, maxOutputTokens: 1024, topP: 0.9 },
    };

    let res;
    try {
      res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } catch (e) {
      throw { kind: "network" };
    }

    if (!res.ok) {
      let msg = "";
      try {
        const err = await res.json();
        msg = (err.error && err.error.message) || "";
      } catch (e) {}
      if (res.status === 400 || res.status === 401 || res.status === 403) {
        if (/API key|API_KEY|permission|invalid/i.test(msg))
          throw { kind: "invalidKey" };
      }
      if (res.status === 429) throw { kind: "rate", detail: msg };
      throw { kind: "generic", detail: msg };
    }

    const data = await res.json();
    const cand = data.candidates && data.candidates[0];
    if (!cand || !cand.content || !cand.content.parts)
      throw { kind: "generic", detail: "empty response" };
    return cand.content.parts.map((p) => p.text || "").join("").trim();
  }

  async function askClaude(question, chunks) {
    // Anthropic messages must alternate user/assistant and start with user.
    const messages = [];
    state.turns.slice(-3).forEach((turn) => {
      if (turn.q) messages.push({ role: "user", content: turn.q });
      if (turn.a) messages.push({ role: "assistant", content: turn.a });
    });
    messages.push({ role: "user", content: buildUserText(question, chunks) });

    const body = {
      model: CFG.PROVIDERS.claude.model,
      max_tokens: CFG.CLAUDE_MAX_TOKENS,
      system: buildSystemInstruction(),
      messages: messages,
      // No temperature/top_p — those are rejected by the latest Claude models.
    };

    let res;
    try {
      res = await fetch(CFG.CLAUDE_API_URL, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": state.keys.claude,
          "anthropic-version": CFG.CLAUDE_VERSION,
          // Required to allow the call directly from a browser (CORS).
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify(body),
      });
    } catch (e) {
      throw { kind: "network" };
    }

    if (!res.ok) {
      let msg = "";
      try {
        const err = await res.json();
        msg = (err.error && err.error.message) || "";
      } catch (e) {}
      if (res.status === 401 || res.status === 403) throw { kind: "invalidKey" };
      if (res.status === 400 && /credit|billing|x-api-key|api key|api_key/i.test(msg))
        throw { kind: "invalidKey" };
      if (res.status === 429) throw { kind: "rate", detail: msg };
      throw { kind: "generic", detail: msg };
    }

    const data = await res.json();
    const text = (data.content || [])
      .filter((b) => b.type === "text")
      .map((b) => b.text || "")
      .join("")
      .trim();
    if (!text) throw { kind: "generic", detail: "empty response" };
    return text;
  }

  /* ---------- Rendering ---------- */
  function escapeHtml(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  // Minimal, safe markdown: **bold**, bullet lists, numbered lists, paragraphs.
  function renderMarkdown(text) {
    const lines = escapeHtml(text).split(/\n/);
    let html = "";
    let listType = null; // 'ul' | 'ol'
    const closeList = () => {
      if (listType) {
        html += "</" + listType + ">";
        listType = null;
      }
    };
    let paragraph = [];
    const flushPara = () => {
      if (paragraph.length) {
        html += "<p>" + paragraph.join("<br>") + "</p>";
        paragraph = [];
      }
    };
    lines.forEach((raw) => {
      let line = raw.trim();
      line = line.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
      const bullet = line.match(/^[-*•]\s+(.*)$/);
      const numbered = line.match(/^\d+[.)]\s+(.*)$/);
      if (bullet) {
        flushPara();
        if (listType !== "ul") {
          closeList();
          html += "<ul>";
          listType = "ul";
        }
        html += "<li>" + bullet[1] + "</li>";
      } else if (numbered) {
        flushPara();
        if (listType !== "ol") {
          closeList();
          html += "<ol>";
          listType = "ol";
        }
        html += "<li>" + numbered[1] + "</li>";
      } else if (line === "") {
        flushPara();
        closeList();
      } else {
        closeList();
        paragraph.push(line);
      }
    });
    flushPara();
    closeList();
    return html || "<p></p>";
  }

  function makeMessage(role, contentHtml, sources) {
    const wrap = document.createElement("div");
    wrap.className = "msg msg--" + (role === "user" ? "user" : "bot");
    const avatar = document.createElement("div");
    avatar.className = "msg__avatar";
    avatar.textContent = role === "user" ? "؟" : "و";
    const bodyWrap = document.createElement("div");
    bodyWrap.className = "msg__body";
    const bubble = document.createElement("div");
    bubble.className = "msg__bubble";
    bubble.innerHTML = contentHtml;
    bodyWrap.appendChild(bubble);

    if (sources && sources.length) {
      const src = document.createElement("div");
      src.className = "sources";
      const label = document.createElement("span");
      label.className = "sources__label";
      label.textContent = t("sourcesLabel");
      src.appendChild(label);
      sources.forEach((s) => {
        const a = document.createElement("a");
        a.className = "source-chip";
        a.href = s.url;
        a.target = "_blank";
        a.rel = "noopener";
        a.textContent = state.lang === "ar" ? s.title_ar : s.title_en;
        src.appendChild(a);
      });
      bodyWrap.appendChild(src);
    }

    wrap.appendChild(avatar);
    wrap.appendChild(bodyWrap);
    return wrap;
  }

  function dedupeSources(chunks) {
    const seen = new Set();
    const out = [];
    chunks.forEach((c) => {
      if (!seen.has(c.url)) {
        seen.add(c.url);
        out.push({ url: c.url, title_ar: c.title_ar, title_en: c.title_en });
      }
    });
    return out;
  }

  function renderChat() {
    // Clear all messages but keep welcome node reference.
    el.chat.innerHTML = "";
    if (!state.turns.length) {
      el.chat.appendChild(el.welcome);
      el.welcome.hidden = false;
      return;
    }
    state.turns.forEach((turn) => {
      el.chat.appendChild(makeMessage("user", escapeHtml(turn.q)));
      if (turn.a || turn.sources) {
        el.chat.appendChild(
          makeMessage("bot", renderMarkdown(turn.a || ""), turn.sources)
        );
      }
    });
    scrollToBottom();
  }

  function scrollToBottom() {
    requestAnimationFrame(() => {
      el.chat.scrollTop = el.chat.scrollHeight;
    });
  }

  function showTyping() {
    const wrap = makeMessage(
      "bot",
      '<div class="typing"><span></span><span></span><span></span></div>'
    );
    wrap.id = "typingMsg";
    el.chat.appendChild(wrap);
    scrollToBottom();
  }
  function removeTyping() {
    const node = $("typingMsg");
    if (node) node.remove();
  }

  /* ---------- History (cookie-persisted) ---------- */
  function loadHistory() {
    try {
      const raw = getCookie(CFG.COOKIE_HISTORY);
      if (!raw) return [];
      const arr = JSON.parse(raw);
      // stored compact: {i,q,a,s:[{t_ar,t_en,u}],ts}
      return arr.map((o) => ({
        id: o.i,
        q: o.q,
        a: o.a,
        ts: o.ts,
        sources: (o.s || []).map((s) => ({
          url: s.u,
          title_ar: s.a,
          title_en: s.e,
        })),
      }));
    } catch (e) {
      return [];
    }
  }

  function serializeHistory(turns) {
    return JSON.stringify(
      turns.map((tn) => ({
        i: tn.id,
        q: tn.q,
        a: tn.a,
        ts: tn.ts,
        s: (tn.sources || []).map((s) => ({
          u: s.url,
          a: s.title_ar,
          e: s.title_en,
        })),
      }))
    );
  }

  function saveHistory() {
    // Trim oldest turns until the serialized cookie fits the byte budget.
    let turns = state.turns.slice();
    let payload = serializeHistory(turns);
    while (
      turns.length > 1 &&
      encodeURIComponent(payload).length > CFG.HISTORY_MAX_BYTES
    ) {
      turns.shift();
      payload = serializeHistory(turns);
    }
    // If even a single turn is too big, truncate its stored answer.
    if (encodeURIComponent(payload).length > CFG.HISTORY_MAX_BYTES && turns.length === 1) {
      const only = Object.assign({}, turns[0]);
      only.a = (only.a || "").slice(0, 400) + "…";
      turns = [only];
      payload = serializeHistory(turns);
    }
    state.turns = turns;
    setCookie(CFG.COOKIE_HISTORY, payload, CFG.COOKIE_DAYS);
  }

  function renderHistory() {
    el.historyList.innerHTML = "";
    if (!state.turns.length) {
      el.historyEmpty.hidden = false;
      return;
    }
    el.historyEmpty.hidden = true;
    // Newest first in the sidebar.
    state.turns
      .slice()
      .reverse()
      .forEach((turn) => {
        const item = document.createElement("div");
        item.className = "history__item";
        item.setAttribute("role", "listitem");

        const q = document.createElement("div");
        q.className = "history__q";
        q.textContent = turn.q;
        q.addEventListener("click", () => {
          closeSidebarMobile();
          scrollToTurn(turn.id);
        });

        const del = document.createElement("button");
        del.className = "history__del";
        del.type = "button";
        del.textContent = "×";
        del.setAttribute("aria-label", "delete");
        del.addEventListener("click", (e) => {
          e.stopPropagation();
          deleteEntry(turn.id);
        });

        item.appendChild(q);
        item.appendChild(del);
        el.historyList.appendChild(item);
      });
  }

  function scrollToTurn(id) {
    const idx = state.turns.findIndex((t2) => t2.id === id);
    if (idx < 0) return;
    // Each turn renders as 2 message nodes (user + bot).
    const nodes = el.chat.querySelectorAll(".msg");
    const target = nodes[idx * 2];
    if (target) target.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function deleteEntry(id) {
    state.turns = state.turns.filter((tn) => tn.id !== id);
    saveHistory();
    renderChat();
    renderHistory();
  }

  function clearHistory() {
    if (state.turns.length && !window.confirm(t("confirmClear"))) return;
    state.turns = [];
    deleteCookie(CFG.COOKIE_HISTORY);
    renderChat();
    renderHistory();
  }

  /* ---------- Modal ---------- */
  // Build the provider chips once.
  function buildProviderSelect() {
    el.providerSelect.innerHTML = "";
    Object.keys(CFG.PROVIDERS).forEach((p) => {
      const cfg = CFG.PROVIDERS[p];
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "provider-opt";
      btn.setAttribute("data-provider", p);

      const name = document.createElement("span");
      name.className = "provider-opt__name";
      name.textContent = cfg.label;
      btn.appendChild(name);

      if (cfg.free) {
        const badge = document.createElement("span");
        badge.className = "provider-opt__badge";
        badge.textContent = t("providerFree");
        btn.appendChild(badge);
      }
      btn.addEventListener("click", () => selectModalProvider(p));
      el.providerSelect.appendChild(btn);
    });
  }

  // Switch which provider the modal is editing (does not commit until Save).
  function selectModalProvider(p) {
    state.modalProvider = p;
    const cfg = CFG.PROVIDERS[p];
    buildProviderSelect();
    el.providerSelect.querySelectorAll(".provider-opt").forEach((btn) => {
      btn.classList.toggle(
        "is-active",
        btn.getAttribute("data-provider") === p
      );
    });
    el.apiKeyInput.value = state.keys[p] || "";
    el.apiKeyInput.setAttribute(
      "placeholder",
      t("apiKeyPlaceholder") + " (" + cfg.keyHint + ")"
    );
    el.getKeyLink.setAttribute("href", cfg.getKeyUrl);
    el.getKeyLink.textContent = t(
      p === "claude" ? "getKeyLinkClaude" : "getKeyLinkGemini"
    );
    el.modalError.hidden = true;
  }

  function openModal() {
    selectModalProvider(state.provider);
    el.backdrop.hidden = false;
    el.apiKeyInput.focus();
  }
  function closeModal() {
    el.backdrop.hidden = true;
  }
  function saveKey() {
    const key = el.apiKeyInput.value.trim();
    const p = state.modalProvider;
    if (!key) {
      el.modalError.textContent = t("errNoKey");
      el.modalError.hidden = false;
      return;
    }
    state.keys[p] = key;
    setCookie(providerKeyCookie(p), key, CFG.COOKIE_DAYS);
    // Selecting a provider in the dialog also makes it the active one.
    state.provider = p;
    setCookie(CFG.COOKIE_PROVIDER, p, CFG.COOKIE_DAYS);
    updateComposerHint();
    closeModal();
  }
  function clearKey() {
    const p = state.modalProvider;
    state.keys[p] = "";
    deleteCookie(providerKeyCookie(p));
    el.apiKeyInput.value = "";
    el.modalError.hidden = true;
  }

  /* ---------- Send flow ---------- */
  async function handleSend(question) {
    if (state.busy) return;
    question = question.trim();
    if (!question) return;

    if (!currentKey()) {
      openModal();
      return;
    }

    const turn = { id: ++turnSeq, q: question, a: "", sources: [], ts: Date.now() };
    state.turns.push(turn);
    el.welcome.hidden = true;
    // Render the user message immediately.
    if (state.turns.length === 1) el.chat.innerHTML = "";
    el.chat.appendChild(makeMessage("user", escapeHtml(question)));
    renderHistory();
    scrollToBottom();

    setBusy(true);
    showTyping();

    try {
      const chunks = retrieve(question);
      const answer = await askProvider(question, chunks);
      turn.a = answer;
      turn.sources = chunks.length ? dedupeSources(chunks) : [];
      removeTyping();
      el.chat.appendChild(
        makeMessage("bot", renderMarkdown(answer), turn.sources)
      );
      saveHistory();
      renderHistory();
      scrollToBottom();
    } catch (err) {
      removeTyping();
      // Roll back the failed turn from persisted history.
      state.turns = state.turns.filter((tn) => tn.id !== turn.id);
      const msg = errorMessage(err);
      el.chat.appendChild(makeMessage("bot", '<p>⚠️ ' + escapeHtml(msg) + "</p>"));
      if (err && err.kind === "invalidKey") openModal();
      renderHistory();
      scrollToBottom();
    } finally {
      setBusy(false);
    }
  }

  function errorMessage(err) {
    if (!err) return t("errGeneric");
    switch (err.kind) {
      case "invalidKey":
        return t("errInvalidKey");
      case "rate":
        return t("errRate") + (err.detail ? "\n\n— " + err.detail : "");
      case "network":
        return t("errNetwork");
      default:
        return t("errGeneric");
    }
  }

  function setBusy(b) {
    state.busy = b;
    el.sendBtn.disabled = b;
    el.input.disabled = b;
  }

  /* ---------- Mobile sidebar ---------- */
  function closeSidebarMobile() {
    el.app.classList.remove("sidebar-open");
  }

  /* ---------- Wire up ---------- */
  function autoGrow() {
    el.input.style.height = "auto";
    el.input.style.height = Math.min(el.input.scrollHeight, 160) + "px";
  }

  function bindEvents() {
    el.form.addEventListener("submit", (e) => {
      e.preventDefault();
      const q = el.input.value;
      el.input.value = "";
      autoGrow();
      handleSend(q);
    });
    el.input.addEventListener("input", autoGrow);
    el.input.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        el.form.requestSubmit();
      }
    });
    el.langToggle.addEventListener("click", toggleLanguage);
    el.settingsBtn.addEventListener("click", openModal);
    el.clearHistoryBtn.addEventListener("click", clearHistory);
    el.menuToggle.addEventListener("click", () =>
      el.app.classList.toggle("sidebar-open")
    );
    el.app.addEventListener("click", (e) => {
      // Close mobile sidebar when tapping the dimmed backdrop area.
      if (
        el.app.classList.contains("sidebar-open") &&
        e.target === el.app &&
        window.innerWidth <= 820
      )
        closeSidebarMobile();
    });
    // Modal buttons
    el.saveKeyBtn.addEventListener("click", saveKey);
    el.clearKeyBtn.addEventListener("click", clearKey);
    el.modalCancel.addEventListener("click", closeModal);
    el.backdrop.addEventListener("click", (e) => {
      if (e.target === el.backdrop) closeModal();
    });
    el.apiKeyInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") saveKey();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !el.backdrop.hidden) closeModal();
    });
  }

  /* ---------- Init ---------- */
  async function init() {
    applyLanguage();
    bindEvents();
    await loadKnowledge();
    indexRecords();
    if (!currentKey()) openModal();
  }

  init();
})();
