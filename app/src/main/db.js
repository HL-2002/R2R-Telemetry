import { createClient } from '@libsql/client'

export const db = createClient({
  url: 'file:./tele.db'
})

// FOR SUICIDED

// create table client
db.execute(`CREATE TABLE IF NOT EXISTS client (
  cedula TEXT PRIMARY KEY,
  name TEXT,
  lastname TEXT,
  vehicle TEXT,
  address TEXT
)`)

// create table tax

db.execute(`CREATE TABLE IF NOT EXISTS tax (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  description TEXT,
  percentage INTEGER
)`)

// create table bill

db.execute(`CREATE TABLE IF NOT EXISTS bill (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  total INTEGER,
  cost INTEGER,
  id_tax INTEGER,
  id_session INTEGER,
  FOREIGN KEY(id_tax) REFERENCES tax(id),
  FOREIGN KEY(id_session) REFERENCES session(id)
)`)

// FOR R2R
db.execute(`CREATE TABLE IF NOT EXISTS session (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  description TEXT,
  type TEXT,
  date TEXT,
  time TEXT,
  client_id TEXT,
  FOREIGN KEY(client_id) REFERENCES client(cedula)
)`)

// create table run

db.execute(`CREATE TABLE IF NOT EXISTS run (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  duration INTEGER,
  session_id INTEGER,
  FOREIGN KEY(session_id) REFERENCES session(id)
)`)

// create entry
db.execute(`CREATE TABLE IF NOT EXISTS entry (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  velocity INTEGER,
  rpms INTEGER,
  gear INTEGER,
  acceleration INTEGER,
  brake INTEGER,
  lateral_g INTEGER,
  tire_pressure INTEGER,
  steering_angle INTEGER,
  fuel INTEGER,
  temperature INTEGER,
  oil_pressure INTEGER,
  run_id INTEGER,
  FOREIGN KEY(run_id) REFERENCES run(id)
)
  `)
