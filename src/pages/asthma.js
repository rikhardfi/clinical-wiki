import { getLang } from '../main.js'
import fi from '../i18n/fi.json'
import en from '../i18n/en.json'
import asthmaFi from '../data/asthma-fi.json'
import asthmaEn from '../data/asthma-en.json'
import visitData from '../data/asthma-visit-fi.json'
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
    ${renderVisitTextGenerator(t)}
  `
}

function renderVisitTextGenerator(t) {
  const vt = visitData.visitTypes

  return `
    <div class="visit-generator">
      <h2>${t.visit_text_title}</h2>
      <p class="subtitle">${t.visit_text_subtitle}</p>

      <div class="visit-type-selector">
        <label>
          <input type="radio" name="visit-type" value="new" checked>
          ${vt.new.label}
        </label>
        <label>
          <input type="radio" name="visit-type" value="followup">
          ${vt.followup.label}
        </label>
      </div>

      <div id="visit-sections"></div>

      <div class="visit-output">
        <textarea id="visit-text-output" readonly></textarea>
        <button class="visit-copy-btn" id="visit-copy-btn">${t.visit_copy}</button>
      </div>
    </div>
  `
}

function escAttr(str) {
  return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function renderVisitSections(type) {
  const container = document.getElementById('visit-sections')
  if (!container) return

  const html = visitData.sections
    .map(section => {
      const items = section.items.filter(item => item.types.includes(type))
      if (items.length === 0) return ''
      return `
        <div class="visit-section">
          <h3>${section.title}</h3>
          ${items.map(item => `
            <div class="visit-item">
              <input type="checkbox" id="${item.id}" data-section="${escAttr(section.id)}" data-prose="${escAttr(item.prose)}">
              <label for="${item.id}">${item.text}</label>
            </div>
          `).join('')}
        </div>
      `
    })
    .join('')

  container.innerHTML = html
}

function updateVisitText() {
  const output = document.getElementById('visit-text-output')
  if (!output) return

  const lang = getLang()
  const t = lang === 'fi' ? fi : en
  const typeRadio = document.querySelector('input[name="visit-type"]:checked')
  const type = typeRadio ? typeRadio.value : 'new'
  const vt = visitData.visitTypes[type]

  const today = new Date()
  const dateStr = `${String(today.getDate()).padStart(2, '0')}.${String(today.getMonth() + 1).padStart(2, '0')}.${today.getFullYear()}`

  // Group checked items by section
  const sectionMap = new Map()
  document.querySelectorAll('#visit-sections input[type="checkbox"]:checked').forEach(cb => {
    const sectionId = cb.dataset.section
    const prose = cb.dataset.prose
    if (!sectionMap.has(sectionId)) {
      sectionMap.set(sectionId, [])
    }
    sectionMap.get(sectionId).push(prose)
  })

  if (sectionMap.size === 0) {
    output.value = t.visit_empty
    return
  }

  // Build text
  let text = `${vt.headerText} ${dateStr}\n`

  visitData.sections.forEach(section => {
    const proseLines = sectionMap.get(section.id)
    if (proseLines && proseLines.length > 0) {
      text += `\n${section.title}:\n`
      proseLines.forEach(p => {
        text += `- ${p}\n`
      })
    }
  })

  output.value = text.trim()
}

export function bindVisitTextGenerator() {
  const typeRadios = document.querySelectorAll('input[name="visit-type"]')
  if (typeRadios.length === 0) return

  // Initial render
  const initialType = document.querySelector('input[name="visit-type"]:checked')?.value || 'new'
  renderVisitSections(initialType)
  updateVisitText()

  // Visit type change
  typeRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      renderVisitSections(radio.value)
      updateVisitText()
      // Re-bind checkbox listeners after re-render
      bindVisitCheckboxes()
    })
  })

  // Bind checkboxes
  bindVisitCheckboxes()

  // Copy button
  const copyBtn = document.getElementById('visit-copy-btn')
  if (copyBtn) {
    const lang = getLang()
    const t = lang === 'fi' ? fi : en
    copyBtn.addEventListener('click', () => {
      const output = document.getElementById('visit-text-output')
      if (output && output.value && output.value !== t.visit_empty) {
        navigator.clipboard.writeText(output.value)
        copyBtn.textContent = t.visit_copied
        copyBtn.classList.add('copied')
        setTimeout(() => {
          copyBtn.textContent = t.visit_copy
          copyBtn.classList.remove('copied')
        }, 2000)
      }
    })
  }
}

function bindVisitCheckboxes() {
  document.querySelectorAll('#visit-sections input[type="checkbox"]').forEach(cb => {
    cb.addEventListener('change', updateVisitText)
  })
}
