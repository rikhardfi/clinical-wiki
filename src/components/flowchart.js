import { getLang } from '../main.js'
import coughFi from '../data/cough-fi.json'
import coughEn from '../data/cough-en.json'

const NODE_W = 200
const LINE_H = 16
const PAD_Y = 14

// Compute node height based on text lines
function nodeHeight(text) {
  const lines = text.split('\n').length
  return PAD_Y * 2 + lines * LINE_H
}

// Build height lookup from data (use Finnish as reference for layout since same structure)
function buildHeights(data) {
  const h = {}
  for (const n of data.flowchart.nodes) {
    h[n.id] = nodeHeight(n.text)
  }
  return h
}

// Compute Y positions dynamically based on actual node heights
// Main column (x=280): start → red_flags → ace → xray → spiro → empirical → step1 → step2 → step3 → specialist
// Side column (x=560): urgent, ace_stop, xray_abnormal, obstruction (aligned with their parent)
function buildLayout(data) {
  const h = buildHeights(data)
  const mainCol = ['start', 'red_flags', 'ace', 'xray', 'spiro', 'empirical', 'step1', 'step2', 'step3', 'specialist']
  const sideOf = { red_flags: 'urgent', ace: 'ace_stop', xray: 'xray_abnormal', spiro: 'obstruction' }
  const gap = 30
  const pos = {}
  let y = 20

  for (const id of mainCol) {
    pos[id] = { x: 280, y }
    if (sideOf[id]) {
      pos[sideOf[id]] = { x: 560, y }
    }
    y += h[id] + gap
  }

  return { pos, heights: h }
}

let activeNodes = new Set(['start'])
let activeEdges = new Set()

function escapeHTML(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function renderNode(node, pos, height) {
  const isActive = activeNodes.has(node.id)
  const isRedFlag = node.type === 'result-red'
  const isResult = node.type === 'result'
  const isStart = node.type === 'start'

  let fill, stroke
  if (isRedFlag) { fill = '#FFEBEE'; stroke = '#D32F2F' }
  else if (isResult) { fill = '#0D47A1'; stroke = '#0D47A1' }
  else if (isActive || isStart) { fill = '#E3F2FD'; stroke = '#0D47A1' }
  else { fill = '#F5F5F5'; stroke = '#CCC' }

  const cls = isRedFlag ? 'red-flag' : isResult ? 'result' : isActive ? 'active' : 'inactive'

  const lines = node.text.split('\n')
  const textStartY = PAD_Y + LINE_H * 0.75

  const textEls = lines.map((line, i) =>
    `<text x="${pos.x + NODE_W / 2}" y="${pos.y + textStartY + i * LINE_H}" text-anchor="middle" fill="${isResult ? '#FFF' : '#1A1A2E'}" font-family="'Open Sans', sans-serif" font-size="12">${escapeHTML(line)}</text>`
  ).join('')

  return `
    <g class="fc-node ${cls}" data-id="${node.id}" style="cursor:pointer">
      <rect x="${pos.x}" y="${pos.y}" width="${NODE_W}" height="${height}" rx="8" ry="8"
            fill="${fill}" stroke="${stroke}" stroke-width="2" />
      ${textEls}
    </g>
  `
}

function renderEdge(edge, positions, heights) {
  const fp = positions[edge.from]
  const tp = positions[edge.to]
  if (!fp || !tp) return ''

  const fh = heights[edge.from] || 70
  const th = heights[edge.to] || 70
  const isActive = activeEdges.has(`${edge.from}-${edge.to}`)
  const goesRight = tp.x > fp.x + NODE_W / 2

  let x1, y1, x2, y2
  if (goesRight) {
    x1 = fp.x + NODE_W; y1 = fp.y + fh / 2
    x2 = tp.x;          y2 = tp.y + th / 2
  } else {
    x1 = fp.x + NODE_W / 2; y1 = fp.y + fh
    x2 = tp.x + NODE_W / 2; y2 = tp.y
  }

  const strokeColor = isActive ? '#0D47A1' : '#CCC'
  const strokeW = isActive ? 3 : 2

  let labelSVG = ''
  if (edge.label) {
    const lx = goesRight ? (x1 + x2) / 2 : x1 + 10
    const ly = goesRight ? y1 - 8 : (y1 + y2) / 2
    labelSVG = `<text x="${lx}" y="${ly}" font-family="'Open Sans', sans-serif" font-size="11" font-weight="600" fill="#666">${escapeHTML(edge.label)}</text>`
  }

  return `
    <path d="M${x1},${y1} L${x2},${y2}" stroke="${strokeColor}" stroke-width="${strokeW}" fill="none" marker-end="url(#arrowhead)" />
    ${labelSVG}
  `
}

function buildSVG(data) {
  const { pos, heights } = buildLayout(data)

  // Calculate total SVG height
  const allNodes = Object.entries(pos)
  let maxBottom = 0
  for (const [id, p] of allNodes) {
    const bottom = p.y + (heights[id] || 70)
    if (bottom > maxBottom) maxBottom = bottom
  }
  const svgH = maxBottom + 40
  const svgW = 800

  const defs = `<defs><marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="#999" /></marker></defs>`

  const edges = data.flowchart.edges.map(e => renderEdge(e, pos, heights)).join('')
  const nodes = data.flowchart.nodes.map(n =>
    pos[n.id] ? renderNode(n, pos[n.id], heights[n.id]) : ''
  ).join('')

  return `<svg class="flowchart-svg" viewBox="0 0 ${svgW} ${svgH}" xmlns="http://www.w3.org/2000/svg">${defs}${edges}${nodes}</svg>`
}

export function renderFlowchart() {
  const lang = getLang()
  const data = lang === 'fi' ? coughFi : coughEn

  return `<div class="flowchart-container">${buildSVG(data)}</div>`
}

export function bindFlowchart() {
  const lang = getLang()
  const data = lang === 'fi' ? coughFi : coughEn

  // Reset button
  const resetBtn = document.querySelector('.fc-reset-btn')
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      activeNodes = new Set(['start'])
      activeEdges = new Set()
      refreshFlowchart(data)
    })
  }

  // Click on nodes
  document.querySelectorAll('.fc-node').forEach(nodeEl => {
    nodeEl.addEventListener('click', () => {
      const nodeId = nodeEl.dataset.id
      if (!data.flowchart.nodes.find(n => n.id === nodeId)) return

      const outEdges = data.flowchart.edges.filter(e => e.from === nodeId)
      if (outEdges.length === 0) return

      if (outEdges.length === 1) {
        activeNodes.add(nodeId)
        activeNodes.add(outEdges[0].to)
        activeEdges.add(`${outEdges[0].from}-${outEdges[0].to}`)
      } else {
        const currentActive = outEdges.find(e => activeEdges.has(`${e.from}-${e.to}`))
        if (!currentActive) {
          activeNodes.add(nodeId)
          activeNodes.add(outEdges[0].to)
          activeEdges.add(`${outEdges[0].from}-${outEdges[0].to}`)
        } else {
          const idx = outEdges.indexOf(currentActive)
          activeEdges.delete(`${currentActive.from}-${currentActive.to}`)
          activeNodes.delete(currentActive.to)
          deactivateDownstream(currentActive.to, data.flowchart.edges)
          const next = outEdges[(idx + 1) % outEdges.length]
          activeNodes.add(nodeId)
          activeNodes.add(next.to)
          activeEdges.add(`${next.from}-${next.to}`)
        }
      }

      refreshFlowchart(data)
    })
  })

  // Double-click obstruction → asthma page
  const obNode = document.querySelector('.fc-node[data-id="obstruction"]')
  if (obNode) {
    obNode.addEventListener('dblclick', () => {
      window.location.hash = '#/asthma'
    })
  }
}

function deactivateDownstream(nodeId, edges) {
  for (const edge of edges.filter(e => e.from === nodeId)) {
    activeEdges.delete(`${edge.from}-${edge.to}`)
    activeNodes.delete(edge.to)
    deactivateDownstream(edge.to, edges)
  }
}

function refreshFlowchart(data) {
  const container = document.querySelector('.flowchart-container')
  if (!container) return
  container.innerHTML = buildSVG(data)
  bindFlowchart()
}
