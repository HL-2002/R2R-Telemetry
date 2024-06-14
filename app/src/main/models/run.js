import { db } from '../db'

const create = async (run) => {
  // id
  // duracion
  // id_sesion
  const result = await db.execute(`INSERT INTO run (duration, session_id) VALUES(?, ?)`, [
    run.duration,
    run.session_id
  ])
  return result
}

const readALL = async () => {
  const result = await db.execute(`SELECT * FROM run`)
  return result
}

const read = async (id) => {
  const result = await db.execute(`SELECT * FROM run WHERE id = ?`, [id])
  return result
}

const runModel = {
  create,
  readALL,
  read
}

export default runModel
