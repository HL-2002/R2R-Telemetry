import { db } from '../db'


const create = async (session) => {
  // descripcion
  // tipo
  // fecha
  // hora
  // cedula
  const { descripcion, tipo, fecha, hora, cedula } = session
  const result = await db.execute(`INSERT INTO session(descripcion, tipo, fecha, hora, cedula) VALUES(?, ?, ?, ?, ?)`, [descripcion, tipo, fecha, hora, cedula])
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


const  sessionModel = {
  create,
  readALL,
  read,
  remove

}

export default sessionModel