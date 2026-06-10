(function () {
  const SITE_STATE_KEY = "mangalore-data-ui-state";
  const LEGACY_THEME_KEY = "mangalore-data-theme";
  const DEFAULT_UI_STATE = {
    theme: "light",
    huePrimary: 210,
    hueStep: 30
  };

  function normalizedState(value = {}) {
    const huePrimary = Number(value.huePrimary);
    const hueStep = Number(value.hueStep);
    return {
      theme: value.theme === "dark" ? "dark" : "light",
      huePrimary: Number.isFinite(huePrimary) ? huePrimary : DEFAULT_UI_STATE.huePrimary,
      hueStep: Number.isFinite(hueStep) ? hueStep : DEFAULT_UI_STATE.hueStep
    };
  }

  function readState() {
    try {
      const stored = localStorage.getItem(SITE_STATE_KEY);
      if (stored) return normalizedState(JSON.parse(stored));
      const legacyTheme = localStorage.getItem(LEGACY_THEME_KEY);
      return normalizedState({ ...DEFAULT_UI_STATE, theme: legacyTheme || DEFAULT_UI_STATE.theme });
    } catch {
      return { ...DEFAULT_UI_STATE };
    }
  }

  function writeState(state) {
    try {
      localStorage.setItem(SITE_STATE_KEY, JSON.stringify(state));
      localStorage.setItem(LEGACY_THEME_KEY, state.theme);
    } catch {
      // Storage can be unavailable in hardened browser modes.
    }
  }

  function applyState(state) {
    const nextState = normalizedState(state);
    document.documentElement.dataset.theme = nextState.theme;
    document.documentElement.style.setProperty("--hue-primary", String(nextState.huePrimary));
    document.documentElement.style.setProperty("--hue-step", String(nextState.hueStep));
    return nextState;
  }

  function iconForTheme(theme) {
    return theme === "dark" ? "fa-solid fa-sun" : "fa-solid fa-moon";
  }

  function syncToggle(toggle, state) {
    if (!toggle) return;
    toggle.setAttribute("aria-label", state.theme === "dark" ? "Use light theme" : "Use dark theme");
    const icon = toggle.querySelector("i");
    if (icon) icon.className = iconForTheme(state.theme);
  }

  function bindThemeToggle(toggle) {
    let state = applyState(readState());
    syncToggle(toggle, state);

    if (!toggle) return state;

    toggle.addEventListener("click", () => {
      state = applyState({ ...state, theme: state.theme === "dark" ? "light" : "dark" });
      writeState(state);
      syncToggle(toggle, state);
    });

    return state;
  }

  window.MangaloreDataUI = {
    storageKey: SITE_STATE_KEY,
    defaultState: DEFAULT_UI_STATE,
    readState,
    writeState,
    applyState,
    bindThemeToggle
  };
}());
