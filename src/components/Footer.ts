export function renderFooter(): HTMLElement {
  const footer = document.createElement('footer')
  footer.className = 'app-footer'
  footer.textContent = `Summit v${__APP_VERSION__}`
  return footer
}
