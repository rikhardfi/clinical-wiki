import { getLang } from '../main.js'
import fi from '../i18n/fi.json'
import en from '../i18n/en.json'
import data from '../data/fleischner-fi.json'

export function renderFleischner() {
  const lang = getLang()
  const t = lang === 'fi' ? fi : en

  return `
    <a href="#/" class="back-link">${t.back}</a>
    <div class="page-header">
      <h1>${t.fleischner_title}</h1>
      <p class="subtitle">${t.fleischner_subtitle}</p>
    </div>

    ${renderCalculator()}
    ${renderReferenceTables(t)}

    <div class="source-citation">
      ${data.source}<br/>
      ${data.noteGeneral}
    </div>

    <div style="margin-top:1.5rem">
      <button class="print-btn">${t.print}</button>
    </div>
  `
}

function renderCalculator() {
  const c = data.calculator
  return `
    <div class="fleischner-calc">
      <h2>${data.title}</h2>
      <div class="fleischner-form">
        <div class="fleischner-field">
          <label>${c.labels.noduleType}</label>
          <select id="fl-type">
            <option value="">— Valitse —</option>
            ${c.options.noduleType.map(o => `<option value="${o.value}">${o.label}</option>`).join('')}
          </select>
        </div>
        <div class="fleischner-field">
          <label>${c.labels.presentation}</label>
          <select id="fl-presentation">
            <option value="">— Valitse —</option>
            ${c.options.presentation.map(o => `<option value="${o.value}">${o.label}</option>`).join('')}
          </select>
        </div>
        <div class="fleischner-field">
          <label>${c.labels.size}</label>
          <select id="fl-size">
            <option value="">— Valitse —</option>
          </select>
        </div>
        <div class="fleischner-field" id="fl-risk-field" style="display:none">
          <label>${c.labels.risk}</label>
          <select id="fl-risk">
            <option value="">— Valitse —</option>
            ${c.options.risk.map(o => `<option value="${o.value}">${o.label}</option>`).join('')}
          </select>
        </div>
      </div>
      <div id="fl-result"></div>
    </div>
  `
}

function renderReferenceTables(t) {
  return `
    <div class="fleischner-tables">
      <h2>${t.reference_tables}</h2>

      <h3>${data.solid.title}</h3>
      ${renderSolidTable()}

      <h3>${data.subsolid.title}</h3>
      ${renderSubsolidTable()}
    </div>
  `
}

function renderSolidTable() {
  const s = data.solid
  const rows = []

  // Single low risk
  for (const item of s.single.lowRisk) {
    rows.push(`<tr><td>${s.single.title}</td><td>Matala</td><td>${item.size}</td><td>${item.recommendation}</td></tr>`)
  }
  // Single high risk
  for (const item of s.single.highRisk) {
    rows.push(`<tr><td>${s.single.title}</td><td>Korkea</td><td>${item.size}</td><td>${item.recommendation}</td></tr>`)
  }
  // Multiple low risk
  for (const item of s.multiple.lowRisk) {
    rows.push(`<tr><td>${s.multiple.title}</td><td>Matala</td><td>${item.size}</td><td>${item.recommendation}</td></tr>`)
  }
  // Multiple high risk
  for (const item of s.multiple.highRisk) {
    rows.push(`<tr><td>${s.multiple.title}</td><td>Korkea</td><td>${item.size}</td><td>${item.recommendation}</td></tr>`)
  }

  return `
    <div class="ref-table-wrapper">
      <table class="ref-table">
        <thead><tr><th>Lukumäärä</th><th>Riski</th><th>Koko</th><th>Suositus</th></tr></thead>
        <tbody>${rows.join('')}</tbody>
      </table>
    </div>
  `
}

function renderSubsolidTable() {
  const ss = data.subsolid
  const rows = []

  // Ground glass single
  for (const item of ss.groundGlass.single.items) {
    rows.push(`<tr><td>Maalasimaine</td><td>${ss.groundGlass.single.title}</td><td>${item.size}</td><td>${item.recommendation}</td></tr>`)
  }
  // Ground glass multiple
  for (const item of ss.groundGlass.multiple.items) {
    rows.push(`<tr><td>Maalasimaine</td><td>${ss.groundGlass.multiple.title}</td><td>${item.size}</td><td>${item.recommendation}</td></tr>`)
  }
  // Part-solid single
  for (const item of ss.partSolid.single.items) {
    rows.push(`<tr><td>Osin solidi</td><td>${ss.partSolid.single.title}</td><td>${item.size}</td><td>${item.recommendation}</td></tr>`)
  }
  // Part-solid multiple
  for (const item of ss.partSolid.multiple.items) {
    rows.push(`<tr><td>Osin solidi</td><td>${ss.partSolid.multiple.title}</td><td>${item.size}</td><td>${item.recommendation}</td></tr>`)
  }

  return `
    <div class="ref-table-wrapper">
      <table class="ref-table">
        <thead><tr><th>Tyyppi</th><th>Lukumäärä</th><th>Koko</th><th>Suositus</th></tr></thead>
        <tbody>${rows.join('')}</tbody>
      </table>
    </div>
  `
}

// Fleischner calculator logic
function lookupResult(type, presentation, size, risk) {
  if (type === 'solid') {
    const section = data.solid[presentation]
    if (!section) return null
    const riskKey = risk === 'high' ? 'highRisk' : 'lowRisk'
    const items = section[riskKey]
    if (!items) return null

    const sizeMap = { '<6': '<6 mm', '6-8': '6–8 mm', '>8': '>8 mm' }
    const target = sizeMap[size]
    return items.find(i => i.size === target) || null
  }

  // Subsolid types
  const subType = type === 'groundGlass' ? data.subsolid.groundGlass : data.subsolid.partSolid
  const section = subType[presentation]
  if (!section) return null

  const sizeMap = { '<6': '<6 mm', '>=6': '≥6 mm' }
  const target = sizeMap[size]
  return section.items.find(i => i.size === target) || null
}

export function bindFleischner() {
  const typeEl = document.getElementById('fl-type')
  const presEl = document.getElementById('fl-presentation')
  const sizeEl = document.getElementById('fl-size')
  const riskEl = document.getElementById('fl-risk')
  const riskField = document.getElementById('fl-risk-field')
  const resultEl = document.getElementById('fl-result')

  if (!typeEl) return

  function updateSizeOptions() {
    const type = typeEl.value
    sizeEl.innerHTML = '<option value="">— Valitse —</option>'

    if (!type) return

    const options = type === 'solid'
      ? data.calculator.options.sizeSolid
      : data.calculator.options.sizeSubsolid

    for (const o of options) {
      sizeEl.innerHTML += `<option value="${o.value}">${o.label}</option>`
    }
  }

  function updateVisibility() {
    const type = typeEl.value
    riskField.style.display = type === 'solid' ? '' : 'none'
    if (type !== 'solid') riskEl.value = ''
  }

  function updateResult() {
    const type = typeEl.value
    const pres = presEl.value
    const size = sizeEl.value
    const risk = riskEl.value

    if (!type || !pres || !size) {
      resultEl.innerHTML = ''
      return
    }

    if (type === 'solid' && !risk) {
      resultEl.innerHTML = ''
      return
    }

    const result = lookupResult(type, pres, size, risk)
    if (!result) {
      resultEl.innerHTML = '<div class="fleischner-result"><p>Yhdistelmää ei löydy.</p></div>'
      return
    }

    resultEl.innerHTML = `
      <div class="fleischner-result">
        <h3>${data.calculator.labels.result}</h3>
        <p>${result.recommendation}</p>
        ${result.note ? `<p class="result-note">${result.note}</p>` : ''}
      </div>
    `
  }

  typeEl.addEventListener('change', () => {
    updateSizeOptions()
    updateVisibility()
    updateResult()
  })

  presEl.addEventListener('change', updateResult)
  sizeEl.addEventListener('change', updateResult)
  riskEl.addEventListener('change', updateResult)
}
