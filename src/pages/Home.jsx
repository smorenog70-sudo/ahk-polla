import { Link } from 'react-router-dom'
import { useMemo } from 'react'
import { useAuth } from '../lib/auth'
import { useLeagueData } from '../lib/useLeagueData'
import { TOURNAMENT, formatKickoff, isMatchLocked } from '../lib/matches'
import {
  scoreMatch,
  scoreGroupPositions,
  scoreThirds,
} from '../lib/scoring'
import PendingMatchesBanner from '../components/PendingMatchesBanner'
import NewResultsBanner from '../components/NewResultsBanner'
import { useNewResults } from '../lib/useNewResults'

export default function Home() {
  const { user, profile } = useAuth()
  const data = useLeagueData()
  const { newResults, totalNewPoints, dismiss: dismissResults } = useNewResults(user.id)

  const myPreds = useMemo(
    () => data.predictions.filter(p => p.user_id === user.id),
    [data.predictions, user.id]
  )

  const stats = useMemo(() => {
    const myGroupPreds = data.groupPreds.filter(p => p.user_id === user.id)
    const myThirdPreds = data.thirdPreds.filter(p => p.user_id === user.id)

    const resultsById = new Map(data.results.map(r => [r.match_id, r]))
    let pts = 0
    for (const p of myPreds) {
      const r = resultsById.get(p.match_id)
      if (r) pts += scoreMatch(p, r).total
    }
    pts += scoreGroupPositions(myGroupPreds, data.groupResults).total
    pts += scoreThirds(myThirdPreds.map(t => t.team), data.thirdResults.map(t => t.team)).total

    return {
      myPreds: myPreds.length,
      myGroupPreds: myGroupPreds.length,
      myThirdPreds: myThirdPreds.length,
      myPoints: pts,
      players: data.profiles.length,
    }
  }, [data, user.id, myPreds])

  const nextMatch = useMemo(() => {
    const now = Date.now()
    return TOURNAMENT.matches
      .filter(m => m.kickoff_utc && new Date(m.kickoff_utc).getTime() > now)
      .sort((a, b) => new Date(a.kickoff_utc) - new Date(b.kickoff_utc))[0]
  }, [])

  if (data.loading) return <div className="text-center text-ink-300 py-8">Cargando…</div>

  return (
    <div className="space-y-4">
      <div className="card">
        <p className="text-sm text-ink-300">¡Hola{profile?.display_name ? `, ${profile.display_name.split(' ')[0]}` : ''}! 👋</p>
        <h1 className="text-xl font-bold mt-1">AHK Copa Interna · Mundial 2026</h1>
        <p className="text-xs text-ink-300 mt-1">¡Pronostica y compite por el SUPER PREMIO SORPRESA!</p>
      </div>

      {/* Notificación de resultados nuevos (toast persistente) */}
      <NewResultsBanner
        newResults={newResults}
        totalNewPoints={totalNewPoints}
        dismiss={dismissResults}
      />

      {/* Banner de partidos pendientes / próximos: se actualiza solo cada 30s */}
      <PendingMatchesBanner userPredictions={myPreds} />

      <div className="grid grid-cols-2 gap-3">
        <div className="card text-center">
          <div className="text-xs text-ink-300 uppercase tracking-wider">Mis puntos</div>
          <div className="text-3xl font-bold text-accent-500 mt-1">{stats.myPoints}</div>
        </div>
        <div className="card text-center">
          <div className="text-xs text-ink-300 uppercase tracking-wider">Participantes</div>
          <div className="text-3xl font-bold text-accent-500 mt-1">{stats.players}</div>
        </div>
      </div>

      {nextMatch && (
        <div className="card">
          <div className="text-xs uppercase text-ink-300 tracking-wider mb-2">Próximo partido</div>
          <div className="flex items-center justify-between">
            <div className="flex-1 text-center">
              <div className="font-semibold">{nextMatch.team1}</div>
            </div>
            <div className="px-3 text-ink-500 text-sm">vs</div>
            <div className="flex-1 text-center">
              <div className="font-semibold">{nextMatch.team2}</div>
            </div>
          </div>
          <div className="text-center text-xs text-ink-300 mt-2">
            {formatKickoff(nextMatch.kickoff_utc)}
            {isMatchLocked(nextMatch) && <span className="ml-2 text-red-400">🔒 Cerrado</span>}
          </div>
        </div>
      )}

      <div className="card space-y-2">
        <h3 className="font-semibold mb-2">Mis pronósticos</h3>
        <Link to="/predicciones" className="flex items-center justify-between py-2 border-b border-ink-700">
          <span>⚽ Partidos</span>
          <span className="text-sm text-ink-300">{stats.myPreds} / {TOURNAMENT.matches.length}</span>
        </Link>
        <Link to="/grupos" className="flex items-center justify-between py-2 border-b border-ink-700">
          <span>🅰️ Posiciones de grupo</span>
          <span className="text-sm text-ink-300">{stats.myGroupPreds} / 48</span>
        </Link>
        <Link to="/terceros" className="flex items-center justify-between py-2">
          <span>🥉 Mejores terceros</span>
          <span className="text-sm text-ink-300">{stats.myThirdPreds} / 8</span>
        </Link>
      </div>

      <div className="card bg-gradient-to-br from-brand-600 to-brand-700 border-accent-500/30">
        <h3 className="font-semibold mb-3 text-accent-400">🏆 Premios</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between py-1 border-b border-brand-500/30">
            <span>🥇 1er puesto</span>
            <span className="font-bold text-accent-400">SUPER PREMIO SORPRESA</span>
          </div>
          <div className="flex items-center justify-between py-1 border-b border-brand-500/30">
            <span>🥈 2do puesto</span>
            <span className="font-medium text-ink-100">Premio segundo puesto</span>
          </div>
          <div className="flex items-center justify-between py-1">
            <span>🥉 3er puesto</span>
            <span className="font-medium text-ink-100">Premio tercer puesto</span>
          </div>
        </div>
      </div>

      <Link to="/comunidad" className="block card text-center text-accent-500 hover:bg-ink-700">
        📊 Ver estadísticas comunales
      </Link>

      <Link to="/reglas" className="block card text-center text-accent-500 hover:bg-ink-700">
        📜 Ver reglas completas
      </Link>
    </div>
  )
}
