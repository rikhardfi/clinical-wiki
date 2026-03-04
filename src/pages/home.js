import { getLang } from '../main.js'
import fi from '../i18n/fi.json'
import en from '../i18n/en.json'

export function renderHome() {
  const lang = getLang()
  const t = lang === 'fi' ? fi : en

  return `
    <div class="page-header">
      <h1>${t.home_title}</h1>
      <p class="subtitle">${t.home_subtitle}</p>
    </div>

    <div class="search-container">
      <input type="text" class="search-input" placeholder="${t.search_placeholder}" />
      <div class="search-results"></div>
    </div>

    <div class="cards-grid">
      <div class="card" data-route="asthma">
        <h3>${t.asthma_title}</h3>
        <p>${t.asthma_card_desc}</p>
      </div>
      <div class="card" data-route="prolonged-cough">
        <h3>${t.cough_title}</h3>
        <p>${t.cough_card_desc}</p>
      </div>
      <div class="card" data-route="fleischner">
        <h3>${t.fleischner_title}</h3>
        <p>${t.fleischner_card_desc}</p>
      </div>
      <div class="card" data-route="cfs">
        <h3>${t.cfs_title}</h3>
        <p>${t.cfs_card_desc}</p>
      </div>
      <div class="card" data-route="spirometry">
        <h3>${t.spirometry_title}</h3>
        <p>${t.spirometry_card_desc}</p>
      </div>
      <div class="card card-external" data-href="https://rikhardfi.github.io/exercise-symptom-mapper/">
        <h3>${t.exercise_symptom_title}</h3>
        <p>${t.exercise_symptom_desc}</p>
      </div>
    </div>
  `
}
