import { getLang } from '../main.js'
import fi from '../i18n/fi.json'
import en from '../i18n/en.json'

export function renderNav(currentRoute) {
  const lang = getLang()
  const t = lang === 'fi' ? fi : en

  return `
    <nav class="nav">
      <a href="#/" class="nav-brand">${t.site_title}</a>
      <div class="nav-links">
        <a href="#/" class="${currentRoute === 'home' ? 'active' : ''}">${t.home}</a>
        <a href="#/asthma" class="${currentRoute === 'asthma' ? 'active' : ''}">${t.asthma}</a>
        <a href="#/prolonged-cough" class="${currentRoute === 'prolonged-cough' ? 'active' : ''}">${t.prolonged_cough}</a>
        <a href="#/fleischner" class="${currentRoute === 'fleischner' ? 'active' : ''}">${t.fleischner}</a>
        <a href="#/cfs" class="${currentRoute === 'cfs' ? 'active' : ''}">${t.cfs}</a>
        <a href="#/spirometry" class="${currentRoute === 'spirometry' ? 'active' : ''}">${t.spirometry}</a>
        <button class="lang-toggle">${t.lang_code}</button>
      </div>
    </nav>
  `
}
