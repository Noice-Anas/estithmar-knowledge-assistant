/**
 * config.js — tweakable settings for the Estithmar Knowledge-Center chat demo.
 * No secrets here. The user's Gemini API key is entered in the UI and stored
 * in a browser cookie, never committed to the repo.
 */
window.ESTITHMAR_CONFIG = {
  // Gemini model + endpoint. gemini-2.0-flash is on the free tier, fast, and
  // has a large context window that comfortably fits the retrieved passages.
  MODEL: "gemini-2.0-flash",
  API_BASE: "https://generativelanguage.googleapis.com/v1beta/models",

  // Retrieval: how many knowledge chunks to send to the model per question.
  TOP_N: 6,

  // Path to the pre-built knowledge base (produced by scripts/build-knowledge.mjs).
  KNOWLEDGE_URL: "knowledge.json",

  // Cookie names + lifetimes.
  COOKIE_KEY: "estithmar_gemini_key",
  COOKIE_LANG: "estithmar_lang",
  COOKIE_HISTORY: "estithmar_history",
  COOKIE_DAYS: 180,

  // Cookies are capped at ~4KB per domain. Keep stored history safely under that;
  // oldest messages are trimmed automatically when the budget is exceeded.
  HISTORY_MAX_BYTES: 3200,

  // Where visitors get a free key (shown in the setup modal).
  GET_KEY_URL: "https://aistudio.google.com/app/apikey",

  // The public Knowledge Center this demo references.
  KNOWLEDGE_CENTER_URL: "https://estithmar.org.sa/knowledge-center/",
};
