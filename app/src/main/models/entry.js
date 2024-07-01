import { db } from '../db'

const create = async (entry) => {
  const result = await db.execute({
    sql: `
  INSERT INTO entry (
  velocity,
  rpms,
  gear,
  throttle,
  brake,
  lateral_g, 
  tire_pressure_fr,
  tire_pressure_fl,
  tire_pressure_rr,
  tire_pressure_rl,
  steering_angle, 
  fuel, 
  temperature, 
  oil_pressure, 
  run_id,
  time,
  distance
    ) VALUES(
    ?,
    ?,
    ?,
    ?,
    ?,
    ?,
    ?,
    ?,
    ?,
    ?,
    ?,
    ?,
    ?,
    ?,
    ?,
    ?,
    ?
    )`,
    args: [
      entry.velocity,
      entry.rpms,
      entry.gear,
      entry.throttle,
      entry.brake,
      entry.lateral_g,
      entry.tire_pressure_fr,
      entry.tire_pressure_fl,
      entry.tire_pressure_rr,
      entry.tire_pressure_rl,
      entry.steering_angle,
      entry.fuel,
      entry.temperature,
      entry.oil_pressure,
      entry.run_id,
      entry.time,
      entry.distance
    ]
  })
  return result
}

const readALL = async () => {
  const result = await db.execute(`SELECT * FROM entry`)
  return result
}

const read = async (id) => {
  const result = await db.execute({ sql: `SELECT * FROM entry WHERE id = ?`, args: [id] })
  return result
}

const getEntryByRunId = async (run_id) => {
  const result = await db.execute({ sql: `SELECT * FROM entry WHERE run_id = ?`, args: [run_id] })
  return result
}

const entryModel = {
  create,
  readALL,
  read,
  getEntryByRunId
}

export default entryModel
