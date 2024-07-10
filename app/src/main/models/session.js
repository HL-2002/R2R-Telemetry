import { db } from '../db'

const create = async (session) => {
  // descripcion
  // tipo
  // fecha
  // hora
  // cedula
  const { description, type, date, time } = session
  const result = await db.execute({
    sql: `INSERT INTO session (description, type, date, time) VALUES(?, ?, ?, ?)`,
    args: [description, type, date, time]
  })
  return result
}

const readALL = async () => {
  const result = await db.execute(`SELECT * FROM session`)
  return result
}

const read = async (id) => {
  const result = await db.execute({ sql: `SELECT * FROM session WHERE id = ?`, args: [id] })
  return result
}

const remove = async (id) => {
  const result = await db.execute({ sql: `DELETE FROM session WHERE id = ?`, args: [id] })
  return result
}

const sessionModel = {
  create,
  readALL,
  read,
  remove
}

export default sessionModel
