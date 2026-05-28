import { useMemo, useState } from 'react'
import { useLeagueData } from '../lib/useLeagueData'
import { fechaMatchIds, FECHA_LABELS } from '../lib/matches'
import {
  scoreMatch,
  scoreGroupPositions,
  scoreThirds,
} from '../lib/scoring'

const FECHA_FILTERS = [
  { id: 'total', label: 'Total' },
  { id: 'group-F1', label: 'Fecha 1' },
  { id: 'group-F2', label: 'Fecha 2' },
  { id: 'group-F3', label: 'Fecha 3' },
  { id: 'r32', label: '16avos' },
  { id: 'r16', label: 'Octavos' },
  { id: 'qf', label: 'Cuartos' },
  { id: 'sf', label: 'Semis' },
  { id: 'third', label: '3er' },
  { id: 'final', label: 'Final' },
]

export default function Standings() {
  const data = useLeagueData()
  const [filter, setFilter] = useState('total')

  const rows = useMemo(() => {
    if (data.loading) return []
    const predsByUser = new Map()
    for (const p of data.predictions) {
      if (!predsByUser.has(p.user_id)) predsByUser.set(p.user_id, [])
      predsByUser.get(p.user_id).push(p)
    }
    const gpByUser = new Map()
    for (const g of data.groupPreds) {
      if (!gpByUser.has(g.user_id)) gpByUser.set(g.user_id, [])
      gpByUser.get(g.user_id).push(g)
    }
    const tpByUser = new Map()
    for (const t of data.thirdPreds) {
      if (!tpByUser.has(t.user_id)) tpByUser.set(t.user_id, [])
      tpByUser.get(t.user_id).push(t.team)
    }
    const resultsById = new Map(data.results.map(r => [r.match_id, r]))
    const actualThirds = data.thirdResults.map(r => r.team)

    const inScope = (matchId) => {
      if (filter === 'total') return true
      const ids = fechaMatchIds(filter)
      return ids.includes(matchId)
    }

    return data.profiles.map(prof => {
      const myPreds = predsByUser.get(prof.id) || []
      let matchPts = 0
      for (const p of myPreds) {
        if (!inScope(p.match_id)) continue
        const r = resultsById.get(p.match_id)
        if (r) matchPts += scoreMatch(p, r).total
      }
      let bonusPts = 0
      if (filter === 'total') {
        bonusPts += scoreGroupPositions(gpByUser.get(prof.id) || [], data.groupResults).total
        bonusPts += scoreThirds(tpByUser.get(prof.id) || [], actualThirds).total
      }
      return {
        id: prof.id,
        name: prof.display_name,
        is_admin: prof.is_admin,
        match_points: matchPts,
        bonus_points: bonusPts,
        total: matchPts + bonusPts,
      }
    }).sort((a, b) => b.total - a.total)
  }, [data, filter])

  if (data.loading) return <div className="text-center text-ink-300 py-8">Cargando…</div>

  return (
    <div className="space-y-3">
      <div className="card">
        <h1 className="text-xl font-bold mb-1">🏆 Tabla de posiciones</h1>
        <p className="text-xs text-ink-300">
          {filter === 'total'
            ? 'Acumulado total con todas las predicciones.'
            : `Solo los puntos de ${FECHA_LABELS[filter] || filter}.`}
        </p>
      </div>

      <div className="flex gap-1 overflow-x-auto -mx-1 px-1 pb-1 sticky top-14 bg-ink-900 z-20 py-1">
        {FECHA_FILTERS.map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap ${
              filter === f.id ? 'bg-brand-600 text-white' : 'bg-ink-800 text-ink-300'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="card overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead className="bg-ink-700 text-ink-300 text-xs uppercase">
            <tr>
              <th className="py-2 px-3 text-left">#</th>
              <th className="py-2 px-2 text-left">Jugador</th>
              <th className="py-2 px-2 text-right">Pts</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, idx) => (
              <tr
                key={r.id}
                className={`border-t border-ink-700 ${
                  idx === 0 && filter === 'total' ? 'bg-accent-500/10' :
                  idx === 1 && filter === 'total' ? 'bg-ink-700/40' :
                  idx === 2 && filter === 'total' ? 'bg-ink-700/20' : ''
                }`}
              >
                <td className="py-2 px-3 font-mono text-ink-300">
                  {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : idx + 1}
                </td>
                <td className="py-2 px-2">
                  <div className="font-medium">{r.name}</div>
                  {r.is_admin && (
                    <div className="text-xs text-accent-500">admin</div>
                  )}
                </td>
                <td className="py-2 px-2 text-right">
                  <div className="font-bold">{r.total}</div>
                  {filter === 'total' && r.bonus_points > 0 && (
                    <div className="text-xs text-ink-500">+{r.bonus_points} bonus</div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filter === 'total' && rows.length >= 3 && (
        <div className="card bg-gradient-to-br from-brand-600 to-brand-700 border-accent-500/30">
          <div className="text-xs uppercase tracking-wider text-accent-400 mb-2">Premios actuales</div>
          <div className="space-y-1.5 text-sm">
            <div className="flex items-center justify-between">
              <span>🥇 {rows[0].name}</span>
              <span className="font-bold text-accent-400">SUPER PREMIO SORPRESA</span>
            </div>
            <div className="flex items-center justify-between">
              <span>🥈 {rows[1].name}</span>
              <span className="text-ink-100">Premio segundo puesto</span>
            </div>
            <div className="flex items-center justify-between">
              <span>🥉 {rows[2].name}</span>
              <span className="text-ink-100">Premio tercer puesto</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
