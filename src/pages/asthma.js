import { getLang } from '../main.js'
import fi from '../i18n/fi.json'
import en from '../i18n/en.json'
import asthmaFi from '../data/asthma-fi.json'
import asthmaEn from '../data/asthma-en.json'
import { renderSection } from '../components/checklist.js'

export function renderAsthma() {
  const lang = getLang()
  const t = lang === 'fi' ? fi : en
  const data = lang === 'fi' ? asthmaFi : asthmaEn

  const sections = data.sections.map(s => renderSection(s)).join('')

  return `
    <a href="#/" class="back-link">${t.back}</a>
    <div class="page-header">
      <h1>${t.asthma_title}</h1>
      <p class="subtitle">${t.asthma_subtitle}</p>
    </div>
    ${sections}
    <div style="margin-top:1.5rem">
      <button class="reset-btn">${t.reset}</button>
      <button class="print-btn">${t.print}</button>
    </div>
  `
}
