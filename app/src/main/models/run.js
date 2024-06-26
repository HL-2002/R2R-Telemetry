import { db } from '../db'

const create = async (run) => {
  // id
  // duracion
  // id_sesion
  const result = await db.execute({
    sql: `INSERT INTO run (duration, session_id) VALUES(?, ?)`,
    args: [run.duration, run.session_id]
  })
  return result
}

const readALL = async () => {
  const result = await db.execute(`SELECT * FROM run`)
  return result
}

const read = async (id) => {
  const result = await db.execute({ sql: `SELECT * FROM run WHERE id = ?`, args: [id] })
  return result
}

const updateRunDuration = async (id, duration) => {
  const result = await db.execute({
    sql: `UPDATE run SET duration = ? WHERE id = ?`,
    args: [duration, id]
  })
  return result
}

const runModel = {
  create,
  readALL,
  read,
  updateRunDuration
}

export default runModel
