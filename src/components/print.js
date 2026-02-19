// Print is handled via the print-btn class in main.js
// and @media print styles in style.css
// This module is intentionally minimal.

export function renderPrintButton(label) {
  return `<button class="print-btn">${label}</button>`
}
