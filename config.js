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
      // Per Anthropic guidance, default to the most capable model. Lower the
      // cost by switching to "claude-haiku-4-5" or "claude-sonnet-5" here.
      model: "claude-opus-4-8",
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

  // Cookie names + lifetimes.
  COOKIE_KEY_GEMINI: "estithmar_gemini_key",
  COOKIE_KEY_CLAUDE: "estithmar_claude_key",
  COOKIE_PROVIDER: "estithmar_provider",
  COOKIE_LANG: "estithmar_lang",
  COOKIE_HISTORY: "estithmar_history",
  COOKIE_DAYS: 180,

  // Cookies are capped at ~4KB per domain. Keep stored history safely under that;
  // oldest messages are trimmed automatically when the budget is exceeded.
  HISTORY_MAX_BYTES: 3200,

  // The public Knowledge Center this demo references.
  KNOWLEDGE_CENTER_URL: "https://estithmar.org.sa/knowledge-center/",
};
