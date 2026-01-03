// Theme management utilities

export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  AUTO: 'auto'
};

export function getTheme() {
  const stored = localStorage.getItem('theme');
  if (stored && Object.values(THEMES).includes(stored)) {
    return stored;
  }
  return THEMES.AUTO;
}

export function setTheme(theme) {
  localStorage.setItem('theme', theme);
  applyTheme(theme);
}

export function applyTheme(theme) {
  if (theme === THEMES.AUTO) {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
  } else {
    document.documentElement.setAttribute('data-theme', theme);
  }
}

export function initTheme() {
  const theme = getTheme();
  applyTheme(theme);
  
  // Listen for system theme changes if auto
  if (theme === THEMES.AUTO) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      applyTheme(THEMES.AUTO);
    });
  }
}
