import { getLang } from '../main.js'
import fi from '../i18n/fi.json'
import en from '../i18n/en.json'
import asthmaFi from '../data/asthma-fi.json'
import asthmaEn from '../data/asthma-en.json'
import coughFi from '../data/cough-fi.json'
import coughEn from '../data/cough-en.json'
import fleischnerData from '../data/fleischner-fi.json'
import cfsData from '../data/cfs-fi.json'

function searchData(query) {
  const lang = getLang()
  const t = lang === 'fi' ? fi : en
  const asthma = lang === 'fi' ? asthmaFi : asthmaEn
  const cough = lang === 'fi' ? coughFi : coughEn
  const q = query.toLowerCase().trim()

  if (!q || q.length < 2) return []

  const results = []

  // Search asthma
  const asthmaResults = []
  for (const section of asthma.sections) {
    if (section.items) {
      for (const item of section.items) {
        if (item.text.toLowerCase().includes(q)) {
          asthmaResults.push({ section: section.title, text: item.text })
        }
      }
    }
    if (section.tables) {
      for (const table of section.tables) {
        for (const row of table.rows) {
          const rowText = row.join(' ')
          if (rowText.toLowerCase().includes(q)) {
            asthmaResults.push({ section: section.title, text: rowText })
          }
        }
      }
    }
  }
  if (asthmaResults.length > 0) {
    results.push({ page: t.asthma, route: 'asthma', items: asthmaResults })
  }

  // Search cough
  const coughResults = []
  for (const section of cough.sections) {
    if (section.items) {
      for (const item of section.items) {
        if (item.text.toLowerCase().includes(q)) {
          coughResults.push({ section: section.title, text: item.text })
        }
      }
    }
  }
  if (cough.redFlags) {
    for (const flag of cough.redFlags) {
      if (flag.toLowerCase().includes(q)) {
        coughResults.push({ section: t.red_flags_title, text: flag })
      }
    }
  }
  for (const node of cough.flowchart.nodes) {
    if (node.text.toLowerCase().includes(q)) {
      coughResults.push({ section: 'Vuokaavio', text: node.text.replace(/\n/g, ' ') })
    }
  }
  if (coughResults.length > 0) {
    results.push({ page: t.prolonged_cough, route: 'prolonged-cough', items: coughResults })
  }

  // Search Fleischner criteria
  const fleischnerResults = []
  const searchFleischnerItems = (items, sectionName) => {
    for (const item of items) {
      const text = `${item.size} — ${item.recommendation}`
      if (text.toLowerCase().includes(q)) {
        fleischnerResults.push({ section: sectionName, text })
      }
    }
  }
  searchFleischnerItems(fleischnerData.solid.single.lowRisk, 'Solidi / Yksittäinen / Matala riski')
  searchFleischnerItems(fleischnerData.solid.single.highRisk, 'Solidi / Yksittäinen / Korkea riski')
  searchFleischnerItems(fleischnerData.solid.multiple.lowRisk, 'Solidi / Useita / Matala riski')
  searchFleischnerItems(fleischnerData.solid.multiple.highRisk, 'Solidi / Useita / Korkea riski')
  searchFleischnerItems(fleischnerData.subsolid.groundGlass.single.items, 'Maalasimaine / Yksittäinen')
  searchFleischnerItems(fleischnerData.subsolid.groundGlass.multiple.items, 'Maalasimaine / Useita')
  searchFleischnerItems(fleischnerData.subsolid.partSolid.single.items, 'Osin solidi / Yksittäinen')
  searchFleischnerItems(fleischnerData.subsolid.partSolid.multiple.items, 'Osin solidi / Useita')
  if (fleischnerResults.length > 0) {
    results.push({ page: t.fleischner_title, route: 'fleischner', items: fleischnerResults })
  }

  // Search CFS
  const cfsResults = []
  for (const level of cfsData.levels) {
    const text = `${level.score}. ${level.title} — ${level.description}`
    if (text.toLowerCase().includes(q)) {
      cfsResults.push({ section: `CFS ${level.score}`, text: `${level.title}: ${level.description}` })
    }
  }
  if (cfsResults.length > 0) {
    results.push({ page: t.cfs_title, route: 'cfs', items: cfsResults })
  }

  return results
}

function highlightMatch(text, query) {
  const q = query.trim()
  if (!q) return text
  const regex = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  return text.replace(regex, '<mark>$1</mark>')
}

export function bindSearch() {
  const input = document.querySelector('.search-input')
  const resultsEl = document.querySelector('.search-results')
  if (!input || !resultsEl) return

  const lang = getLang()
  const t = lang === 'fi' ? fi : en

  input.addEventListener('input', () => {
    const query = input.value
    const results = searchData(query)

    if (!query || query.length < 2) {
      resultsEl.innerHTML = ''
      return
    }

    if (results.length === 0) {
      resultsEl.innerHTML = `<p style="color:#888;font-size:0.9rem">${t.search_no_results}</p>`
      return
    }

    resultsEl.innerHTML = results.map(group => `
      <div class="search-result-group">
        <h4>${group.page}</h4>
        ${group.items.slice(0, 5).map(item => `
          <div class="search-result-item" data-route="${group.route}">
            <small style="color:#888">${item.section}</small><br/>
            ${highlightMatch(item.text, query)}
          </div>
        `).join('')}
      </div>
    `).join('')

    // Bind click on results
    resultsEl.querySelectorAll('.search-result-item').forEach(el => {
      el.addEventListener('click', () => {
        window.location.hash = '#/' + el.dataset.route
      })
    })
  })
}
