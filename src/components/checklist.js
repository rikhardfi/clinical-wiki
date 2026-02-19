export function renderChecklist(section) {
  const items = section.items.map(item => `
    <div class="checklist-item">
      <input type="checkbox" id="cb-${item.id}" data-id="${item.id}" />
      <label for="cb-${item.id}">${item.text}</label>
    </div>
  `).join('')

  return `
    <section class="checklist-section" id="section-${section.id}">
      <h2>${section.title}</h2>
      ${items}
    </section>
  `
}

export function renderTable(section) {
  const tables = section.tables.map(table => {
    const headers = table.headers.map(h => `<th>${h}</th>`).join('')
    const rows = table.rows.map(row =>
      '<tr>' + row.map(cell => `<td>${cell}</td>`).join('') + '</tr>'
    ).join('')

    return `
      <div class="ref-table-wrapper">
        <h3>${table.caption}</h3>
        <table class="ref-table">
          <thead><tr>${headers}</tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    `
  }).join('')

  return `
    <section class="checklist-section" id="section-${section.id}">
      <h2>${section.title}</h2>
      ${tables}
    </section>
  `
}

export function renderSection(section) {
  if (section.type === 'table') return renderTable(section)
  return renderChecklist(section)
}
