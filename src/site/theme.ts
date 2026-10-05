export type SiteTheme = 'light' | 'dark'

export function readSiteTheme(): SiteTheme {
  if (typeof document === 'undefined') return 'light'
  return document.documentElement.dataset.buiTheme === 'dark' ||
    (!document.documentElement.dataset.buiTheme && document.documentElement.classList.contains('dark'))
    ? 'dark'
    : 'light'
}

export function applySiteTheme(theme: SiteTheme) {
  document.documentElement.dataset.buiTheme = theme
  document.documentElement.classList.toggle('dark', theme === 'dark')
  try {
    window.localStorage.setItem('bauhaus-theme', theme)
  } catch {
    // The selected theme remains usable for this page when storage is unavailable.
  }
}
