import { db } from '../db'

const create = async (session) => {
  // descripcion
  // tipo
  // fecha
  // hora
  // cedula
  const { description, type, date, time, cedula } = session
  const result = await db.execute(
    `INSERT INTO session (description, type, date, time, cedula) VALUES(?, ?, ?, ?, ?)`,
    [description, type, date, time, cedula]
  )
  return result
}

const readALL = async () => {
  const result = await db.execute(`SELECT * FROM session`)
  return result
}

const read = async (id) => {
  const result = await db.execute(`SELECT * FROM session WHERE id = ?`, [id])
  return result
}

const remove = async (id) => {
  const result = await db.execute(`DELETE FROM session WHERE id = ?`, [id])
  return result
}

const sessionModel = {
  create,
  readALL,
  read,
  remove
}

export default sessionModel
