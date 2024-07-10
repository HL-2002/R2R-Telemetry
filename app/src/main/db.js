import { createClient } from '@libsql/client'

export const db = createClient({
  url: 'file:./tele.db'
})
db.execute('pragma foreign_keys = ON')

// FOR R2R
db.execute(`CREATE TABLE IF NOT EXISTS session (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  description TEXT,
  type TEXT,
  date TEXT,
  time TEXT
)`)

// create table run

db.execute(`CREATE TABLE IF NOT EXISTS run (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  duration INTEGER,
  session_id INTEGER,
  hour TEXT,
  FOREIGN KEY(session_id) REFERENCES session(id) ON DELETE CASCADE
)`)

// create entry
db.execute(`CREATE TABLE IF NOT EXISTS entry (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  velocity INTEGER,
  rpms INTEGER,
  gear INTEGER,
  throttle REAL,
  brake REAL,
  lateral_g REAL,
  tire_pressure_fr REAL,
  tire_pressure_fl REAL,
  tire_pressure_rr REAL,
  tire_pressure_rl REAL,
  steering_angle REAL,
  fuel REAL,
  temperature REAL,
  oil_pressure REAL,
  run_id INTEGER,
  time REAL,
  distance REAL,
  FOREIGN KEY(run_id) REFERENCES run(id) ON DELETE CASCADE
)
  `)
