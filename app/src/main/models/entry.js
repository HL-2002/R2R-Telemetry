import { db } from '../db'

const create = async (entry) => {
  const result = await db.execute(
    `INSERT INTO entry (velocity, rpms, gear, acceleration, brake, lateral_g, tire_pressure, steering_angle, fuel, temperature, oil_pressure, run_id
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
    ?
    )`,
    [
      entry.velocity,
      entry.rpms,
      entry.gear,
      entry.acceleration,
      entry.brake,
      entry.lateral_g,
      entry.tire_pressure,
      entry.steering_angle,
      entry.fuel,
      entry.temperature,
      entry.oil_pressure,
      entry.run_id
    ]
  )
  return result
}

const readALL = async () => {
  const result = await db.execute(`SELECT * FROM entry`)
  return result
}

const read = async (id) => {
  const result = await db.execute(`SELECT * FROM entry WHERE id = ?`, [id])
  return result
}

const entryModel = {
  create,
  readALL,
  read
}

export default entryModel
