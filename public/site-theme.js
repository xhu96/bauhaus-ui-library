// Synchronous, shared pre-paint bootstrap for both site entry points.
;(function () {
  var theme
  try {
    theme = window.localStorage.getItem('bauhaus-theme')
  } catch {
    // Blocked persistence still respects the system preference.
  }
  if (theme !== 'light' && theme !== 'dark') {
    theme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  document.documentElement.dataset.buiTheme = theme
  document.documentElement.classList.toggle('dark', theme === 'dark')
})()
