import { getLang } from '../main.js'
import fi from '../i18n/fi.json'
import en from '../i18n/en.json'

const SPIROMETRY_URL = 'https://rikhardfi.github.io/spirometry-calculator/'

export function renderSpirometry() {
  const lang = getLang()
  const t = lang === 'fi' ? fi : en

  return `
    <a href="#/" class="back-link">${t.back}</a>
    <div class="page-header">
      <h1>${t.spirometry_title}</h1>
      <p class="subtitle">${t.spirometry_subtitle}</p>
    </div>

    <div class="iframe-container">
      <iframe src="${SPIROMETRY_URL}" title="${t.spirometry_title}" loading="lazy"></iframe>
    </div>
    <a href="${SPIROMETRY_URL}" target="_blank" rel="noopener noreferrer" class="iframe-link">${t.open_new_tab} &#8599;</a>

    <div style="margin-top:1.5rem">
      <button class="print-btn">${t.print}</button>
    </div>
  `
}
