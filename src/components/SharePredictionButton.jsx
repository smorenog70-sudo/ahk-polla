import { useRef, useState } from 'react'
import { formatKickoff } from '../lib/matches'

/**
 * Genera una imagen con el pronóstico del usuario usando Canvas
 * y la comparte vía Web Share API (nativo en móvil) o la descarga.
 */
export default function SharePredictionButton({ match, prediction, userName }) {
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')
  const canvasRef = useRef(null)

  // No mostrar si no hay pronóstico
  if (!prediction || prediction.score1 == null || prediction.score2 == null) {
    return null
  }

  const renderImage = async () => {
    const W = 1080
    const H = 1080
    const canvas = document.createElement('canvas')
    canvas.width = W
    canvas.height = H
    const ctx = canvas.getContext('2d')

    // Fondo azul AHK con gradiente
    const grad = ctx.createLinearGradient(0, 0, 0, H)
    grad.addColorStop(0, '#1F3A6E')
    grad.addColorStop(1, '#0c1830')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, W, H)

    // Acento dorado en la parte superior
    ctx.fillStyle = '#F5B400'
    ctx.fillRect(0, 0, W, 12)

    // Cargar logo
    try {
      const logo = await loadImage('/logo.png')
      const logoSize = 140
      ctx.save()
      // fondo blanco circular para el logo
      ctx.beginPath()
      ctx.arc(W / 2, 160, logoSize / 2 + 8, 0, Math.PI * 2)
      ctx.fillStyle = 'white'
      ctx.fill()
      ctx.beginPath()
      ctx.arc(W / 2, 160, logoSize / 2, 0, Math.PI * 2)
      ctx.clip()
      ctx.drawImage(logo, W / 2 - logoSize / 2, 160 - logoSize / 2, logoSize, logoSize)
      ctx.restore()
    } catch (e) { /* sigue sin logo */ }

    // Título
    ctx.fillStyle = '#F5B400'
    ctx.font = 'bold 36px -apple-system, system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('AHK COPA INTERNA', W / 2, 290)
    ctx.fillStyle = '#D3D9DF'
    ctx.font = '24px -apple-system, system-ui, sans-serif'
    ctx.fillText('Mi pronóstico · Mundial 2026', W / 2, 330)

    // Caja del partido
    const boxY = 400
    const boxH = 360
    ctx.fillStyle = 'rgba(255,255,255,0.06)'
    roundRect(ctx, 80, boxY, W - 160, boxH, 24)
    ctx.fill()
    ctx.strokeStyle = '#F5B400'
    ctx.lineWidth = 2
    ctx.stroke()

    // Stage / fecha
    ctx.fillStyle = '#D3D9DF'
    ctx.font = '22px -apple-system, system-ui, sans-serif'
    ctx.textAlign = 'center'
    const stageLabel = match.group ? `Grupo ${match.group}` : stageDisplay(match.stage)
    ctx.fillText(stageLabel, W / 2, boxY + 50)

    // Marcador grande
    ctx.fillStyle = '#FFFFFF'
    ctx.font = 'bold 140px -apple-system, system-ui, sans-serif'
    ctx.fillText(`${prediction.score1} - ${prediction.score2}`, W / 2, boxY + 200)

    // Equipos
    ctx.font = 'bold 36px -apple-system, system-ui, sans-serif'
    ctx.fillStyle = '#FFFFFF'
    ctx.textAlign = 'right'
    ctx.fillText(truncate(match.team1, 16), W / 2 - 60, boxY + 270)
    ctx.textAlign = 'left'
    ctx.fillText(truncate(match.team2, 16), W / 2 + 60, boxY + 270)

    // Fecha del partido
    ctx.fillStyle = '#D3D9DF'
    ctx.font = '22px -apple-system, system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(formatKickoff(match.kickoff_utc), W / 2, boxY + 330)

    // Jugador
    if (userName) {
      ctx.fillStyle = '#F5B400'
      ctx.font = 'bold 32px -apple-system, system-ui, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(`— ${userName} —`, W / 2, 840)
    }

    // Tagline
    ctx.fillStyle = '#D3D9DF'
    ctx.font = '24px -apple-system, system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('¿Estás de acuerdo? Únete y compite 🏆', W / 2, 920)

    // Branding inferior
    ctx.fillStyle = 'rgba(255,255,255,0.4)'
    ctx.font = '20px -apple-system, system-ui, sans-serif'
    ctx.fillText('Cámara de Industria y Comercio Colombo-Alemana', W / 2, 1020)

    return canvas
  }

  const handleShare = async () => {
    setBusy(true)
    setMsg('')
    try {
      const canvas = await renderImage()
      const blob = await new Promise(res => canvas.toBlob(res, 'image/png'))
      const file = new File([blob], `pronostico-${match.id}.png`, { type: 'image/png' })

      // Intentar Web Share API (nativo en móviles modernos)
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Mi pronóstico AHK Copa Interna',
          text: `${match.team1} ${prediction.score1}-${prediction.score2} ${match.team2} — Mi pronóstico para el Mundial 2026`,
        })
        setMsg('✅ Compartido')
      } else {
        // Fallback: descargar
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `pronostico-${match.team1}-vs-${match.team2}.png`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        setMsg('📥 Descargado')
      }
    } catch (e) {
      if (e.name !== 'AbortError') {
        setMsg('❌ Error al compartir')
      }
    } finally {
      setBusy(false)
      setTimeout(() => setMsg(''), 2000)
    }
  }

  return (
    <div className="mt-2 flex items-center justify-end gap-2">
      {msg && <span className="text-xs text-ink-300">{msg}</span>}
      <button
        type="button"
        onClick={handleShare}
        disabled={busy}
        className="text-xs px-2.5 py-1 rounded-full bg-ink-700 hover:bg-ink-600 text-ink-100 transition disabled:opacity-50"
      >
        {busy ? '...' : '📤 Compartir'}
      </button>
    </div>
  )
}

// ---- helpers ----
function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

function truncate(s, n) {
  if (!s) return ''
  return s.length > n ? s.slice(0, n - 1) + '…' : s
}

function stageDisplay(s) {
  return {
    r32: 'Dieciseisavos',
    r16: 'Octavos de final',
    qf: 'Cuartos de final',
    sf: 'Semifinal',
    third: 'Tercer puesto',
    final: 'GRAN FINAL',
  }[s] || 'Partido'
}
