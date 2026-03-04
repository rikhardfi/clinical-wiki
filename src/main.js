import './style.css'
import { renderNav } from './components/nav.js'
import { renderHome } from './pages/home.js'
import { renderAsthma } from './pages/asthma.js'
import { renderCough } from './pages/cough.js'
import { renderFleischner, bindFleischner } from './pages/fleischner.js'
import { renderCFS, bindCFS } from './pages/cfs.js'
import { renderSpirometry } from './pages/spirometry.js'
import { bindSearch } from './components/search.js'
import { bindFlowchart } from './components/flowchart.js'

// Detect embed mode
const params = new URLSearchParams(window.location.search)
const embedMode = params.get('embed') === 'true'
const embedPage = params.get('page')

if (embedMode) {
  document.body.classList.add('embed-mode')
}

// Language management
export function getLang() {
  return localStorage.getItem('clinical-wiki-lang') || 'fi'
}

export function setLang(lang) {
  localStorage.setItem('clinical-wiki-lang', lang)
  route()
}

// Simple hash router
function getRoute() {
  const hash = window.location.hash.replace('#/', '').replace('#', '')
  return hash || 'home'
}

function route() {
  const app = document.getElementById('app')
  const currentRoute = embedMode ? (embedPage || 'home') : getRoute()

  let html = ''

  if (!embedMode) {
    html += renderNav(currentRoute)
  }

  html += '<main class="container">'

  switch (currentRoute) {
    case 'asthma':
      html += renderAsthma()
      break
    case 'prolonged-cough':
      html += renderCough()
      break
    case 'fleischner':
      html += renderFleischner()
      break
    case 'cfs':
      html += renderCFS()
      break
    case 'spirometry':
      html += renderSpirometry()
      break
    default:
      html += renderHome()
  }

  html += '</main>'
  app.innerHTML = html

  // Bind event listeners after render
  bindEvents(currentRoute)
}

function bindEvents(currentRoute) {
  // Language toggle
  const langBtn = document.querySelector('.lang-toggle')
  if (langBtn) {
    langBtn.addEventListener('click', () => {
      setLang(getLang() === 'fi' ? 'en' : 'fi')
    })
  }

  // Checkbox persistence
  document.querySelectorAll('.checklist-item input[type="checkbox"]').forEach(cb => {
    const key = `clinical-wiki-${currentRoute}-${cb.dataset.id}`
    cb.checked = localStorage.getItem(key) === 'true'
    if (cb.checked) cb.closest('.checklist-item').classList.add('checked')

    cb.addEventListener('change', () => {
      localStorage.setItem(key, cb.checked)
      cb.closest('.checklist-item').classList.toggle('checked', cb.checked)
    })
  })

  // Reset button
  const resetBtn = document.querySelector('.reset-btn')
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      document.querySelectorAll('.checklist-item input[type="checkbox"]').forEach(cb => {
        const key = `clinical-wiki-${currentRoute}-${cb.dataset.id}`
        localStorage.removeItem(key)
        cb.checked = false
        cb.closest('.checklist-item').classList.remove('checked')
      })
    })
  }

  // Print button
  const printBtn = document.querySelector('.print-btn')
  if (printBtn) {
    printBtn.addEventListener('click', () => window.print())
  }

  // Search (home page)
  if (currentRoute === 'home') {
    bindSearch()
  }

  // Flowchart interactivity (cough page)
  if (currentRoute === 'prolonged-cough') {
    bindFlowchart()
  }

  // Fleischner calculator
  if (currentRoute === 'fleischner') {
    bindFleischner()
  }

  // CFS card interactivity
  if (currentRoute === 'cfs') {
    bindCFS()
  }

  // Card navigation (internal routes)
  document.querySelectorAll('.card[data-route]').forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault()
      window.location.hash = '#/' + card.dataset.route
    })
  })

  // External link cards
  document.querySelectorAll('.card-external[data-href]').forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault()
      window.open(card.dataset.href, '_blank', 'noopener,noreferrer')
    })
  })
}

// Initialize
window.addEventListener('hashchange', route)
route()
