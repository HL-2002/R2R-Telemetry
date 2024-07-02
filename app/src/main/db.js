import { createClient } from '@libsql/client'

export const db = createClient({
  url: 'file:./tele.db'
})

// FOR SUICIDED
db.execute('pragma foreign_keys = ON')

// create table client
db.execute(`CREATE TABLE IF NOT EXISTS client (
  cedula INTEGER PRIMARY KEY,
  name TEXT,
  lastname TEXT,
  vehicle TEXT,
  address TEXT
)`)

// create table tax

db.execute(`CREATE TABLE IF NOT EXISTS tax (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  description REAL,
  percentage REAL
)`)

// create table bill

db.execute(`CREATE TABLE IF NOT EXISTS bill (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  total INTEGER,
  cost REAL,
  id_tax INTEGER,
  id_session INTEGER,
  FOREIGN KEY(id_tax) REFERENCES tax(id),
  FOREIGN KEY(id_session) REFERENCES session(id) ON DELETE CASCADE
)`)

// FOR R2R
db.execute(`CREATE TABLE IF NOT EXISTS session (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  description TEXT,
  type TEXT,
  date TEXT,
  time TEXT,
  client_id INTEGER,
  FOREIGN KEY(client_id) REFERENCES client(cedula) ON DELETE CASCADE
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
