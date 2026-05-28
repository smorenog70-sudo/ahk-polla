import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function AdminConfig() {
  const [config, setConfig] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  const load = async () => {
    setLoading(true)
    const { data } = await supabase.from('config').select('*')
    const c = {}
    for (const r of data || []) c[r.key] = r.value
    setConfig(c)
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const set = (key, value) => setConfig(prev => ({ ...prev, [key]: value }))

  const save = async () => {
    setSaving(true)
    setMsg('')
    const rows = [
      { key: 'knockouts_enabled', value: !!config.knockouts_enabled },
    ]
    const { error } = await supabase.from('config').upsert(rows, { onConflict: 'key' })
    setSaving(false)
    if (error) {
      setMsg('❌ ' + error.message)
    } else {
      setMsg('✅ Guardado')
      setTimeout(() => setMsg(''), 2000)
    }
  }

  if (loading) return <div className="text-center text-ink-300 py-8">Cargando…</div>

  return (
    <div className="space-y-3 pb-24">
      <div className="card">
        <h1 className="text-xl font-bold mb-1">🔧 Configuración</h1>
        <p className="text-xs text-ink-300 mt-1">
          Activa esta opción cuando termine la fase de grupos del Mundial.
        </p>
      </div>

      <div className="card">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={!!config.knockouts_enabled}
            onChange={e => set('knockouts_enabled', e.target.checked)}
            className="w-5 h-5 rounded accent-accent-500 mt-0.5"
          />
          <div>
            <div className="font-medium">Habilitar predicciones de eliminatorias</div>
            <div className="text-xs text-ink-500 mt-1">
              Activar cuando termine la fase de grupos. Al activarlo, las predicciones de grupos y mejores terceros se bloquean y se abren las predicciones de octavos, cuartos, etc.
            </div>
          </div>
        </label>
      </div>

      {msg && <div className="text-sm text-center bg-ink-800 rounded-lg px-3 py-2">{msg}</div>}

      <button onClick={save} disabled={saving} className="btn-primary w-full">
        {saving ? 'Guardando…' : '💾 Guardar configuración'}
      </button>
    </div>
  )
}
