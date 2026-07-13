/**
 * config.js — tweakable settings for the Estithmar Knowledge-Center chat demo.
 * No secrets here. The visitor's API key(s) are entered in the UI and stored
 * in browser cookies, never committed to the repo.
 */
window.ESTITHMAR_CONFIG = {
  // Which provider is selected on first load.
  DEFAULT_PROVIDER: "gemini",

  // Supported AI providers. The visitor picks one in the settings dialog and
  // pastes that provider's key. Each key is stored in its own cookie, so
  // switching providers keeps both keys.
  PROVIDERS: {
    gemini: {
      label: "Google Gemini",
      // gemini-2.0-flash is on the free tier, fast, and has a large context
      // window that comfortably fits the retrieved passages.
      model: "gemini-2.0-flash",
      getKeyUrl: "https://aistudio.google.com/app/apikey",
      keyHint: "AIza…",
      free: true,
    },
    claude: {
      label: "Anthropic Claude",
      // Claude Haiku 4.5 — the fastest, most cost-effective Claude model, which
      // suits a short-answer demo. Switch to "claude-sonnet-5" or
      // "claude-opus-4-8" here for higher quality at higher cost.
      model: "claude-haiku-4-5",
      getKeyUrl: "https://console.anthropic.com/settings/keys",
      keyHint: "sk-ant-…",
      free: false,
    },
  },

  // --- Gemini (Google Generative Language API) ---
  GEMINI_API_BASE: "https://generativelanguage.googleapis.com/v1beta/models",

  // --- Claude (Anthropic Messages API) ---
  // Called directly from the browser; the dangerous-direct-browser-access
  // header (set in app.js) is what makes the cross-origin call succeed.
  CLAUDE_API_URL: "https://api.anthropic.com/v1/messages",
  CLAUDE_VERSION: "2023-06-01",
  CLAUDE_MAX_TOKENS: 1024,

  // Retrieval: how many knowledge chunks to send to the model per question.
  TOP_N: 6,

  // Path to the pre-built knowledge base (produced by scripts/build-knowledge.mjs).
  KNOWLEDGE_URL: "knowledge.json",

  // Cookie names + lifetimes. Keys and small preferences live in cookies.
  COOKIE_KEY_GEMINI: "estithmar_gemini_key",
  COOKIE_KEY_CLAUDE: "estithmar_claude_key",
  COOKIE_PROVIDER: "estithmar_provider",
  COOKIE_LANG: "estithmar_lang",
  COOKIE_HISTORY: "estithmar_history", // legacy single-conversation cookie (migrated on load)
  COOKIE_DAYS: 180,

  // Conversations are kept in localStorage (a 4KB cookie can't hold multiple
  // threads). Keys are the browser storage slots for the conversation list and
  // the id of the currently open conversation.
  STORE_CONVOS: "estithmar_convos",
  STORE_ACTIVE: "estithmar_active",

  // The public Knowledge Center this demo references.
  KNOWLEDGE_CENTER_URL: "https://estithmar.org.sa/knowledge-center/",
};
