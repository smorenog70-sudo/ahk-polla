import { BRAND } from '../lib/brand'

export default function Rules() {
  return (
    <div className="space-y-4">
      <div className="card text-center">
        <img src="/logo.png" alt={BRAND.name} className="w-28 h-28 mx-auto mb-3 rounded-full bg-white p-1" />
        <h1 className="text-xl font-bold mb-2">{BRAND.name}</h1>
        <p className="text-ink-300 text-sm">
          Polla del Mundial 2026 ⚽
        </p>
      </div>

      <div className="card">
        <h2 className="font-semibold mb-2">🎟️ Participación</h2>
        <p className="text-lg font-bold text-accent-500">¡Gratis!</p>
        <p className="text-sm text-ink-300 mt-1">
          Todos pueden participar sin costo. Solo necesitas crear tu cuenta con tu correo.
        </p>
      </div>

      <div className="card">
        <h2 className="font-semibold mb-3">📊 ¿Cómo se puntúa?</h2>
        <ul className="space-y-2 text-sm">
          <li className="flex justify-between"><span>Ganador o empate</span><span className="font-mono text-accent-500">5 pts</span></li>
          <li className="flex justify-between"><span>Marcador exacto</span><span className="font-mono text-accent-500">5 pts</span></li>
          <li className="flex justify-between"><span>Goles del local</span><span className="font-mono text-accent-500">2 pts</span></li>
          <li className="flex justify-between"><span>Goles del visitante</span><span className="font-mono text-accent-500">2 pts</span></li>
          <li className="flex justify-between"><span>Diferencia de gol</span><span className="font-mono text-accent-500">1 pt</span></li>
          <li className="flex justify-between"><span>Posición final en el grupo</span><span className="font-mono text-accent-500">5 pts</span></li>
          <li className="flex justify-between"><span>Mejor tercero</span><span className="font-mono text-accent-500">5 pts</span></li>
        </ul>
        <p className="text-xs text-ink-500 mt-3">
          Los puntos son aditivos: si aciertas el marcador exacto también te dan los 5 de ganador, los 2 del local, los 2 del visitante y 1 de diferencia.
        </p>
      </div>

      <div className="card">
        <h2 className="font-semibold mb-2">⚠️ Reglas clave</h2>
        <ul className="space-y-2 text-sm text-ink-100 list-disc pl-5">
          <li>
            Los pronósticos de <strong>posiciones de grupo</strong> y <strong>mejores terceros</strong>{' '}
            deben quedar ingresados <strong>antes del primer partido</strong> del Mundial. Cuando arranque
            ese partido, esas predicciones se cierran y no podrán modificarse.
          </li>
          <li>
            Cada <strong>marcador de partido</strong> puede ingresarse y modificarse hasta <strong>10 minutos antes</strong> del pitazo inicial.
            Pasado ese momento, el partido se bloquea automáticamente.
          </li>
          <li>
            Si un partido queda sin marcador ingresado, se pierden los puntos de ese partido. No hay excepciones.
          </li>
        </ul>
      </div>

      <div className="card bg-gradient-to-br from-brand-600 to-brand-700 border-accent-500/30">
        <h2 className="font-semibold mb-3 text-accent-400">🏆 Premios</h2>
        <ul className="space-y-3">
          <li className="flex justify-between items-center py-2 border-b border-brand-500/30">
            <span className="text-lg">🥇 1er puesto</span>
            <span className="font-bold text-accent-400">SUPER PREMIO SORPRESA</span>
          </li>
          <li className="flex justify-between items-center py-2 border-b border-brand-500/30">
            <span className="text-lg">🥈 2do puesto</span>
            <span className="font-medium text-ink-100">Premio segundo puesto</span>
          </li>
          <li className="flex justify-between items-center py-2">
            <span className="text-lg">🥉 3er puesto</span>
            <span className="font-medium text-ink-100">Premio tercer puesto</span>
          </li>
        </ul>
      </div>

      <p className="text-center text-ink-300 text-sm py-4">
        ¡Que gane el que más sepa de fútbol! ⚽🏆
      </p>
    </div>
  )
}
