import { getLang } from '../main.js'
import fi from '../i18n/fi.json'
import en from '../i18n/en.json'
import data from '../data/cfs-fi.json'

const CFS_SVGS = [
  // 1 - Running figure
  `<svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="38" cy="10" r="5" fill="#333"/>
    <path d="M32 18 L38 28 L44 18" stroke="#333" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M38 28 L38 40" stroke="#333" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M38 40 L30 52" stroke="#333" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M38 40 L46 52" stroke="#333" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M28 22 L38 24 L48 20" stroke="#333" stroke-width="2.5" stroke-linecap="round"/>
  </svg>`,
  // 2 - Brisk walking
  `<svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="30" cy="10" r="5" fill="#333"/>
    <path d="M30 15 L30 36" stroke="#333" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M22 22 L30 20 L38 22" stroke="#333" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M30 36 L23 52" stroke="#333" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M30 36 L37 52" stroke="#333" stroke-width="2.5" stroke-linecap="round"/>
  </svg>`,
  // 3 - Calm walking
  `<svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="30" cy="10" r="5" fill="#333"/>
    <path d="M30 15 L30 36" stroke="#333" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M22 24 L30 21 L38 24" stroke="#333" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M30 36 L25 52" stroke="#333" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M30 36 L35 52" stroke="#333" stroke-width="2.5" stroke-linecap="round"/>
  </svg>`,
  // 4 - Slow walking, slight stoop
  `<svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="10" r="5" fill="#333"/>
    <path d="M32 15 L30 36" stroke="#333" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M23 26 L30 22 L37 26" stroke="#333" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M30 36 L25 52" stroke="#333" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M30 36 L35 52" stroke="#333" stroke-width="2.5" stroke-linecap="round"/>
  </svg>`,
  // 5 - Walking with cane
  `<svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="28" cy="10" r="5" fill="#333"/>
    <path d="M28 15 L26 36" stroke="#333" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M20 26 L26 22 L34 27" stroke="#333" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M26 36 L22 52" stroke="#333" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M26 36 L32 52" stroke="#333" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M34 27 L40 52" stroke="#333" stroke-width="2" stroke-linecap="round"/>
  </svg>`,
  // 6 - Walking with walker
  `<svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="10" r="5" fill="#333"/>
    <path d="M24 15 L22 34" stroke="#333" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M16 26 L22 22 L34 24" stroke="#333" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M22 34 L18 52" stroke="#333" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M22 34 L28 52" stroke="#333" stroke-width="2.5" stroke-linecap="round"/>
    <rect x="34" y="20" width="12" height="32" rx="2" stroke="#333" stroke-width="2" fill="none"/>
    <circle cx="36" cy="52" r="2" fill="#333"/>
    <circle cx="44" cy="52" r="2" fill="#333"/>
  </svg>`,
  // 7 - Wheelchair
  `<svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="26" cy="10" r="5" fill="#333"/>
    <path d="M26 15 L26 32" stroke="#333" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M20 24 L26 20 L34 24" stroke="#333" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M26 32 L22 42" stroke="#333" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M26 32 L32 42" stroke="#333" stroke-width="2.5" stroke-linecap="round"/>
    <circle cx="26" cy="48" r="8" stroke="#333" stroke-width="2" fill="none"/>
    <path d="M18 32 L40 32" stroke="#333" stroke-width="2" stroke-linecap="round"/>
    <path d="M40 32 L42 48" stroke="#333" stroke-width="2" stroke-linecap="round"/>
  </svg>`,
  // 8 - In bed, propped up
  `<svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="22" r="5" fill="#333"/>
    <path d="M8 52 L8 28 L18 28" stroke="#333" stroke-width="2" stroke-linecap="round"/>
    <path d="M18 28 L18 36 L52 36" stroke="#333" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M18 36 L26 44" stroke="#333" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M30 36 L34 44" stroke="#333" stroke-width="2.5" stroke-linecap="round"/>
    <rect x="6" y="36" width="48" height="4" rx="1" fill="#333" opacity="0.3"/>
    <rect x="4" y="40" width="52" height="14" rx="2" stroke="#333" stroke-width="2" fill="none"/>
  </svg>`,
  // 9 - Lying flat
  `<svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="30" r="5" fill="#333"/>
    <path d="M17 30 L17 36 L52 36" stroke="#333" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M30 36 L28 44" stroke="#333" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M40 36 L38 44" stroke="#333" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M17 30 L22 28" stroke="#333" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M17 30 L22 33" stroke="#333" stroke-width="2.5" stroke-linecap="round"/>
    <rect x="4" y="40" width="52" height="14" rx="2" stroke="#333" stroke-width="2" fill="none"/>
    <rect x="6" y="36" width="48" height="4" rx="1" fill="#333" opacity="0.3"/>
  </svg>`
]

export function renderCFS() {
  const lang = getLang()
  const t = lang === 'fi' ? fi : en

  const cards = data.levels.map((level, i) => `
    <div class="cfs-card" data-score="${level.score}" style="border-color: ${level.color}20">
      <div class="cfs-icon">${CFS_SVGS[i]}</div>
      <div class="cfs-score" style="color: ${level.color}">${level.score}</div>
      <div class="cfs-content">
        <h3>${level.title}</h3>
        <p>${level.description}</p>
      </div>
    </div>
  `).join('')

  const dementiaLevels = data.dementiaNote.levels.map(l => `
    <div class="cfs-dementia-level">
      <strong>${l.title}:</strong>
      <p>${l.description}</p>
    </div>
  `).join('')

  return `
    <a href="#/" class="back-link">${t.back}</a>
    <div class="page-header">
      <h1>${t.cfs_title}</h1>
      <p class="subtitle">${t.cfs_subtitle}</p>
    </div>

    <div class="cfs-scale">
      ${cards}
    </div>

    <div class="cfs-dementia-note">
      <h3>${data.dementiaNote.title}</h3>
      <p style="margin-bottom:0.75rem;font-size:0.9rem">${data.dementiaNote.text}</p>
      ${dementiaLevels}
    </div>

    <div class="source-citation">
      ${data.source}<br/>
      ${data.translationSource}<br/>
      ${data.copyright}
    </div>

    <div style="margin-top:1.5rem">
      <button class="print-btn">${t.print}</button>
    </div>
  `
}

export function bindCFS() {
  document.querySelectorAll('.cfs-card').forEach(card => {
    card.addEventListener('click', () => {
      const wasActive = card.classList.contains('active')
      document.querySelectorAll('.cfs-card').forEach(c => {
        c.classList.remove('active')
        const score = c.dataset.score
        const level = data.levels[score - 1]
        c.style.borderColor = level.color + '20'
      })
      if (!wasActive) {
        card.classList.add('active')
        const score = card.dataset.score
        const level = data.levels[score - 1]
        card.style.borderColor = level.color
      }
    })
  })
}
