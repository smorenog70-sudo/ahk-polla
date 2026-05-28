# AHK Copa Interna · Polla Mundial 2026 ⚽

Aplicación web responsive de polla deportiva para el Mundial FIFA 2026, personalizada para la Cámara de Industria y Comercio Colombo-Alemana (AHK Colombia).

**Stack:** React + Vite + Tailwind (frontend) · Supabase (auth + Postgres + RLS) · Netlify (hosting).

**Características principales:**
- Participación gratuita (sin pago de entrada)
- Sesión persistente: el usuario solo se loggea una vez por dispositivo
- Branding AHK: logo, colores institucionales (azul + dorado)
- Pronósticos de los 104 partidos del Mundial 2026
- Pronósticos de posiciones de grupo y mejores terceros
- Tabla de posiciones en tiempo real
- Premios: 🥇 SUPER PREMIO SORPRESA · 🥈 Premio segundo puesto · 🥉 Premio tercer puesto

---

## 🚀 Despliegue paso a paso

### 1. Crear proyecto en Supabase

1. Entra a [supabase.com](https://supabase.com) y crea cuenta gratuita.
2. Click **New Project**. Ponle nombre `ahk-copa-interna`, contraseña fuerte para la DB, región más cercana (`us-east` o `sa-east`).
3. Espera ~2 min a que el proyecto se aprovisione.

### 2. Cargar el schema

1. En el dashboard: **SQL Editor** → **New query**.
2. Copia y pega el contenido completo de `supabase_schema.sql`.
3. Click **Run**. Debe decir "Success" sin errores.

### 3. Obtener credenciales

1. En el dashboard: **Project Settings** → **API**.
2. Anota:
   - **Project URL** (ej. `https://abcdefgh.supabase.co`)
   - **anon public** key (string largo que empieza con `eyJ…`)

### 4. Desactivar confirmación de email (recomendado)

**Authentication → Sign In / Up → Email** → desactiva *Confirm email* para que los usuarios entren inmediato sin verificar.

### 5. Probar local

```bash
npm install
cp .env.example .env.local
```

Edita `.env.local` con tus credenciales de Supabase. Luego:

```bash
npm run dev
```

Abre `http://localhost:5173`.

### 6. Crear cuenta admin

1. Click **Regístrate** en la app y crea tu cuenta normal.
2. Vuelve al **SQL Editor** de Supabase y corre:

```sql
update profiles
set is_admin = true
where display_name ilike '%TU_NOMBRE%';
```

Refresca la app y verás la sección **Admin** en el menú hamburguesa.

### 7. Subir a GitHub y desplegar en Netlify

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/ahk-copa-interna.git
git push -u origin main
```

En [netlify.com](https://app.netlify.com): **Add new site → Import from Git** → conecta tu repo. Netlify autodetecta la configuración por `netlify.toml`.

**Environment variables**: agrega:
- `VITE_SUPABASE_URL` = URL de Supabase
- `VITE_SUPABASE_ANON_KEY` = anon key

Click **Deploy site**.

---

## 📱 Flujo de uso

### Para los participantes
1. Se registran con nombre + email + contraseña
2. La sesión queda guardada en su dispositivo (no tienen que volver a loggear)
3. Hacen sus predicciones:
   - **Partidos**: marcador de cada partido (cierra 10 min antes del pitazo)
   - **Grupos**: orden 1º a 4º de cada grupo (cierra al activar eliminatorias)
   - **Terceros**: 8 equipos mejores terceros (cierra al activar eliminatorias)
4. Ven su ranking en **Tabla** en tiempo real

### Para el admin AHK
- **Admin → Marcadores**: después de cada partido, ingresa el resultado real.
- **Admin → Resultados Grupos**: cuando termine fase de grupos, mete el orden real 1-4 de cada grupo.
- **Admin → Mejores Terceros**: marca los 8 equipos que clasificaron como mejor tercero.
- **Admin → Usuarios**: ver lista de participantes y nombrar otros admins.
- **Admin → Config**: cuando termine la fase de grupos, activa el toggle **Habilitar predicciones de eliminatorias**. Esto bloquea grupos/terceros y abre los 32 partidos de eliminación.

---

## 🧮 Sistema de puntos

Por partido:
- Ganador o empate: **5 pts**
- Marcador exacto: **+5 pts**
- Goles del local correctos: **+2 pts**
- Goles del visitante correctos: **+2 pts**
- Diferencia de gol correcta: **+1 pt**

Bonificaciones:
- Cada posición exacta de grupo acertada: **5 pts**
- Cada equipo correcto entre los 8 mejores terceros: **5 pts**

---

## 🏆 Premios
- 🥇 1er puesto: **SUPER PREMIO SORPRESA**
- 🥈 2do puesto: Premio segundo puesto
- 🥉 3er puesto: Premio tercer puesto

(Los premios físicos los gestiona AHK Colombia.)

---

## 🛠️ Mantenimiento

### Costos
- Supabase free: hasta 500MB de DB + 50k MAUs.
- Netlify free: 100GB de bandwidth/mes.
- **Total: 0 USD/mes** para uso típico de AHK.

### Backup de la base de datos
Supabase trae backup automático en planes pagos. En free puedes descargar dump manual desde **Database → Backups**.

---

## 📁 Estructura del proyecto

```
ahk-copa-interna/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── netlify.toml
├── supabase_schema.sql
├── scripts/
│   └── build_fixtures.py
├── public/
│   ├── logo.png            ← logo AHK Copa Interna
│   └── favicon.png
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── data/fixtures.json   ← 104 partidos Mundial 2026
    ├── lib/
    │   ├── supabase.js      ← auth con persistencia
    │   ├── auth.jsx
    │   ├── scoring.js
    │   ├── matches.js
    │   └── useLeagueData.js
    ├── components/Layout.jsx
    └── pages/
        ├── Login.jsx
        ├── Signup.jsx
        ├── Home.jsx
        ├── Predictions.jsx
        ├── GroupsPredictions.jsx
        ├── ThirdsPredictions.jsx
        ├── Standings.jsx
        ├── Rules.jsx
        └── Admin*.jsx       ← 5 páginas de admin
```

---

## ⚠️ Notas importantes

- **Bloqueo de partidos**: 10 minutos antes del kickoff. El cálculo es del lado del cliente.
- **Predicciones de grupos y terceros**: se cierran cuando el admin activa el toggle `knockouts_enabled` en Admin → Config. Recomendación: activarlo antes del primer partido del Mundial (México-Sudáfrica, 11 de junio de 2026).
- **Sesión persistente**: los usuarios solo se loggean una vez por dispositivo. Sus credenciales quedan guardadas en localStorage del navegador.

---

Desarrollado por Santiago Moreno · smorenog70@gmail.com
