import { getLang } from '../main.js'
import fi from '../i18n/fi.json'
import en from '../i18n/en.json'
import coughFi from '../data/cough-fi.json'
import coughEn from '../data/cough-en.json'
import { renderSection } from '../components/checklist.js'
import { renderFlowchart } from '../components/flowchart.js'

export function renderCough() {
  const lang = getLang()
  const t = lang === 'fi' ? fi : en
  const data = lang === 'fi' ? coughFi : coughEn

  const flowchart = renderFlowchart()
  const sections = data.sections.map(s => renderSection(s)).join('')

  const redFlagItems = data.redFlags.map(f => `<li>${f}</li>`).join('')

  return `
    <a href="#/" class="back-link">${t.back}</a>
    <div class="page-header">
      <h1>${t.cough_title}</h1>
      <p class="subtitle">${t.cough_subtitle}</p>
    </div>

    <button class="fc-reset-btn">${t.start_over}</button>
    ${flowchart}

    ${sections}

    <div class="red-flag-box">
      <h3>${t.red_flags_title}</h3>
      <ul>${redFlagItems}</ul>
    </div>

    <div style="margin-top:1.5rem">
      <button class="reset-btn">${t.reset}</button>
      <button class="print-btn">${t.print}</button>
    </div>
  `
}
